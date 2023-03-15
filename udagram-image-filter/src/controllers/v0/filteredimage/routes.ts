import {Router, Request, Response} from 'express';
import {deleteLocalFiles, filterImageFromURL} from "./service";
import {newResponseError} from "../../../util/errors";
import validUrl from 'valid-url';
import axios from 'axios';

export const FilterImageRouter: Router = Router();

FilterImageRouter.get('/', async (req: Request, resp: Response) => {
    const {image_url} = req.query
    if (!image_url) {
        resp.status(400).send(newResponseError('image_url query param must be specified', 1));
        return;
    }

    if (!validUrl.isWebUri(image_url)) {
        resp.status(400).send(newResponseError('provided image_url contains invalid uri', 2));
        return;
    }

    try {
        await axios.get(image_url);
    } catch (err) {
        const status = err.response.status;
        if (status === 404) {
            resp.status(400).send(newResponseError('provided resource is not found', 3));
            return;
        }

        if (status !== 200) {
            resp.status(400).send(newResponseError(`provided image could not be fetched: ${err.response.data}`, 4));
            return;
        }
    }

    try {
      const url = await filterImageFromURL(image_url);
      resp.sendFile(url);
      resp.on('finish', () => {
          deleteLocalFiles([url]);
          console.log(`file "${url}" has been deleted`);
      })
    }
    catch(err) {
        resp.status(500).send(newResponseError(`error occurred during filtering: ${err}`, 5));
    }
})
