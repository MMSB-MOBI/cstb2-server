import {
  IsArray,
  IsDefined,
  ArrayNotEmpty,
  IsString,
  IsIn,
  IsAlphanumeric,
  IsEmail,
  IsNumber,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

import { Type } from 'class-transformer';

import { PAM, AvailablePAM } from '../../computeBase/types';

export class AllGenomesInput {
  @IsArray()
  @IsDefined()
  @ArrayNotEmpty()
  @IsAlphanumeric(undefined, { each: true })
  gi!: string[];

  @IsArray()
  @IsDefined()
  @IsAlphanumeric(undefined, { each: true })
  gni!: string[];

  @IsString()
  @IsDefined()
  @IsIn(PAM)
  pam: AvailablePAM;

  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  @Min(15)
  @Max(20)
  sgrna_length: string;

  @IsEmail()
  @IsDefined()
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
  @IsBoolean()
  mail_sended: boolean;
}
