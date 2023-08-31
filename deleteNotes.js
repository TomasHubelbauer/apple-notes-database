import execute from './execute.js';
import appName from './appName.js';

/**
 * 
 * @param {string} type 
 * @param {string[] | undefined} ids 
 */
export default async function deleteNotes(type, ids) {
  if (ids === undefined) {
    return await execute(`
tell application "Notes"
  delete notes of folder "${type}" of folder "${appName}"
end tell
`);
  }

  return await execute(`
tell application "Notes"
  set ids to ${JSON.stringify(ids)}
  set foundNotes to {}
  repeat with aNote in notes of folder "${type}" of folder "${appName}"
    if ids is {} or name of aNote is in ids then
      set end of foundNotes to name of aNote
    end if
  end repeat
  repeat with noteName in foundNotes
    set deleteNotes to notes of folder "${type}" of folder "${appName}" whose name is noteName
    repeat with aNote in deleteNotes
      delete aNote
    end repeat
  end repeat
end tell
`);
}

// Test via `node deleteNotes`
//console.log(await deleteNotes('items'));
