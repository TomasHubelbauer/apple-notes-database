import execute from './execute.js';
import appName from './appName.js';

export default async function deleteNote(type, id) {
  const script = `
tell application "Notes"
  delete note "${id}" of folder "${type}" of folder "${appName}"
end tell
`;

  await execute(script);
}

// Test via `node deleteNote`
//console.log(await deleteNote('todos', 'test'));
