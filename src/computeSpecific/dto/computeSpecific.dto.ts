import { IsDefined, MinLength } from 'class-validator';

export {jobOptProxyClient} from "ms-jobmanager"

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
}