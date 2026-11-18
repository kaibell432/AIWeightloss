// Runs Vite after normalizing the working directory's path casing.
//
// On Windows, terminals (notably VS Code's) can start in "c:\..." while Node's
// module resolution returns the real "C:\..." path. Vite then treats the same files
// as two different modules, bundles React and React Router twice, and the app
// crashes at runtime ("Cannot read properties of null (reading 'useState')").
// Fixing the cwd before Vite loads avoids that. On Linux (Render) this is a no-op.
import fs from 'node:fs';

process.chdir(fs.realpathSync.native(process.cwd()));

const { build, createServer, preview } = await import('vite');
const command = process.argv[2] || 'dev';

if (command === 'build') {
  await build();
} else if (command === 'preview') {
  (await preview()).printUrls();
} else {
  const server = await createServer();
  await server.listen();
  server.printUrls();
}
