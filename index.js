import { createServer } from 'http';
import fs from 'fs';
import drainBody from './drainBody.js';
import ensureAppFolder from './ensureAppFolder.js';
import ensureTypeFolder from './ensureTypeFolder.js';
import getNote from './getNote.js';
import setNote from './setNote.js';
import listNotes from './listNotes.js';
import deleteNote from './deleteNote.js';
import getNotes from './getNotes.js';
import deleteNotes from './deleteNotes.js';

createServer()
  .listen(process.env.PORT, () => console.log(`http://localhost:${process.env.PORT}`))
  .on('request', async (request, response) => {
    try {
      const parts = request.url.slice('/'.length).split('/');
      if (parts.length === 1 && parts[0] === '') {
        parts.pop();
      }

      switch (parts.length) {
        case 0: {
          if (request.method === 'GET') {
            response.setHeader('Content-Type', 'text/html');
            response.end(await fs.promises.readFile('./index.html', 'utf-8'));
            return;
          }

          throw new Error(`Invalid route ${request.method} ${request.url}`);
        }
        case 1: {
          switch (parts[0]) {
            case 'todo.html': {
              response.setHeader('Content-Type', 'text/html');
              response.end(await fs.promises.readFile('./todo.html', 'utf-8'));
              return;
            }
            case 'todo.js': {
              response.setHeader('Content-Type', 'application/javascript');
              response.end(await fs.promises.readFile('./todo.js', 'utf-8'));
              return;
            }
            case 'renderItem.js': {
              response.setHeader('Content-Type', 'application/javascript');
              response.end(await fs.promises.readFile('./renderItem.js', 'utf-8'));
              return;
            }
          }

          const [type] = parts;
          if (!type) {
            throw new Error(`Missing type, expected /type or /type?full: ${request.url}`);
          }

          switch (request.method) {
            case 'GET': {
              const [name, full] = type.split('?');
              if (full && full !== 'full') {
                throw new Error(`Invalid type, expected /type or /type?full: ${request.url}`);
              }

              await ensureAppFolder();
              await ensureTypeFolder(name);
              response.setHeader('Content-Type', 'application/json');
              if (full) {
                response.end(JSON.stringify(await getNotes(name)));
              }
              else {
                response.end(JSON.stringify(await listNotes(name)));
              }

              return;
            }
            default: {
              throw new Error(`Unsupported /type method: ${request.method}`);
            }
          }
        }
        case 2: {
          const [type, id] = parts;

          if (!type) {
            throw new Error(`Missing type, expected /type/id: ${request.url}`);
          }

          if (!id) {
            throw new Error(`Missing id, expected /type/id: ${request.url}`);
          }

          switch (request.method) {
            case 'GET': {
              await ensureAppFolder();
              await ensureTypeFolder(type);
              response.setHeader('Content-Type', 'application/json');

              if (id.includes(',')) {
                const ids = id.split(',');
                response.end(JSON.stringify(await getNotes(type, ids)));
              }
              else {
                response.end(JSON.stringify(await getNote(type, id)));
              }

              return;
            }
            case 'POST': {
              const data = JSON.parse(await drainBody(request));
              await ensureAppFolder();
              await ensureTypeFolder(type);
              await setNote(type, id, data);
              response.end();
              return;
            }

            case 'DELETE': {
              await ensureAppFolder();
              await ensureTypeFolder(type);

              if (id.includes(',')) {
                const ids = id.split(',');
                await deleteNotes(type, ids);
              }
              else {
                await deleteNote(type, id);
              }

              response.end();
              return;
            }
            default: {
              throw new Error(`Unsupported /type/id method: ${request.method}`);
            }
          }
        }
        default: {
          throw new Error(`Invalid route - too many parts ${request.method} ${request.url}`);
        }
      }
    }
    catch (error) {
      response.statusCode = 400;
      response.end(error.message);
    }
  });
