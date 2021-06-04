import { Injectable } from '@nestjs/common';
import { AllGenomesInput, SpecificGeneInput, AllGenomesResults, SpecificGeneResults } from './dto/compute.dto';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ComputeService {
  // getHello(): string {
  //   return 'Lets compute!';
  // }

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

  // _allGenomesCompare(data: AllGenomesInput): Promise<AllGenomesResults> {
  //   const dummy: AllGenomesResults = { gi: "toto", not_in: '', number_hits: '13', number_treated_hits: 13 };
  //   return new Promise((res, rej) => {
  //     setTimeout(() => { console.log("Resolving", dummy); res(dummy); }, 2500);
  //   });
  // }
}