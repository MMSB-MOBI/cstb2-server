import { IsDefined, IsString, Matches } from 'class-validator';

export class RestoreInput {
  @IsDefined()
  @IsString()
  @Matches('^[A-Za-z0-9-]+$')
  id: string;
}
