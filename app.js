const express = require("express");
const app = express();
const fs = require("fs");
const port = process.env.PORT || 4000;
const cors = require("cors");
const pdfMakePrinter = require('pdfmake/src/printer');

const pdfDocDef = require('./pdfDocDefinition')

app.use(cors());

async function generatePdf(docDefinition, callback) {
    try {
        var fontDescriptors = {
          Roboto: {
            normal: './fonts/Roboto-Regular.ttf',
            bold: './fonts/Roboto-Medium.ttf',
            italics: './fonts/Roboto-Italic.ttf',
            bolditalics: './fonts/Roboto-MediumItalic.ttf'
          }
        };
        const printer = new pdfMakePrinter(fontDescriptors);
        const doc = printer.createPdfKitDocument(docDefinition);

        let chunks = [];

        doc.on('data', (chunk) => {
            chunks.push(chunk);
        });

        doc.on('end', () => {
            callback(Buffer.concat(chunks));
        });

        doc.end();

    } catch(err) {
        throw(err);
    }
}

// Pdf route that will serve pdf
app.get("/pdf", async (req, res) => {
  // var file = fs.createReadStream("./public/sample.pdf");
  // file.pipe(res);

  generatePdf(pdfDocDef.dd, (file) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.send(file);
  }, (err) => {
    res.send('ERROR: '+err);
  });

  
});

app.listen(port, () => {
  console.log("Server listining on port ", port);
});