import execute from '../../execute.js';

console.log(await execute('tell application "Notes" to name of every note in every folder'));
