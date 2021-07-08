import { IsDefined, MinLength } from 'class-validator';
import { Node } from '../interfaces/dev2.interface'

export class ImportedTree {
  @IsDefined()
  _id: string;

  @IsDefined()
  _rev: string;

  @IsDefined()
  date: string;

  @IsDefined()
  tree: Node;
}