import { ConfigService } from "@nestjs/config"

export abstract class ComputeService {
    rfg: string
    MOTIF_BROKER_ENDPOINT: string
    taxon_db: string
    genome_db: string
    COUCH_ENDPOINT: string
    script: string
    configToken: string
    modules: string
    jobProfile: string
    sysSettingsKey: string

    constructor(private configService: ConfigService) {
        this.rfg = configService.get('specificGene.exportVar.rfg');
        this.MOTIF_BROKER_ENDPOINT = '';
        this.taxon_db = '';
        this.genome_db = '';
        this.COUCH_ENDPOINT = '';
        this.script = '';
        this.configToken = '';
        this.modules = '';
        this.jobProfile = ''
        this.sysSettingsKey = ''
    }
}