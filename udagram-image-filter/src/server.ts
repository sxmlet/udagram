import express from 'express';
import bodyParser from 'body-parser';
import { getUriFromRequest } from './util/util';
import IndexRouter from './controllers/v0/index.router';
import { PORT } from "./util/constants";

(async () => {

  const app = express();
  app.use(bodyParser.json());

  app.use('/api/v0', IndexRouter);

  app.get( "/api/v0", async ( req, res ) => {
    res.send({
      routes: [
        getUriFromRequest(req, '/filteredimage')
      ],
    })
  });

  app.get( "/", async ( req, res ) => {
    res.send({
      routes: [
        getUriFromRequest(req, 'api/v0')
      ],
    })
  } );

  // Start the Server
  app.listen( PORT, () => {
      console.log( `server running http://localhost:${ PORT }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();