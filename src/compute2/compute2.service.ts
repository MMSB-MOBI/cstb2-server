import { Injectable } from "@nestjs/common";
import { AllGenomesInput, SpecificGeneInput, AllGenomesResults, SpecificGeneResults } from './dto/compute2.dto';
import { validate } from 'class-validator';
import * as jobManagerClient from "ms-jobmanager";
import { jobOptProxyClient } from "ms-jobmanager"

function asPromise(jobOpt: jobOptProxyClient): Promise<any> {
    return new Promise((res, rej) => {
        const job = jobManagerClient.push(jobOpt);
        let _buffer = "";
        job.on("completed", (stdout: any, stderr: any) => {
            stdout.on('data', (d) => {
                console.log(d);
            });
            stdout.on('end', (data) => res(data));
            // stdout.on('data', (d) => { _buffer += d.toString(); })
            // const chunks: Uint8Array[] = [];
            // console.log("STDOUT");
            // stdout.on('data', (chunk: Uint8Array) => chunks.push(chunk))
            // stdout.on('end', () => res(Buffer.concat(chunks).toString('utf8')));
        })
    });
}

@Injectable()
export class ComputeService2 {

    async allGenomesCompare(data: AllGenomesInput): Promise<AllGenomesResults> {
        const port = 1234;
        const TCPip = "127.0.0.1";
        const jobOpt: jobOptProxyClient = {
            "exportVar": {
                "rfg": "", //param.dataFolder,
                "gi": data.gi.join('&'),
                "gni": data.gni.join('&'),
                "pam": data.pam,
                "sl": data.sgrna_length,
                "MOTIF_BROKER_ENDPOINT": "", //param.motif_broker_endpoint,
                "NAME_TAXON": "taxon_db", //param.name_taxondb,
                "NAME_GENOME": "genome_db", //param.name_genomedb,
                "COUCH_ENDPOINT": "", //param.couch_endpoint
            },
            "modules": ["crispr-prod/3.0.0"],
            "jobProfile": "crispr-dev",
            "script": "./test/hello.sh",
            // "script": `${param.coreScriptsFolder}/crispr_workflow.sh`,
            // "sysSettingsKey": "crispr-dev"
        };

        try {
            console.dir(jobManagerClient);
            await jobManagerClient.start({ port, TCPip })
        } catch (e) {
            console.error(`Unable to connect ${e}`);
        }

        const AGresults = asPromise(jobOpt)
        return AGresults
    }

    async specificGeneCompare(data: SpecificGeneInput): Promise<SpecificGeneResults> {
        const port = 1234;
        const TCPip = "127.0.0.1";
        const jobOpt: jobOptProxyClient = {
            "exportVar": {
                "blastdb": "", // param.blastdb,
                "rfg": "", //param.dataFolder,
                "gi": data.gi.join('&'),
                "gni": data.gni.join('&'),
                "pam": data.pam,
                "sl": data.sgrna_length,
                "MOTIF_BROKER_ENDPOINT": "", //param.motif_broker_endpoint,
                "NAME_TAXON": "taxon_db", //param.name_taxondb,
                "NAME_GENOME": "genome_db", //param.name_genomedb,
                "seq": data.seq,
                // "n": data.n,
                "pid": data.pid,
                "COUCH_ENDPOINT": "", //param.couch_endpoint

            },
            "modules": ["crispr-prod/3.0.0", "blast+"],
            "jobProfile": "crispr-dev",
            "script": "./test/hello.sh",
            // "script": `${param.coreScriptsFolder}/crispr_workflow_specific.sh`,
            // "sysSettingsKey": "crispr-dev"
        };

        await jobManagerClient.start({ port, TCPip })

        const SGresults = asPromise(jobOpt)
        return SGresults
    }
}