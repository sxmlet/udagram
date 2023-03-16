import {Request, Response} from "express";
import validUrl from "valid-url";
import axios, {AxiosError, AxiosResponse} from "axios";

import {newResponseError} from "../../util/errors";
import {deleteLocalFiles, filterImageFromBuffer} from "./domain";


// GET handler for /filteredimage endpoint.
export const filteredImageGETHandler = async (req: Request, resp: Response) => {
  const imageUrl = req.query.image_url as string;
  if (!imageUrl) {
    return resp.status(400).send(newResponseError('image_url query param must be specified', 1));
  }

  if (!validUrl.isWebUri(imageUrl)) {
    return resp.status(400).send(newResponseError('provided image_url contains invalid uri', 2));
  }

  let res: AxiosResponse;
  try {
    res = await axios(imageUrl, {
      method: 'get',
      responseType: 'arraybuffer',
    });
  } catch (err: any) {
    const status = err.response.status;
    if (status === 404) {
      return resp.status(400).send(newResponseError('provided resource is not found', 3));
    }

    if (status !== 200) {
      return resp.status(400).send(newResponseError(`provided image could not be fetched: ${err.response.data}`, 4));
    }
  }

  try {
    const url = await filterImageFromBuffer(res.data);
    resp.sendFile(url);
    resp.on('finish', () => {
      deleteLocalFiles([url]);
      console.log(`file "${url}" has been deleted`);
    })
  } catch (err) {
    resp.status(422).send(newResponseError(`error occurred during filtering: ${err}`, 5));
  }
}
