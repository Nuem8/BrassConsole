"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const ws_1 = require("ws");
const cors_1 = __importDefault(require("cors"));
const services_1 = require("./services");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api/services', (_req, res) => {
    res.json(services_1.services.map(services_1.getServiceStatus));
});
app.post('/api/services/:id/start', (req, res) => {
    (0, services_1.startService)(req.params.id);
    res.sendStatus(204);
});
app.post('/api/services/:id/stop', (req, res) => {
    (0, services_1.stopService)(req.params.id);
    res.sendStatus(204);
});
const server = (0, http_1.createServer)(app);
const wss = new ws_1.WebSocketServer({ server });
wss.on('connection', ws => {
    const interval = setInterval(() => {
        const payload = services_1.services.map(services_1.getServiceStatus);
        ws.send(JSON.stringify({ type: 'pressureUpdate', data: payload }));
    }, 1000);
    ws.on('close', () => clearInterval(interval));
});
const PORT = 4000;
server.listen(PORT, () => console.log(`Brass backend on ${PORT}`));
//# sourceMappingURL=index.js.map