import { ConfigService } from "@nestjs/config"
import * as jobManagerClient from 'ms-jobmanager'
import { AllGenomesInput } from '../computeAll/dto/computeAll.dto';

export abstract class ComputeBaseService {
    configToken: string
    rfg: string

    user: string
    password: string
    port: number
    host: string
    motifBrokerPort: string
    motifBrokerHost: string

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

        const { user, password, host, port } = configService.get('db.couchDB.connect');
        this.user = user;
        this.password = password;
        this.host = host;
        this.port = port;
        this.motifBrokerPort = configService.get('db.motif-broker.port')
        this.motifBrokerHost = configService.get('db.motif-broker.host')

        this.rfg = configService.get(`${this.configToken}.exportVar.rfg`);
        this.MOTIF_BROKER_ENDPOINT = `http://${this.motifBrokerHost}:${this.motifBrokerPort}`;;
        this.COUCH_ENDPOINT = `http://${this.user}:${this.password}@${this.host}:${this.port}`;
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
                "NAME_TAXON": this.taxon_db,
                "NAME_GENOME": this.genome_db,
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
