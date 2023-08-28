# Apple Notes Database

This project is an experiment in using Apple Notes as a storage layer for a web
application.

It is not meant to be practical, it is a creative exercise.

## Running

Run `PORT=3000 node .` to run the server.

The UI is at `/` and allows reading and writing entries by ID.

The API is as follows:

- `GET type/id` - get the content of the entity of the given type by its ID
- `POST type/id` - set the content of the entity of the given type by its ID

Entity/type approximates a database table and is implemented using Apple Notes
folders.
There is an encompassing folder for the application named after `appName.js`.
