import { IsDefined, IsString, Matches } from 'class-validator';

export class JobIdInterrogate {
  @IsDefined()
  @IsString()
  @Matches('^[A-Za-z0-9-]+$')
  id: string;
}
