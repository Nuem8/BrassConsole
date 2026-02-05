type ServiceId = 'devServer';
interface ServiceDef {
    id: ServiceId;
    name: string;
    command: string;
    args: string[];
    cwd: string;
}
export declare const services: ServiceDef[];
export declare function startService(id: string): void;
export declare function stopService(id: string): void;
export declare function getServiceStatus(svc: ServiceDef): {
    id: "devServer";
    name: string;
    running: boolean;
    cpu: number;
    memory: number;
    lastError: null;
};
export {};
//# sourceMappingURL=services.d.ts.map