import { Command } from 'commander';

import type { Server } from '../server/index.js';
import { DEFAULT_HOST, normalizeBrowserUrl, resolveHost } from './runtime.js';

export interface CliMetadata {
  name: string;
  description: string;
  version: string;
}

export interface CliDependencies {
  createServer: (options: { port: number; host: string }) => Promise<Server>;
  open: (url: string) => Promise<unknown>;
}

export function createCliProgram(metadata: CliMetadata, dependencies: CliDependencies): Command {
  const program = new Command();

  program
    .name(metadata.name)
    .description(metadata.description)
    .version(metadata.version)
    .option('-p, --port <number>', 'Port to listen on', '3001')
    .option('--host <address>', `Host to bind to (default: ${DEFAULT_HOST})`)
    .option('--no-open', 'Do not open browser automatically')
    .action(async (options: { port: string; host?: string; open: boolean }) => {
      const port = parseInt(options.port, 10);
      const host = resolveHost(options.host);

      console.log('Starting OpenSpec WebUI...');

      try {
        const server = await dependencies.createServer({
          port,
          host,
        });

        // Open browser
        if (options.open) {
          // Fastify may return http://0.0.0.0:... which won't open in a browser;
          // always open with localhost so the local browser resolves correctly.
          const browserUrl = normalizeBrowserUrl(server.url);
          await dependencies.open(browserUrl);
        }

        // Handle shutdown
        const shutdown = async () => {
          console.log('\nShutting down...');
          if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
          }
          await server.close();
          process.exit(0);
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);

        // Enable keyboard shortcuts
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(true);
          process.stdin.resume();
          process.stdin.setEncoding('utf8');

          process.stdin.on('data', async (key: string) => {
            // Ctrl+C in raw mode
            if (key === '\u0003') {
              await shutdown();
              return;
            }
            // 'l' or 'L' to open browser
            if (key.toLowerCase() === 'l') {
              const browserUrl = normalizeBrowserUrl(server.url);
              await dependencies.open(browserUrl);
            }
          });
        }

        console.log(`\nPress 'l' to open browser, Ctrl+C to stop`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes('already in use') || (error as NodeJS.ErrnoException).code === 'EADDRINUSE') {
          console.error(`Error: Port ${port} is already in use`);
          console.error('Try using a different port: openspec-webui --port 3003');
          process.exit(1);
        }
        console.error('Failed to start server:', message);
        process.exit(1);
      }
    });

  return program;
}
