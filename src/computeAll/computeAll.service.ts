import { Injectable } from "@nestjs/common";
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AllGenomesInput, AllGenomesResults, jobOptProxyClient } from './dto/computeAll.dto';
import { ManagerService } from "../manager/manager.service";
import { ConfigService } from "@nestjs/config"

@Injectable()
export class ComputeAllService {
    private rfg: string
    private MOTIF_BROKER_ENDPOINT: string
    private NAME_TAXON: string
    private NAME_GENOME: string
    private COUCH_ENDPOINT: string
    private script: string
    // private modules: string
    // private jobProfile: string
    // private sysSettingsKey: string

    constructor(
        private managerService: ManagerService,
        private configService: ConfigService) {
            this.rfg = configService.get("allGenomes.exportVar.rfg");
            this.MOTIF_BROKER_ENDPOINT = configService.get("allGenomes.exportVar.MOTIF_BROKER_ENDPOINT");
            this.NAME_TAXON = configService.get("allGenomes.exportVar.NAME_TAXON");
            this.NAME_GENOME = configService.get("allGenomes.exportVar.NAME_GENOME");
            this.COUCH_ENDPOINT = configService.get("allGenomes.exportVar.COUCH_ENDPOINT");
            this.script = configService.get("allGenomes.script");
            // this.modules = configService.get("allGenomes.modules");
            // this.jobProfile = configService.get("allGenomes.jobProfile");
            // this.sysSettingsKey = configService.get("allGenomes.sysSettingsKey");
        }

    async allGenomesCompare(data: AllGenomesInput) /* : Promise<AllGenomesResults> */ {
        const jobOpt: jobOptProxyClient = {
            "exportVar": {
                "rfg": this.rfg,
                "gi": data.gi.join('&'),
                "gni": data.gni.join('&'),
                "pam": data.pam,
                "sl": data.sgrna_length,
                "MOTIF_BROKER_ENDPOINT": this.MOTIF_BROKER_ENDPOINT,
                "NAME_TAXON": this.NAME_TAXON,
                "NAME_GENOME": this.NAME_GENOME,
                "COUCH_ENDPOINT": this.COUCH_ENDPOINT,
            },
            // "modules": this.modules,
            // "jobProfile": this.jobProfile,
            // "script": "/Users/cheritier/Desktop/cstb2-server/scripts/computeAll.sh",
            // "script": `${param.coreScriptsFolder}/crispr_workflow.sh`,
            "script": this.script,
            // "sysSettingsKey": this.sysSettingsKey
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