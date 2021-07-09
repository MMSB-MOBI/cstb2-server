import { Injectable } from "@nestjs/common";
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { SpecificGeneInput, SpecificGeneResults, jobOptProxyClient } from './dto/computeSpecific.dto';
import { ManagerService } from "../manager/manager.service";
import { ConfigService } from "@nestjs/config"

@Injectable()
export class ComputeSpecificService {
    private blastdb: string
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
        this.blastdb = configService.get("specificGene.exportVar.blastdb")
        this.rfg = configService.get("specificGene.exportVar.rfg")
        this.MOTIF_BROKER_ENDPOINT = configService.get("specificGene.exportVar.MOTIF_BROKER_ENDPOINT");
        this.NAME_TAXON = configService.get("specificGene.exportVar.NAME_TAXON");
        this.NAME_GENOME = configService.get("specificGene.exportVar.NAME_GENOME");
        this.COUCH_ENDPOINT = configService.get("specificGene.exportVar.COUCH_ENDPOINT");
        // this.modules = configService.get("specificGene.modules");
        // this.jobProfile = configService.get("specificGene.jobProfile");
        // this.sysSettingsKey = configService.get("specificGene.sysSettingsKey");
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
                "NAME_TAXON": this.NAME_TAXON,
                "NAME_GENOME": this.NAME_GENOME,
                "seq": data.seq,
                // "n": data.n,
                "pid": data.pid,
                "COUCH_ENDPOINT": this.COUCH_ENDPOINT,
            },
            // "modules": this.modules,
            // "jobProfile": this.jobProfile,
            // "script": "/Users/cheritier/Desktop/cstb2-server/scripts/computeSpecific.sh",
            // "script": `${param.coreScriptsFolder}/crispr_workflow.sh`,
            "script": this.script,
            // "sysSettingsKey": this.sysSettingsKey
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