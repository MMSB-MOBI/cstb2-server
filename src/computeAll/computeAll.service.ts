import { Injectable } from "@nestjs/common";
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { ConfigService } from "@nestjs/config";
import { ManagerService } from "../manager/manager.service";
import { ComputeBaseService } from "../computeBase/computeBase.service";

import { AllGenomesInput, AllGenomesResults } from './dto/computeAll.dto';
import { jobOptProxyClient } from '../manager/dto/manager.dto'

@Injectable()
export class ComputeAllService extends ComputeBaseService {
    constructor(
        private managerService: ManagerService,
        private configService: ConfigService) {
        super(configService, 'allGenomes');
    }

    async allGenomesCompare(data: AllGenomesInput) /* : Promise<AllGenomesResults> */ {
        const jobOpt: jobOptProxyClient = super.generateBaseJobOpt(data)
        console.log('AG', jobOpt);
        
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
