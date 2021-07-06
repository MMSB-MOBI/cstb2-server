import { Injectable } from "@nestjs/common";
import { AllGenomesInput, SpecificGeneInput, AllGenomesResults, SpecificGeneResults } from './dto/compute2.dto';
import { validate } from 'class-validator';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { plainToClass } from 'class-transformer';
import * as jobManagerClient from "ms-jobmanager";
const script = './test/hello.sh'

function asPromise(script: any, exportVar: Record<string, string>): Promise<any> {
    return new Promise((res, rej) => {
        const j = jobManagerClient.push({ script, exportVar });
        j.on("completed", (stdout: any, stderr: any) => {
            const chunks: Uint8Array[] = [];
            console.log("STDOUT");
            stdout.on('data', (chunk: Uint8Array) => chunks.push(chunk))
            stdout.on('end', () => res(Buffer.concat(chunks).toString('utf8')));
        })
    });
}

@Injectable()
export class ComputeService2 {

    async allGenomesCompare(data: AllGenomesInput): Promise<AllGenomesResults> {
        // new version
        const exportVar = { "titi": "28" };
        const port = 1234;
        const TCPip = "127.0.0.1";

        await jobManagerClient.start({ port, TCPip })

        asPromise(script, exportVar)

        // let jobOpt = {
        //     "exportVar": {
        //         "rfg": param.dataFolder,
        //         "gi": data.gi.join('&'),
        //         "gni": data.gni.join('&'),
        //         "pam": data.pam,
        //         "sl": data.sgrna_length,
        //         "MOTIF_BROKER_ENDPOINT": param.motif_broker_endpoint,
        //         "NAME_TAXON": param.name_taxondb,
        //         "NAME_GENOME": param.name_genomedb,
        //         "COUCH_ENDPOINT": param.couch_endpoint
        //     },
        //     "modules": ["crispr-prod/3.0.0"],
        //     "jobProfile": "crispr-dev",
        //     "script": `${param.coreScriptsFolder}/crispr_workflow.sh`,
        //     "sysSettingsKey": "crispr-dev"
        // };
        // console.log(`Trying to push ${utils.format(jobOpt)}`);
        // const job = jobManager.push(jobOpt)

        // job.on("ready", () => {
        //     console.log(`JOB ${job.id} sumitted`);
        //     socket.emit("submitted", { "id" : job.id });
        // });

        // old version
        const file = join(__dirname, '..', '..', 'static', 'dummy_allGenomesResults.json');
        const _ = await readFile(file, 'utf8');
        const _results = JSON.parse(_)
        const results = plainToClass(AllGenomesResults, _results);

        const errors = await validate(results);
        if (errors.length > 0) {
            console.log('Validation failed: ', errors);
            // raise error to client
        }
        return results
    }

    async specificGeneCompare(data: SpecificGeneInput): Promise<SpecificGeneResults> {
        // new version

        // let jobOpt = {
        //     "exportVar" : {
        //         "blastdb" : param.blastdb,
        //         "rfg" : param.dataFolder,
        //         "gi" : data.gi.join('&'),
        //         "gni" : data.gni.join('&'),
        //         "pam" : data.pam,
        //         "sl" : data.sgrna_length,
        //         "MOTIF_BROKER_ENDPOINT" : param.motif_broker_endpoint,
        //         "NAME_TAXON" : param.name_taxondb,
        //         "NAME_GENOME" : param.name_genomedb,
        //         "seq" : data.seq,
        //         "n"   : data.n,
        //         "pid" : data.pid, 
        //         "COUCH_ENDPOINT": param.couch_endpoint

        //     },
        //     "modules" : ["crispr-prod/3.0.0", "blast+"],
        //     "jobProfile" : "crispr-dev",
        //     "script" : `${param.coreScriptsFolder}/crispr_workflow_specific.sh`,
        //     "sysSettingsKey" : "crispr-dev"
        // };

        // console.log(`Trying to push ${utils.format(jobOpt)}`);
        // let job = jobManager.push(jobOpt);

        // old version
        const file = join(__dirname, '..', '..', 'static', 'dummy_allGenomesResults.json');
        const _ = await readFile(file, 'utf8');
        const _results = JSON.parse(_)
        const results = plainToClass(SpecificGeneResults, _results);
        const errors = await validate(results);
        if (errors.length > 0) {
            console.log('Validation failed: ', errors);
            // raise error to client
        }
        return results
    }
}