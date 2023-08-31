# Apple Notes Database

This project is an experiment in using Apple Notes as a storage layer for a web
application.

It is not meant to be practical, it is a creative exercise.

## Running

Run `PORT=3000 node .` to run the server.

The UI is at `/` and allows listing notes and reading and writing notes by ID.
There is also a to-do list sample running at `/todo.html`.

## Design

Entity/type approximates a database table and is implemented using Apple Notes
folders.

There is an encompassing folder for the application named after `appName.js`.

## API

- `GET type` - list the IDs of entities of the given type

  The ID can be any string of characters except for a line break and a comma.

- `GET type/id` - get the content of the entity of the given type by its ID

  The return value is a JSON object literal with string key-value pairs.

- `POST type/id` - set the content of the entity of the given type by its ID

  The expected body is of the same format as the corresponding GET method.
  There is no return value.

- `DELETE type/id` - delete the note of the given type.

  There is no return value.

## Testing

The app uses Playwright for E2E testing.
Run the tests using `npm test`.
The test runner will start the app server itself.

## To-Do

### Try to configure the GitHub Actions macOS runner AppleScript permissions

The tests require AppleScript to script Apple Notes and are timing out at the
moment.
I am not sure the exact root cause yet, but it is likely my Node process need to
be added to macOS permissions so it can script Apple Notes.

This is how permissions can be added to macOS:
https://github.com/actions/runner-images/issues/553#issuecomment-648109166

Also this if Notes need to be activated first:
https://github.com/actions/runner-images/issues/553#issuecomment-922834565

Try this too:
https://github.com/actions/runner-images/issues/7531#issuecomment-1609188199

I might need to take screenshots or videos to see what is happening on the
runner.

Alternatively, in case I can't make AppleScript work on GitHub Actions,
I will abstract out the storage layer and substitute an in-memory based option
when running on GitHub Actions so that the tests can work and test the UI only.

### Consider splitting `POST` and `PUT` into different endpoints

Maybe I should respect the semantics for `POST` being for creating new items and
`PUT` being for updating existing items and erroring if the item doesn't exist.

In this scenario, `POST` would be a single-component path of just `POST /type`
and would automatically assign a unique ID or it could optionally have a
two-component path variant `POST /type/id` with suggested ID (based on say a
friendly name) which would be checked for uniqueness.

`PUT` would always require the ID: `PUT /type/id`.

### Add support for ID-less multi-deletion on `DELETE /type`

This will bring parity to ID-less multi-retrival at `GET /type?full`.
It will be useful for building file-system-like experiences on top of the notes.
It should be accompanied with a method for creating a folder (different from
indirectly via `GET /type` or `GET /type?full` through `ensureTypeFolder`) so
that the folder CRUD actions can be carried out end to end over the API.

### Add a new app with multi-select support to demo the multi-deletion feature

I need to test this feature more as well, it seems kind of unreliable and I had
trouble putting together the AppleScript for it.
In some versions which I attempted to make slicker I would get seemingly racy
errors, sometimes it would delete the notes successfully, sometimes it would
error with unhelpful vague error messages.
The current version when passed a set of IDs sometimes succeeds but doesn't
actually seem to delete the notes?
I might need to craft better AppleScript or add checks after the command with
retry logic maybe?
