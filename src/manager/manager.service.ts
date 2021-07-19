import { Injectable } from "@nestjs/common";
// import { jobOptProxyClient } from 'ms-jobmanager';
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
            console.error(`Unable to connect at ${this.TCPip}:${this.port} : ${e}`)
            return false
        }
    }

    async push(jobOpt: jobManagerClient.jobOptProxyClient): Promise<any> { // Guillaume doit typer l'objet job
        if (!this._connect) await this.start();

        return new Promise((res, rej) => {
            const job = jobManagerClient.push(jobOpt);

            // errors
            job.on("scriptError", (message: string, data:jobManagerClient.jobOptProxyClient) => {
                console.log("script error");
                console.log(message);            
                rej(data)
            });
            job.on("lostJob", (data:jobManagerClient.jobOptProxyClient) => {
                console.log("lost job", data);
                rej()
            });
            job.on("fsFatalError", (message: string, error: string, data:jobManagerClient.jobOptProxyClient) => { //jobObject
                console.log("fs fatal error");
                console.log("message:", message);
                console.log("error:", error);
                console.log("data:", data);
                rej(data)
            });
            job.on("scriptSetPermissionError", (err: string) => {
                console.log("script set permission error");
                rej(err)
            });
            job.on("scriptWriteError", (err: string) => {
                console.log("script write error");
                rej(err)
            });
            job.on("scriptReadError", (err: string) => {
                console.log("script read error");
                rej(err)
            });
            job.on("inputError", (err: string) => {
                console.log("input error");
                rej(err)
            });

            job.on("completed", (stdout: any, stderr: any) => {
                const chunks: Uint8Array[] = [];
                const errchunks: Uint8Array[] = [];
                console.log("STDOUT");
                stdout.on('data', (chunk: Uint8Array) => chunks.push(chunk))
                stdout.on('end', () => {
                    const _ = Buffer.concat(chunks).toString('utf8');
                    try {
                        const data = JSON.parse(_) // catch: res.status(500).json({ error: e.message, stack: e.stack });
                        res(data);
                    } catch (e) {
                        rej(e);
                        // socket.emit('workflowError', "Can't parse sbatch output");
                        // return;
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