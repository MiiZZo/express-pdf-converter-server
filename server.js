const express = require('express');
const htmlToPdf = require('html-pdf');
const cors = require('cors');
const fs = require('fs');

const PORT = process.env.PORT | 3000;

const bootstrap = async () => {
  try {
    const app = express();
    app.use(express.json());
    app.use(cors({
      origin: '*'
    }));

    app.post('/', async (req, res) => {
      res.setHeader('Access-Control-Allow-Credentials', true)
      res.setHeader('Access-Control-Allow-Origin', '*')
      // another common pattern
      // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      )
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
