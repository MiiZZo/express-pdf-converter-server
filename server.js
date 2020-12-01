const express = require('express');
const htmlToPdf = require('html-pdf');
const cors = require('cors');
const fs = require('fs');

const PORT = process.env.PORT | 3000;

const bootstrap = async () => {
  try {
    const app = express();
    app.use(express.json());

    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      next();
    });

    app.post('/', async (req, res) => {
      try {
        const {
          html,
          width,
          height
        } = req.body;

        htmlToPdf.create(html, {
          width: `${width}px`,
          height: `${height}px`,
          
        }).toStream((err, pdfStream) => {
          if (err) {   
            // handle error and return a error response code
            console.log(err)
            return res.sendStatus(500)
          } else {
            // send a status code of 200 OK
            res.statusCode = 200             
      
            // once we are done reading end the response
            pdfStream.on('end', () => {
              // done reading
              return res.end()
            });
      
            // pipe the contents of the PDF directly to the response
            pdfStream.pipe(res)
          }
        })
      } catch (e) {
        console.log(e);
      }
    });

    app.listen(PORT, () => {
      console.log('SERVER STARTED');
    });
  } catch (e) {
    console.log('error while server is starting', e);
  }
}

bootstrap();
