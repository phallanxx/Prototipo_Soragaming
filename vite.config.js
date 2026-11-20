import { readdirSync, copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectDir = path.dirname(fileURLToPath(import.meta.url));

function copyTeamMedia() {
  return {
    name: 'copy-team-media',
    closeBundle() {
      const source = path.join(projectDir, 'media');
      const target = path.join(projectDir, 'dist', 'media');
      mkdirSync(target, { recursive: true });
      for (const file of readdirSync(source).filter((name) => /\.jpe?g$/i.test(name))) {
        copyFileSync(path.join(source, file), path.join(target, file));
      }
    },
  };
}

export default defineConfig({ plugins: [react(), copyTeamMedia()] });

