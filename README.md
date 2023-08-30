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

### Consider introducing a method for getting multiple ones at once

I think it should be possible to write AppleScript which would return the HTML
of multiple notes in one record.

This could be used to quickly populate lists of items if the design worked with
small notes.

For designs based on big notes, it would still make sense to populate the list
progressively, but maybe it could be in batches of notes and not indiviudally.

### Optimize the to-do list application by not always fully re-rendering

Deletes could be made to work by removing the `li` and not re-rendering.
If the removal fails, the `fetch` will throw.

Renames could be made to work by removing the `li` and renaming the `label`
together with boosting the `li` in question to the top of the list.

Toggles would work the same exact way as renames.

Additions would work by factoring out the `item` render function and calling it
out of band and preprending the resulting `li` to the list instead of a whole
re-render.
