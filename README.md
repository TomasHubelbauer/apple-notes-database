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

### Consider splitting `POST` and `PUT` into different endpoints

Maybe I should respect the semantics for `POST` being for creating new items and
`PUT` being for updating existing items.

In this scenario, `POST` would be a single-component path of just `POST /type`
and would automatically assign a unique ID or it could optionally have a
two-component path variant `POST /type/id` with suggested ID (based on say a
friendly name) which would be checked for uniqueness.

`PUT` would always require the ID: `PUT /type/id`.

### Expose the `getNotes` method to optimize `GET /type` + N `GET /type/id`

Getting a list of item with their contents (not just IDs) is a common use-case.
The `getNotes` method implement it, but we don't expose it in the API yet.

I think the best way to expose this will be on `GET /type/id,id,id,id`.
Comma is already a special character in the note title so we can use it here.

### Add a new method for getting the contents of all notes in a folder

This will be very similar to `getNotes` but the `ids` argument won't be there.
I think I will just make `ids` optional and make it fetch all notes if is is not
provided.

Will have to think about the endpoint for this though. Maybe `GET /type?full`?
