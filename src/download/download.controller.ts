import { Controller, Get, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JobIdInterrogate } from '../sharedDto/shared.dto';
import fs from 'fs';

@Controller()
export class DownloadController {
  constructor(private configService: ConfigService) {}
  @Get('/download/:id')
  /*getResultsPath(@Param() params: DownloadDto) {
    console.log('download/:id fetch', params.id);
    const cache = this.configService.get('job-manager.cache');
    const path = `${cache}/${params.id}/${params.id}_results.tsv`;
    if (fs.existsSync(path)) return path;
    else
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: "Results file doesn't exist" },
        HttpStatus.NOT_FOUND,
      );
  }*/
  downloadFile(@Param() params: JobIdInterrogate, @Res() res: any) {
    const cache = this.configService.get('job-manager.cache');
    const path = `${cache}/${params.id}/${params.id}_results.tsv`;
    const file = fs.createReadStream(path);
    file.pipe(res);
  }
}
