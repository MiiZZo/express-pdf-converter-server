const express = require('express');
const pdfcrowd = require("pdfcrowd");
const cors = require('cors');
const hexRgb = require('hex-rgb');
const style = require('./style');


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
        height,
        backgroundColor
      } = req.body;

      const { red, green, blue, alpha } = hexRgb(backgroundColor);

      const callbacks = pdfcrowd.sendImageInHttpResponse(
        res, "application/pdf", "result.pdf", "attachment");

      callbacks.error = function (errMessage, statusCode) {
        res.set('Content-Type', 'text/plain');
        res.status(statusCode || 400);
        res.send(errMessage);
      }

      client.setPageWidth(`${Math.round(width * 0.75)}pt`);
      client.setPageHeight(`${Math.round(height * 0.75)}pt`);
      client.setNoMargins(true);

      client.convertString(
        `
          ${style}
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
