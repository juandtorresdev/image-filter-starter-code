import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // filteredImage Endpoint
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get("/filteredimage/", (req, res) => {
    let image_url: string = req.query.image_url;
    if (!image_url) {
      return res.status(400).send("missing image_url");
    }
    filterImageFromURL(image_url)
      .then(localPath => {
        return res.status(200).sendFile(localPath, error => {
          if (!error) {
            let filePathToDelete: string[] = [localPath];
            deleteLocalFiles(filePathToDelete);
          }
        });
      }).catch((error) => {
        return res.status(422).send("could not process image: " + error);
      });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();