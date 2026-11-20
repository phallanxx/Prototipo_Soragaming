import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const app = express();
const projectDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(projectDir, 'dist');
const entry = path.join(distDir, 'index.html');
const port = Number(process.env.PORT || 3000);

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'sora-gg' });
});

app.use(express.static(distDir));
app.use((request, response, next) => {
  if (request.method !== 'GET' || !existsSync(entry)) return next();
  response.sendFile(entry);
});

app.listen(port, () => {
  console.log('Sora.GG disponível em http://localhost:' + port);
});

