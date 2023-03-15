import express from 'express';
import bodyParser from 'body-parser';
import { PORT } from "./util/constants";
import {filteredImageGETHandler} from "./controllers/filteredimage/service";

(async () => {

  const app = express();
  app.use(bodyParser.json());


  app.get( "/filteredimage", filteredImageGETHandler);

  app.get( "/", async ( req, res ) => {
    res.sendStatus(404);
  } );

  // Start the Server
  app.listen( PORT, () => {
      console.log( `server running http://localhost:${ PORT }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();