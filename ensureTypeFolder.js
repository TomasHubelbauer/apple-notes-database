import execute from './execute.js';
import appName from './appName.js';

export default async function ensureTypeFolder(name) {
  try {
    const script = `
tell application "Notes"
  make new folder with properties {name:"${name}"} at folder "${appName}"
end tell
`;

    const result = await execute(script);
    if (!result.match(/folder id x-coredata:\/\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\/ICFolder\/\w{5}\n$/)) {
      throw new Error(`Unexpected result: ${result}`);
    }
  }
  catch (error) {
    if (!error.message.endsWith('execution error: Notes got an error: Duplicate folder name. (-10000)\n')) {
      throw error;
    }
  }
}
