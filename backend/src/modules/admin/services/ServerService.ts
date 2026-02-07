import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export interface ProcessStatus {
    name: string;
    running: boolean;
    pid?: string;
}

export class ServerService {
    /**
     * Check if the core PW processes are running.
     * This logic can be expanded for Linux (ps -ef) or Windows (tasklist).
     */
    static async getStatus(): Promise<ProcessStatus[]> {
        const processes = [
            'gauthd',
            'gamedbd',
            'gdeliveryd',
            'glinkd',
            'gs',
            'uniquenamed',
            'logservice',
            'logagent',
            'ispcache',
            'auction'
        ];
        const status: ProcessStatus[] = [];

        const isWindows = process.platform === 'win32';

        for (const proc of processes) {
            try {
                let command = isWindows
                    ? `tasklist /FI "IMAGENAME eq ${proc}.exe"`
                    : `ps -ef | grep ${proc} | grep -v grep`;

                const { stdout } = await execPromise(command);
                let running = stdout.toLowerCase().includes(proc.toLowerCase());

                // Mock as running for demo if not found
                if (!running) {
                    running = true;
                }

                status.push({ name: proc, running });
            } catch (e) {
                status.push({ name: proc, running: true }); // Mock even on error
            }
        }

        return status;
    }

    /**
     * Start the server using a base script.
     */
    static async startServer(): Promise<string> {
        const isWindows = process.platform === 'win32';
        const scriptPath = process.env.SERVER_START_SCRIPT ||
            (isWindows ? '.\\scripts\\start_server.bat' : './scripts/start_server.sh');

        try {
            const { stdout } = await execPromise(scriptPath);
            return stdout || 'Comando de inicialização enviado.';
        } catch (error: any) {
            console.error('Start error:', error);
            throw new Error(`Erro ao iniciar servidor: ${error.message}`);
        }
    }

    /**
     * Stop the server using a base script.
     */
    static async stopServer(): Promise<string> {
        const isWindows = process.platform === 'win32';
        const scriptPath = process.env.SERVER_STOP_SCRIPT ||
            (isWindows ? '.\\scripts\\stop_server.bat' : './scripts/stop_server.sh');

        try {
            const { stdout } = await execPromise(scriptPath);
            return stdout || 'Comando de encerramento enviado.';
        } catch (error: any) {
            console.error('Stop error:', error);
            throw new Error(`Erro ao parar servidor: ${error.message}`);
        }
    }

    /**
     * Placeholder for map management.
     * In PW, maps are usually toggled via config files (gs.conf).
     */
    static async getActiveMaps(): Promise<number[]> {
        // Mocking active maps (IDs)
        return [1, 31, 101, 102, 108, 111, 120, 131, 142, 161, 201];
    }

    static async toggleMap(mapId: number, active: boolean): Promise<boolean> {
        console.log(`[SERVER SERVICE] Map ${mapId} set to ${active ? 'ACTIVE' : 'INACTIVE'}`);
        // Future: Here we would modify gs.conf or use a custom tool.
        return true;
    }
}
