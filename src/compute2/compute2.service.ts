import { Injectable } from "@nestjs/common";
import { AllGenomesInput, SpecificGeneInput, AllGenomesResults, SpecificGeneResults } from './dto/compute2.dto';
import { readFile } from 'fs/promises';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import jsonfile = require('jsonfile');
import utils from "util"

@Injectable()
export class TreeService {
    getTree(): Promise<string> {
        const results = nano.request({ db: "tree", doc: "maxi_tree" });
        return new Promise((res, rej) => {
            readFile(results, 'utf8').then(tree => res(JSON.parse(tree))).catch(err => rej(err))
        }) // return data
    }

    async allGenomesCompare(data: AllGenomesInput): Promise<AllGenomesResults> {
        const tree = nano.request({ db: "tree", doc: "maxi_tree" });
        const _ = await readFile(tree, 'utf8');
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
        const tree = nano.request({ db: "tree", doc: "maxi_tree" });
        const _ = await readFile(tree, 'utf8');
        const _results = JSON.parse(_)
        const results = plainToClass(SpecificGeneResults, _results);
        const errors = await validate(results);
        if (errors.length > 0) {
            console.log('Validation failed: ', errors);
            // raise error to client
        }

        const program = require("commander");
        const param = jsonfile.readFileSync(program.conf);

        const jobOpt = {
            "exportVar": {
                "blastdb": param.blastdb,
                "rfg": param.dataFolder,
                "gi": data.gi.join('&'),
                "gni": data.gni.join('&'),
                "pam": data.pam,
                "sl": data.sgrna_length,
                "MOTIF_BROKER_ENDPOINT": param.motif_broker_endpoint,
                "NAME_TAXON": param.name_taxondb,
                "NAME_GENOME": param.name_genomedb,
                "seq": data.seq,
                // "n"   : data.n,
                "pid": data.pid,
                "COUCH_ENDPOINT": param.couch_endpoint
            },
            "modules": ["crispr-prod/3.0.0", "blast+"],
            "jobProfile": "crispr-dev",
            "script": `${param.coreScriptsFolder}/crispr_workflow_specific.sh`,
            "sysSettingsKey": "crispr-dev"
        };

        console.log(`Trying to push ${utils.format(jobOpt)}`);

        // let job = jobManager.push(jobOpt);
        // job.on("completed",(stdout, stderr) => {
            
        //     let _buffer = "";
        //     stdout.on('data',(d)=>{_buffer += d.toString();})
        //     .on('end',() => {
        //         let ans = {"data" : undefined};
        //         let buffer:any
        //         try {
        //             buffer = JSON.parse(_buffer);
        //         } catch (e) {
        //             socket.emit('workflowError', "Can't parse sbatch output");
        //             return;
        //         }

        //         if (buffer.hasOwnProperty("emptySearch")) {
        //             logger.info(`JOB completed-- empty search\n${utils.format(buffer.emptySearch)}`);
        //             ans.data = ["Search yielded no results.", buffer.emptySearch];
        //             socket.emit('resultsSpecific', ans);
        //         }
        //         else if (buffer.hasOwnProperty("error")){
        //             logger.info(`JOB completed-- handled error\n${utils.format(buffer.error)}`)
        //             socket.emit('workflowError', buffer.error)
        //         } else {
        //             logger.info(`JOB completed-- Found stuff`);
        //             logger.info(`${utils.inspect(buffer, false, null)}`);
        //             let res = buffer;
        //             ans.data = [res.data, res.not_in,  res.tag, res.number_hits, res.data_card, res.gi, res.number_treated_hits, res.fasta_metadata, res.gene];
        //             socket.emit('resultsSpecific', ans);
        //         }
                
        //     });
        // });
        // job.on("lostJob", ()=> socket.emit('workflowError', 'Job has been lost'));

        return results
    }
}