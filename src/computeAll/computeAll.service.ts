import { Injectable } from "@nestjs/common";
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AllGenomesInput, AllGenomesResults } from './dto/computeAll.dto';
import { ManagerService } from "../manager/manager.service";
import { jobOptProxyClient } from '../manager/dto/manager.dto'
import { ConfigService } from "@nestjs/config"

@Injectable()
export class ComputeAllService {
    private rfg: string
    private MOTIF_BROKER_ENDPOINT: string
    private taxon_db: string
    private genome_db: string
    private COUCH_ENDPOINT: string
    private script: string
    private configToken = 'allGenomes'
    private modules: string[]
    private jobProfile: string
    private sysSettingsKey: string

    // variables should be validated
    constructor(
        private managerService: ManagerService,
        private configService: ConfigService) {
        const { rfg, MOTIF_BROKER_ENDPOINT, COUCH_ENDPOINT } = configService.get(`${this.configToken}.exportVar`);

        this.rfg = rfg;
        this.MOTIF_BROKER_ENDPOINT = MOTIF_BROKER_ENDPOINT;
        this.COUCH_ENDPOINT = COUCH_ENDPOINT;
        this.taxon_db = configService.get("db.taxon.name");
        this.genome_db = configService.get("db.genome.name");

        const { modules, jobProfile, sysSettingsKey, script } = configService.get(`${this.configToken}`);
        this.script = configService.get('job-manager.scriptRoot') + '/' + script;
        this.modules = modules;
        this.jobProfile = jobProfile;
        this.sysSettingsKey = sysSettingsKey;
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
                "taxon_db": this.taxon_db,
                "genome_db": this.genome_db,
                "COUCH_ENDPOINT": this.COUCH_ENDPOINT,
            },
            "modules": this.modules,
            "jobProfile": this.jobProfile,
            // "script": "/Users/cheritier/Desktop/cstb2-server/scripts/computeAll.sh",
            // "script": `${param.coreScriptsFolder}/crispr_workflow.sh`,
            "script": this.script,
            "sysSettingsKey": this.sysSettingsKey
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