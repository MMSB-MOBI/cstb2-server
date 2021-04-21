import { Injectable } from '@nestjs/common';
import {readFile } from 'fs/promises'; 
import { join } from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getTree(): Promise<string> {
    console.log("get Tree")
    const file = join(__dirname, '..', 'static/tree_210421.json')
    return new Promise((res, rej) => {
      readFile(file, 'utf8').then(file => res(JSON.parse(file))).catch(err => rej(err))
    })
  }
}
