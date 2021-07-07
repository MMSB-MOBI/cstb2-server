import { Injectable, Inject } from "@nestjs/common";
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AllGenomesInput, SpecificGeneInput, AllGenomesResults, SpecificGeneResults, jobOptProxyClient } from './dto/computeAll.dto';
// import { ManagerService } from "../manager/manager.service";

@Injectable()
export class ComputeAllService {
    constructor(@Inject('JOBMANAGER') private managerService) { }

    // this.managerService.start();

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
            "script": "/Users/cheritier/Desktop/cstb2-server/scripts/computeAll.sh",
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

    // async specificGeneCompare(data: SpecificGeneInput) /*: Promise<SpecificGeneResults> */ {
    //     const jobOpt: jobOptProxyClient = {
    //         "exportVar": {
    //             "blastdb": "", // param.blastdb,
    //             "rfg": "", //param.dataFolder,
    //             "gi": data.gi.join('&'),
    //             "gni": data.gni.join('&'),
    //             "pam": data.pam,
    //             "sl": data.sgrna_length,
    //             "MOTIF_BROKER_ENDPOINT": "", //param.motif_broker_endpoint,
    //             "NAME_TAXON": "taxon_db", //param.name_taxondb,
    //             "NAME_GENOME": "genome_db", //param.name_genomedb,
    //             "seq": data.seq,
    //             // "n": data.n,
    //             "pid": data.pid,
    //             "COUCH_ENDPOINT": "", //param.couch_endpoint
    //         },
    //         "modules": ["crispr-prod/3.0.0", "blast+"],
    //         "jobProfile": "crispr-dev",
    //         "script": "./test/hello.sh",
    //         // "script": `${param.coreScriptsFolder}/crispr_workflow_specific.sh`,
    //         // "sysSettingsKey": "crispr-dev"
    //     };

    //     const AGresults = this.managerService.push(jobOpt)
    //     return AGresults
    // }
}