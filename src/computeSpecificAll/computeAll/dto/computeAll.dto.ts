import { IsDefined, MinLength } from 'class-validator';

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

export class AllGenomesResults {
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