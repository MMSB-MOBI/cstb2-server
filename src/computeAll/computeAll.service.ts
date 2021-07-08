import { Injectable, Inject } from "@nestjs/common";
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AllGenomesInput, AllGenomesResults, jobOptProxyClient } from './dto/computeAll.dto';

@Injectable()
export class ComputeAllService {
    constructor(@Inject('JOBMANAGER') private managerService) { }

    async allGenomesCompare(data: AllGenomesInput) /* : Promise<AllGenomesResults> */ {
        console.log("all genome compare");
        console.log(__dirname);

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
            // "modules": ["crispr-prod/3.0.0"],
            // "jobProfile": "crispr-dev",
            // "script": "/Users/cheritier/Desktop/cstb2-server/scripts/computeAll.sh",
            "script": "/home/cassandre/Desktop/cstb2-server/scripts/computeAll.sh",
            // "script": `${param.coreScriptsFolder}/crispr_workflow.sh`,
            // "sysSettingsKey": "crispr-dev"
        };

        // try {
        const AGresults = await this.managerService.push(jobOpt);
        const results = plainToClass(AllGenomesResults, AGresults);

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