import child_process from 'child_process';

console.log(child_process.execSync(`osascript -e 'tell application "Notes" to name of every note in every folder'`).toString());
