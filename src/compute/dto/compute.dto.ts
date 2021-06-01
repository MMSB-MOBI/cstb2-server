import { IsDefined,  IsInt, MinLength } from 'class-validator';

export class AllGenomesInput {
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

export class SpecificGeneInput {
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

  @MinLength(1, {
    each: true,
  })
  pid: string;

  @MinLength(1, {
    each: true,
  })
  seq: string;

}

export class AllGenomesResults {
    @IsDefined()
    @IsInt()
    score:number;
}