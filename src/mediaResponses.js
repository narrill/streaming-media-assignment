const fs = require('fs');
const path = require('path');

const writeRangeHeaders = (response, start, end, size, contentType) => {
  const chunksize = (end - start) + 1;

  response.writeHead(206, {
    'content-range': `bytes ${start}-${end}/${size}`,
    'accept-ranges': 'bytes',
    'content-length': chunksize,
    'content-type': contentType,
  });
};

const getRange = (request, size) => {
  let range = request.headers.range;

  if (!range) {
    range = 'bytes=0-';
  }

  const positions = range.replace(/bytes=/, '').split('-');

  let start = parseInt(positions[0], 10);

  const end = positions[1] ? parseInt(positions[1], 10) : size - 1;

  if (start > end) {
    start = end - 1;
  }

  return { start, end };
};

const getVideoStream = (response, file, start, end) => {
  const stream = fs.createReadStream(file, { start, end });

  stream.on('open', () => {
    stream.pipe(response);
  });

  stream.on('error', (streamErr) => {
    response.end(streamErr);
  });

  return stream;
};

const loadFile = (request, response, pathToFile, contentType) => {
  const file = path.resolve(__dirname, pathToFile);

  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end();
    }

    const { start, end } = getRange(request, stats.size);

    writeRangeHeaders(response, start, end, stats.size, contentType);

    return getVideoStream(response, file, start, end);
  });
};

const getParty = (request, response) => loadFile(request, response, '../client/party.mp4', 'video/mp4');
const getBling = (request, response) => loadFile(request, response, '../client/bling.mp3', 'audio/mpeg');
const getBird = (request, response) => loadFile(request, response, '../client/bird.mp4', 'video/mp4');

module.exports = {
  getParty,
  getBling,
  getBird,
};
