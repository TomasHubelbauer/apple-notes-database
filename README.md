# Apple Notes Database

This project is an experiment in using Apple Notes as a storage layer for a web
application.

It is not meant to be practical, it is a creative exercise.

## Running

Run `PORT=3000 node .` to run the server.

The UI is at `/` and allows listing notes and reading and writing notes by ID.
There is also a to-do list sample running at `/todo.html`.

The API is as follows:

- `GET type` - list the IDs of entities of the given type

  The ID can be any string of characters except for a line break and a comma.

- `GET type/id` - get the content of the entity of the given type by its ID

  The return value is a JSON object literal with string key-value pairs.

- `POST type/id` - set the content of the entity of the given type by its ID

  The expected body is of the same format as the corresponding GET method.
  There is no return value.

- `DELETE type/id` - delete the note of the given type.

  There is no return value.

## Design

Entity/type approximates a database table and is implemented using Apple Notes
folders.

There is an encompassing folder for the application named after `appName.js`.

## To-Do

### Add Playwright E2E tests to ensure continued functionality

As I add more optimized endpoints and the functionality becomes more complex, I
am more likely to miss stuff that broke.
Let's add E2E UI tests to have my back.

### Consider splitting `POST` and `PUT` into different endpoints

Maybe I should respect the semantics for `POST` being for creating new items and
`PUT` being for updating existing items and erroring if the item doesn't exist.

In this scenario, `POST` would be a single-component path of just `POST /type`
and would automatically assign a unique ID or it could optionally have a
two-component path variant `POST /type/id` with suggested ID (based on say a
friendly name) which would be checked for uniqueness.

`PUT` would always require the ID: `PUT /type/id`.

### Add a new method for multi-deletion and expose it in the API

This will be similar to the multi-retrieval.
We don't have a use for it yet, but it will be good to have for parity.
