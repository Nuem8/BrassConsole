"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
exports.startService = startService;
exports.stopService = stopService;
exports.getServiceStatus = getServiceStatus;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
exports.services = [
    {
        id: 'devServer',
        name: 'Local Dev Server',
        command: 'npm',
        args: ['run', 'dev'],
        cwd: path_1.default.join(__dirname, '..', 'client')
    }
];
const processes = new Map();
function startService(id) {
    const svc = exports.services.find(s => s.id === id);
    if (!svc || processes.has(svc.id))
        return;
    const child = (0, child_process_1.spawn)(svc.command, svc.args, { cwd: svc.cwd, shell: true });
    processes.set(svc.id, child);
    child.stdout.on('data', buf => {
        console.log(`[${svc.name}]`, buf.toString());
    });
    child.stderr.on('data', buf => {
        console.error(`[${svc.name} ERROR]`, buf.toString());
    });
    child.on('exit', () => processes.delete(svc.id));
}
function stopService(id) {
    const svcId = id;
    const proc = processes.get(svcId);
    if (proc)
        proc.kill();
}
function getServiceStatus(svc) {
    const running = processes.has(svc.id);
    return {
        id: svc.id,
        name: svc.name,
        running,
        cpu: running ? Math.random() * 100 : 0,
        memory: running ? Math.random() * 100 : 0,
        lastError: null
    };
}
//# sourceMappingURL=services.js.map