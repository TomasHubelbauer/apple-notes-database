import execute from './execute.js';
import appName from './appName.js';

export default async function getNoteHtml(type, id) {
  return await execute(`
tell application "Notes"
  return body of note "${id}" of folder "${type}" of folder "${appName}"
end tell
  `);
}
