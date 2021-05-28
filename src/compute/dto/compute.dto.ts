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

  @MinLength(1, {
    each: true,
  })
  pam: string;

  @MinLength(1, {
    each: true,
  })
  sgrna_length: string;

  @MinLength(1, {
    each: true,
  })
  email: string;

}

export class ComputeSpecificResults {
    @IsDefined()
    @IsInt()
    score:number;
}