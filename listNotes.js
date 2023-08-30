import execute from './execute.js';
import appName from './appName.js';

/**
 * Returns the list of note IDs (titles) for a given type folder.
 * 
 * @param {string[]} type 
 */
export default async function listNotes(type) {
  const script = `
tell application "Notes"
  set names to {}
  repeat with aNote in notes of folder "${type}" of folder "${appName}"
      set end of names to name of aNote
  end repeat
  return names
end tell
`;

  const result = await execute(script);
  const ids = result.trim().split(', ');
  if (ids.length === 1 && ids[0] === '') {
    return [];
  }

  return ids;
}

// Test via `node listNotes`
//console.log(await listNotes('items'));
