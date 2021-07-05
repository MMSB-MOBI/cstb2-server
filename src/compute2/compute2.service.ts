import { Injectable } from "@nestjs/common";
import { AllGenomesInput, SpecificGeneInput, AllGenomesResults, SpecificGeneResults } from './dto/compute2.dto';
import { validate } from 'class-validator';
import jsonfile = require('jsonfile');
import utils from "util";
import { join } from 'path';
import { readFile } from 'fs/promises';
import { plainToClass } from 'class-transformer';

let jobManager = require('ms-jobmanager');

@Injectable()
export class ComputeService2 {

    async allGenomesCompare(data: AllGenomesInput): Promise<AllGenomesResults> {
        const file = join(__dirname, '..', '..', 'static', 'dummy_allGenomesResults.json');
        const _ = await readFile(file, 'utf8');
        const _results = JSON.parse(_)
        const results = plainToClass(AllGenomesResults, _results);
        const errors = await validate(results);
        if (errors.length > 0) {
            console.log('Validation failed: ', errors);
            // raise error to client
        }
        return results
    }

    async specificGeneCompare(data: SpecificGeneInput): Promise<SpecificGeneResults> {
        const file = join(__dirname, '..', '..', 'static', 'dummy_allGenomesResults.json');
        const _ = await readFile(file, 'utf8');
        const _results = JSON.parse(_)
        const results = plainToClass(SpecificGeneResults, _results);
        const errors = await validate(results);
        if (errors.length > 0) {
            console.log('Validation failed: ', errors);
            // raise error to client
        }
        return results
    }
}