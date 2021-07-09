import { Injectable } from "@nestjs/common";
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { SpecificGeneInput, SpecificGeneResults } from './dto/computeSpecific.dto';
import { jobOptProxyClient } from '../manager/dto/manager.dto'
import { ManagerService } from "../manager/manager.service";
import { ConfigService } from "@nestjs/config"

@Injectable()
export class ComputeSpecificService {
    private blastdb: string
    private rfg: string
    private MOTIF_BROKER_ENDPOINT: string
    private taxon_db: string
    private genome_db: string
    private COUCH_ENDPOINT: string
    private script: string
    private configToken = 'specificGene'
    private modules: string[]
    private jobProfile: string
    private sysSettingsKey: string

    // variables should be validated
    constructor(
        private managerService: ManagerService,
        private configService: ConfigService) {
        const { blastdb, rfg, MOTIF_BROKER_ENDPOINT, COUCH_ENDPOINT } = configService.get(`${this.configToken}.exportVar`);
        console.log(configService.get(`${this.configToken}.exportVar`));

        this.blastdb = blastdb;
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

    async specificGeneCompare(data: SpecificGeneInput) /*: Promise<SpecificGeneResults> */ {
        const jobOpt: jobOptProxyClient = {
            "exportVar": {
                "blastdb": this.blastdb,
                "rfg": this.rfg,
                "gi": data.gi.join('&'),
                "gni": data.gni.join('&'),
                "pam": data.pam,
                "sl": data.sgrna_length,
                "MOTIF_BROKER_ENDPOINT": this.MOTIF_BROKER_ENDPOINT,
                "taxon_db": this.taxon_db,
                "genome_db": this.genome_db,
                "seq": data.seq,
                // "n": data.n,
                "pid": data.pid,
                "COUCH_ENDPOINT": this.COUCH_ENDPOINT,
            },
            "modules": this.modules,
            "jobProfile": this.jobProfile,
            // "script": "/Users/cheritier/Desktop/cstb2-server/scripts/computeSpecific.sh",
            // "script": `${param.coreScriptsFolder}/crispr_workflow.sh`,
            "script": this.script,
            "sysSettingsKey": this.sysSettingsKey
        };

        // try {
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