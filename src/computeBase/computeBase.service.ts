import { ConfigService } from "@nestjs/config"
import * as jobManagerClient from 'ms-jobmanager'
import { AllGenomesInput } from '../computeAll/dto/computeAll.dto';

export abstract class ComputeBaseService {
    configToken: string
    rfg: string
    MOTIF_BROKER_ENDPOINT: string
    COUCH_ENDPOINT: string
    taxon_db: string
    genome_db: string
    modules: string[]
    jobProfile: string
    sysSettingsKey: string
    script: string

    constructor(configService: ConfigService, configToken) {
        this.configToken = configToken;

        const { rfg, MOTIF_BROKER_ENDPOINT, COUCH_ENDPOINT } = configService.get(`${this.configToken}.exportVar`);
        this.rfg = rfg;
        this.MOTIF_BROKER_ENDPOINT = MOTIF_BROKER_ENDPOINT;
        this.COUCH_ENDPOINT = COUCH_ENDPOINT;
        this.taxon_db = configService.get("db.couchDB.taxon.name");
        this.genome_db = configService.get("db.couchDB.genome.name");

        const { modules, jobProfile, sysSettingsKey, script } = configService.get(`${this.configToken}`);
        this.modules = modules;
        this.jobProfile = jobProfile;
        this.sysSettingsKey = sysSettingsKey;
        this.script = configService.get("job-manager.scriptRoot") + "/" + script;
    }

    generateBaseJobOpt(data: AllGenomesInput): jobManagerClient.jobOptProxyClient {
        const jobOpt = {
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
            "script": this.script,
            "sysSettingsKey": this.sysSettingsKey
        };
        return jobOpt
    }
}