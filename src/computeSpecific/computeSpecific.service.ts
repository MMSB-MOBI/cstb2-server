import { Injectable } from "@nestjs/common";
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { ConfigService } from "@nestjs/config";
import { ManagerService } from "../manager/manager.service";
import { ComputeBaseService } from "../computeBase/computeBase.service";

import { SpecificGeneInput, SpecificGeneResults } from '../computeSpecific/dto/computeSpecific.dto';
import * as jobManagerClient from 'ms-jobmanager'

@Injectable()
export class ComputeSpecificService extends ComputeBaseService {
    blastdb: string;

    constructor(
        private managerService: ManagerService,
        private configService: ConfigService) {
        super(configService, 'specificGene');
        this.blastdb = configService.get(`${this.configToken}.exportVar`).blastdb
    }

    async specificGeneCompare(data: SpecificGeneInput) /* : Promise<SpecificGeneResults> */ {
        const jobOpt: jobManagerClient.jobOptProxyClient = super.generateBaseJobOpt(data)
        jobOpt.exportVar.blastdb = this.blastdb;
        jobOpt.exportVar.seq = data.seq;
        jobOpt.exportVar.pid = data.pid;
        // jobOpt.exportVar.n = data.n;
        console.log('SG', jobOpt);

        const SGresults = await this.managerService.push(jobOpt);
        const results = plainToClass(SpecificGeneResults, SGresults);

        const errors = await validate(results);
        if (errors.length > 0) {
            console.log('Validation failed: ', errors);
            // raise error to client
        }
        return results
    }
}
