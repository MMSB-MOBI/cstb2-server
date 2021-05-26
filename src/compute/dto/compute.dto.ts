import { IsDefined,  IsInt, MinLength } from 'class-validator';

export class ComputeSpecificInput {
  @MinLength(1, {
    each: true,
  })
  gi: string[];
  
  @MinLength(1, {
    each: true,
  })
  gni: string[];

}

export class ComputeSpecificResults {
    @IsDefined()
    @IsInt()
    score:number;
}