import { spawn, type ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';
import os from 'os';

type ServiceId = 'devServer';

interface ServiceDef {
  id: ServiceId;
  name: string;
  command: string;
  args: string[];
  cwd: string;
}

export const services: ServiceDef[] = [
  {
    id: 'devServer',
    name: 'Local Dev Server',
    command: 'npm',
    args: ['run', 'dev'],
    // Adjust this if your client path is different
    cwd: path.join(__dirname, '..', 'client')
  }
];

const processes = new Map<ServiceId, ChildProcessWithoutNullStreams>();

// ---- CPU / Memory Sampling for the backend process ----

let lastCpuUsage = process.cpuUsage();
let lastHrtime = process.hrtime.bigint();
let currentCpuPercent = 0;
let currentMemPercent = 0;

setInterval(() => {
  const nowCpu = process.cpuUsage();
  const nowHr = process.hrtime.bigint();

  const userDiff = nowCpu.user - lastCpuUsage.user;     // microseconds
  const sysDiff = nowCpu.system - lastCpuUsage.system;  // microseconds
  const cpuTimeDiffMs = (userDiff + sysDiff) / 1000;    // to ms

  const wallTimeDiffMs = Number(nowHr - lastHrtime) / 1e6; // ns -> ms

  const cores = os.cpus().length || 1;
  const percent = (cpuTimeDiffMs / (wallTimeDiffMs * cores)) * 100;
  currentCpuPercent = Math.max(0, Math.min(100, percent));

  const mem = process.memoryUsage().rss; // bytes
  const total = os.totalmem();
  currentMemPercent = Math.max(0, Math.min(100, (mem / total) * 100));

  lastCpuUsage = nowCpu;
  lastHrtime = nowHr;
}, 1000);

// ---- Boiler process management ----

export function startService(id: string) {
  const svc = services.find(s => s.id === id);
  if (!svc || processes.has(svc.id)) return;

  const child = spawn(svc.command, svc.args, { cwd: svc.cwd, shell: true });
  processes.set(svc.id, child);

  child.stdout.on('data', buf => {
    console.log(`[${svc.name}]`, buf.toString());
    // TODO: broadcast logs to WebSocket clients if desired
  });

  child.stderr.on('data', buf => {
    console.error(`[${svc.name} ERROR]`, buf.toString());
    // TODO: broadcast error logs to WebSocket clients if desired
  });

  child.on('exit', code => {
    console.log(`[${svc.name}] exited with code ${code}`);
    processes.delete(svc.id);
  });
}

export function stopService(id: string) {
  const svcId = id as ServiceId;
  const proc = processes.get(svcId);
  if (proc) {
    proc.kill();
    processes.delete(svcId);
  }
}

export function getServiceStatus(svc: ServiceDef) {
  const running = processes.has(svc.id);
  return {
    id: svc.id,
    name: svc.name,
    running,
    // Real backend CPU/memory usage when the boiler is “on”
    cpu: running ? currentCpuPercent : 0,
    memory: running ? currentMemPercent : 0,
    lastError: null
  };
}