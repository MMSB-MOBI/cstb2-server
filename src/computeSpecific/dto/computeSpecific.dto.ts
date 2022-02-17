import { IsDefined, IsNumber, Min, Max, isArray } from 'class-validator';
import { Type } from 'class-transformer';
import {
  AllGenomesInput,
  AllGenomesResults,
} from '../../computeAll/dto/computeAll.dto';

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

const checkNt = (text: string | string[]) => {
  const ntRegex = new RegExp('^[ATCG\n]*$');
  if (isArray(text)) {
    for (const line of text) {
      if (!ntRegex.test(line)) return false;
    }
    return true;
  } else {
    if (!ntRegex.test(text as string)) return false;
    return true;
  }
};

export function IsFasta(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFasta',
      target: object.constructor,
      propertyName: propertyName,
      //constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const splittedStr = value.split('\n');
          const forbiddenRegex = new RegExp('[$&;]');
          if (value.startsWith('>')) {
            if (forbiddenRegex.test(splittedStr[0])) return false;
            return checkNt(splittedStr.slice(1));
          } else {
            return checkNt(splittedStr);
          }
        },
      },
    });
  };
}

export class SpecificGeneInput extends AllGenomesInput {
  @IsDefined()
  @IsFasta({ message: 'Provided string is not in fasta format' })
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
