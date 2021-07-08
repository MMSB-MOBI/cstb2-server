import { Injectable, Inject } from "@nestjs/common";
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { SpecificGeneInput, SpecificGeneResults, jobOptProxyClient } from './dto/computeSpecific.dto';
import { ManagerService } from "../manager/manager.service";

@Injectable()
export class ComputeSpecificService {
    constructor(/* @Inject('JOBMANAGER') */ private managerService: ManagerService) { }

    async specificGeneCompare(data: SpecificGeneInput) /*: Promise<SpecificGeneResults> */ {
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
            // "script": "/Users/cheritier/Desktop/cstb2-server/scripts/computeSpecific.sh",
            "script": "/home/cassandre/Desktop/cstb2-server/scripts/computeSpecific.sh",
            // "script": `${param.coreScriptsFolder}/crispr_workflow.sh`,
            // "sysSettingsKey": "crispr-dev"
        };

        const SGresults = await this.managerService.push(jobOpt);
        const results = plainToClass(SpecificGeneResults, SGresults);

        const errors = await validate(results);
        if (errors.length > 0) {
            console.log('Validation failed: ', errors);
            // raise error to client
        }
        return results
        // } catch (e) {
        //     console.log("error", e);
        //     throw (e);
        // }
    }
}