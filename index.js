import { createServer } from 'http';
import fs from 'fs';
import drainBody from './drainBody.js';
import ensureAppFolder from './ensureAppFolder.js';
import ensureTypeFolder from './ensureTypeFolder.js';
import getNote from './getNote.js';
import setNote from './setNote.js';

const server = createServer();

server.on('request', async (request, response) => {
  if (request.method === 'GET' && request.url === '/') {
    response.setHeader('Content-Type', 'text/html');
    response.end(await fs.promises.readFile('./index.html', 'utf-8'));
    return;
  }

  try {
    const [type, id, extra] = request.url.slice('/'.length).split('/');
    if (extra?.length > 0) {
      throw new Error(`Too many parts, expected type/id: ${request.url}`);
    }

    if (!type) {
      throw new Error(`Missing type, expected type/id: ${request.url}`);
    }

    if (!id) {
      throw new Error(`Missing id, expected type/id: ${request.url}`);
    }

    switch (request.method) {
      case 'GET': {
        await ensureAppFolder();
        await ensureTypeFolder(type);
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(await getNote(type, id)));
        break;
      }
      case 'POST': {
        const data = JSON.parse(await drainBody(request));
        await ensureAppFolder();
        await ensureTypeFolder(type);
        await setNote(type, id, data);
        response.end();
        break;
      }
      default: {
        throw new Error(`Unsupported method: ${request.method}`);
      }
    }
  }
  catch (error) {
    response.statusCode = 400;
    response.end(error.message);
  }
});

server.listen(process.env.PORT, () => {
  console.log(`starting server at port ${process.env.PORT}`);
});
