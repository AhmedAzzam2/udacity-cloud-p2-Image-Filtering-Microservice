// import express from 'express'; typescript
import express, { Express, Request, Response } from 'express';


import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {


  // Init the Express application
  // const app = express(); changed to: typescript 
  const app: Express = express();

  // Set the network port
  const port: any = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  // app.use(bodyParser.json()); changed to typescript
  app.use(bodyParser.json());

  
  
  // @TODO2 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.


 let image_url: string = '';
  app.get( "/filteredimage", async ( req: Request, res: Response ) => {
    let { image_url } :{image_url:string} = req.query
    if ( !image_url ) {
      return res.status(400)
        .send(`image_url is required as a query parameter`);
    }
    try {
      const filteredpath = await filterImageFromURL(image_url);
      res.status(200).sendFile(filteredpath, () => {
        deleteLocalFiles([filteredpath]);
      });
    } catch (error) {
      res.status(422).send(`Unable to process image`);
    }
  } );


  
  // Root Endpoint
  // Displays a simple message to the user
app.get('/', async(req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  app.get("*", (req: Request, res: Response) => {
    res.status(404).send("404 Not Found");
  });
  
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();