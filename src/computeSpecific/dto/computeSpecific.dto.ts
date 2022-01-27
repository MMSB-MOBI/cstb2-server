import {
  IsDefined,
  IsString,
  Matches,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AllGenomesInput,
  AllGenomesResults,
} from '../../computeAll/dto/computeAll.dto';

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

export class SpecificGeneResults extends AllGenomesResults {
  @IsDefined()
  gene;
}
