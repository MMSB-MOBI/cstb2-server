import { Injectable } from "@nestjs/common";
// import { jobOptProxyClient } from './dto/manager.dto';
import * as jobManagerClient from 'ms-jobmanager'
import { ConfigService } from "@nestjs/config"

@Injectable()
export class ManagerService {
    private port: number;
    private TCPip: string;
    private _connect: boolean = false;

    constructor(private configService: ConfigService) {
        this.port = configService.get('job-manager.port')
        this.TCPip = configService.get("job-manager.address");  
    }

    // generateJobOpt(exportVar: Record<string, any>): jobOptProxyClient {
    //     return
    // }

    async start() {
        if (this._connect) return new Promise((res, rej) => {
            setTimeout(() => {
                res(true)
            }, 500)
        })
        try {
            await jobManagerClient.start({ port: this.port, TCPip: this.TCPip })
            this._connect = true
            return true
        } catch (e) {
            console.error(`Unable to connect: ${e}`);
            return false
        }
    }

    async push(jobOpt: jobManagerClient.jobOptProxyClient): Promise<any> { // Guillaume doit typer l'objet job
        if (!this._connect) await this.start();

        return new Promise((res, rej) => {
            const job = jobManagerClient.push(jobOpt);
            job.on("completed", (stdout: any, stderr: any) => {
                const chunks: Uint8Array[] = [];
                const errchunks: Uint8Array[] = [];
                console.log("STDOUT");
                stdout.on('data', (chunk: Uint8Array) => chunks.push(chunk))
                stdout.on('end', () => {
                    const _ = Buffer.concat(chunks).toString('utf8');
                    try {
                        const data = JSON.parse(_)
                        res(data);
                    } catch (e) {
                        rej(e);
                    }
                });
                stderr.on('data', (chunk: Uint8Array) => errchunks.push(chunk))
                stderr.on('end', () => {
                    if (errchunks) {
                        const _ = Buffer.concat(errchunks).toString('utf8');
                        console.log(`erreur standard job>${_}<`);
                        if (_) rej(_)
                    }
                })
            });
        });
    }
}