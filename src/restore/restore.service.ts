/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { promises as FsPromise } from 'fs';

@Injectable()
export class RestoreService {
    constructor(private configService: ConfigService) {
    }
    async reloadResults(id: string) {
        console.log("reload results")
        const cache : string = this.configService.get('job-manager.cache')
        const resultFile  = `${cache}/${id}/${id}.out`
        const resBuffer = await FsPromise.readFile(resultFile, "utf-8")
        const results = JSON.parse(resBuffer) //TO TYPE
        return results
    }
}