import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import {
  services,
  getServiceStatus,
  startService,
  stopService
} from './services/services';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/services', (_req, res) => {
  res.json(services.map(getServiceStatus));
});

app.post('/api/services/:id/start', (req, res) => {
  startService(req.params.id);
  res.sendStatus(204);
});

app.post('/api/services/:id/stop', (req, res) => {
  stopService(req.params.id);
  res.sendStatus(204);
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
  const interval = setInterval(() => {
    const payload = services.map(getServiceStatus);
    ws.send(JSON.stringify({ type: 'pressureUpdate', data: payload }));
  }, 1000);

  ws.on('close', () => clearInterval(interval));
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Brass backend on ${PORT}`));