# Apple Notes Database

This project is an experiment in using Apple Notes as a storage layer for a web
application.

It is not meant to be practical, it is a creative exercise.

## Running

Run `PORT=3000 node .` to run the server.

The UI is at `/` and allows listing notes and reading and writing notes by ID.

The API is as follows:

- `GET type` - list the IDs of entities of the given type

  The ID can be any string of characters except for a line break and a comma.

- `GET type/id` - get the content of the entity of the given type by its ID

  The return value is a JSON object literal with string key-value pairs.

- `POST type/id` - set the content of the entity of the given type by its ID

  The expected body is of the same format as the corresponding GET method.
  There is no return value.

## Design

Entity/type approximates a database table and is implemented using Apple Notes
folders.

There is an encompassing folder for the application named after `appName.js`.
