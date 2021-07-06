import { IsDefined, MinLength } from 'class-validator';

interface Node {
    text: string,
    children?: Node[],
    genome_uuid?: string,
}

class Node{
    @IsDefined()
    text: string;
}

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