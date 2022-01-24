import {
  IsDefined,
  IsString,
  Matches,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AllGenomesInput } from '../../computeAll/dto/computeAll.dto';

export class SpecificGeneInput extends AllGenomesInput {
  @IsString()
  @IsDefined()
  @Matches('^[ATCG\n]*$')
  seq: string;

  @IsNumber()
  @IsDefined()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  pid: number;
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
  data;

  @IsDefined()
  data_card;

  @IsDefined()
  tag;

  @IsDefined()
  size;

  @IsDefined()
  fasta_metadata;

  @IsDefined()
  gene;
}
