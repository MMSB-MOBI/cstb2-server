import { IsDefined, MinLength } from 'class-validator';

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

export class SpecificGeneResults {
  @IsDefined()
  gi: string;

  @IsDefined()
  not_in: string;

  @IsDefined()
  number_hits: string;

  @IsDefined()
  number_treated_hits: number;

  @IsDefined()
  data

  @IsDefined()
  data_card

  @IsDefined()
  tag

  @IsDefined()
  size

  @IsDefined()
  fasta_metadata

  @IsDefined()
  gene
}