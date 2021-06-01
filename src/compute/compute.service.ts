import { Injectable } from '@nestjs/common';
import { AllGenomesInput, SpecificGeneInput, AllGenomesResults } from './dto/compute.dto';

@Injectable()
export class ComputeService {
  // getHello(): string {
  //   return 'Lets compute!';
  // }

  specificGeneCompare(data: SpecificGeneInput):Promise<AllGenomesResults>{
      const dummy:AllGenomesResults = { "score" : 10 };
      return new Promise( (res, rej) => {
        setTimeout(()=> { console.log("Resolving", dummy); res(dummy); }, 2500 );
      });       
  }

  allGenomesCompare(data: AllGenomesInput):Promise<AllGenomesResults>{
    const dummy:AllGenomesResults = { "score" : 10 };
    return new Promise( (res, rej) => {
      setTimeout(()=> { console.log("Resolving", dummy); res(dummy); }, 2500 );
    });       
}
}