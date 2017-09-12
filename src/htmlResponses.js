const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const page2 = fs.readFileSync(`${__dirname}/../client/client2.html`);
const page3 = fs.readFileSync(`${__dirname}/../client/client3.html`);

const getPage = (request, response, file) => {
  response.writeHead(200, { 'content-type': 'text/html' });
  response.write(file);
  response.end();
};

module.exports = {
  getIndex: (request, response) => {
    getPage(request, response, index);
  },
  getPage2: (request, response) => {
    getPage(request, response, page2);
  },
  getPage3: (request, response) => {
    getPage(request, response, page3);
  },
};
