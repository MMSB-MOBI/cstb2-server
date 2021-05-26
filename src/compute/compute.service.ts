import { Injectable } from '@nestjs/common';
import { ComputeSpecificInput, ComputeSpecificResults } from './dto/compute.dto';

@Injectable()
export class ComputeService {
  getHello(): string {
    return 'Lets compute!';
  }

  specificCompare(data: ComputeSpecificInput):Promise<ComputeSpecificResults>{
      const dummy:ComputeSpecificResults = { "score" : 10 };
      return new Promise( (res, rej) => {
        setTimeout(()=> { console.log("Resolving", dummy); res(dummy); }, 2500 );
      });       
  }
}