import { Injectable } from "@nestjs/common";
import * as jobManagerClient from "ms-jobmanager";

@Injectable()
export class ManagerService {
    private port: number;
    private TCPip: string;
    private _connect: boolean = false;

    constructor(port, TCPip) {
        console.log("instance created job manager");
        this.port = port;
        this.TCPip = TCPip;
    }

    async start() {
        if (this._connect) return new Promise((res, rej) => {
            setTimeout(() => {
                res(true)
            }, 500)
        })
        try {
            console.log("je démarre");
            await jobManagerClient.start({ port: this.port, TCPip: this.TCPip })
            this._connect = true
            console.log("je suis démarré")
            return true
        } catch (e) {
            console.error(`Unable to connect ${e}`);
            return false
        }
    }

    async push(jobOpt: jobManagerClient.jobOptProxyClient): Promise<any> { // Guillaume doit typer l'objet job
        console.log('toto')
        if (!this._connect) await this.start();

        return new Promise((res, rej) => {
            const job = jobManagerClient.push(jobOpt);
            let _buffer = "";
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