import {Router, Request, Response, json} from 'express';
import {FeedItem} from '../models/FeedItem';
import {requireAuth} from '../../users/routes/auth.router';
import * as AWS from '../../../../aws';
import Bluebird from 'bluebird';
import { ErrorWithCode } from '../../../../libs/errors';


const router: Router = Router();

const findById = async (req: Request): Promise<Bluebird<FeedItem>> => {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        throw new ErrorWithCode('id is not a number', 400);
    }

    const item = await FeedItem.findByPk(id);
    if (!item) {
        throw new ErrorWithCode('resource not found', 404);
    }
    return item;
};

// Get all feed items.
router.get('/', async (req: Request, res: Response) => {
  const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
  items.rows.map(async (item) => {
    if (item.url) {
      item.url = await AWS.getGetSignedUrl(item.url);
    }
  });
  return res.send(items);
});

// Get a feed item.
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const item = await findById(req);
    return res.status(200).send(item);
  } catch (err) {
    if (err instanceof ErrorWithCode) {
      return res.status(err.getCode()).send(err.message);
    }
    return res.status(500).send('unknown server error');
  }
});

// Update a specific feed item.
router.patch('/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { caption } = req.body;
    try {
      const item = await findById(req);
      item.caption = caption;
      item.save();

      return res.status(200).send(item);
    } catch (err) {
      if (err instanceof ErrorWithCode) {
        return res.status(err.getCode()).send(err.message);
      }
      return res.status(500).send('unknown server error');
    }
  });


// Get a signed url to put a new item in the bucket.
router.get('/signed-url/:fileName',
  requireAuth,
  async (req: Request, res: Response) => {
    const { fileName } = req.params;
    const url = await AWS.getPutSignedUrl(fileName);
    return res.status(201).send({url: url});
  });

// Post meta data and the filename after a file is uploaded.
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/',
  requireAuth,
  async (req: Request, res: Response) => {
    const caption = req.body.caption;
    const fileName = req.body.url;

    // check Caption is valid
    if (!caption) {
      return res.status(400).send({message: 'Caption is required or malformed'});
    }

    // check Filename is valid
    if (!fileName) {
      return res.status(400).send({message: 'File url is required'});
    }

    const item = await new FeedItem({
      caption: caption,
      url: fileName
    });

    const saved_item = await item.save();

    saved_item.url = await AWS.getGetSignedUrl(saved_item.url);
    return res.status(201).send(saved_item);
  });

export const FeedRouter: Router = router;
