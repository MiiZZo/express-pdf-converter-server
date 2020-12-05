const express = require('express');
const htmlToPdf = require('html-pdf');
const pdfcrowd = require("pdfcrowd");
const cors = require('cors');


const PORT = process.env.PORT | 3001;

const bootstrap = async () => {
  try {
    const client = new pdfcrowd.HtmlToPdfClient("miizzo", "922cba8e1dfa5dcb80f30dd23bbe0165");
    const app = express();
    app.use(express.json());
    app.use(cors({
      origin: 'http://localhost:3000'
    }));

    app.post("/", (req, res) => {
      const {
        html,
        width,
        height
      } = req.body;

      const callbacks = pdfcrowd.sendImageInHttpResponse(
        res, "application/pdf", "result.pdf", "attachment");

      callbacks.error = function (errMessage, statusCode) {
        res.set('Content-Type', 'text/plain');
        res.status(statusCode || 400);
        res.send(errMessage);
      }

      client.setPageWidth(`${width * 0.75}pt`);
      client.setPageHeight(`${height * 0.75}pt`);
      client.setNoMargins(true);

      client.convertString(
        `
          <style>
            @import 'https://fonts.googleapis.com/css?family=Montserrat';
            * {
              margin: 0px;
              padding: 0px;
              font-family: 'Montserrat'!important;
            }
          </style>
          ${html}
        `, 
        callbacks
      );
    });

    app.listen(PORT, () => {
      console.log('SERVER STARTED');
    });
  } catch (e) {
    console.log('error while server is starting', e);
  }
}

bootstrap();
