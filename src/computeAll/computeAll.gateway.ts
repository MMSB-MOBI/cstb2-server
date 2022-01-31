import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AllGenomesInput, AllGenomesResults } from './dto/computeAll.dto';
import { ComputeAllService } from './computeAll.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { UseFilters } from '@nestjs/common';
import { BadRequestFilter } from './ws-exception.filter';
import Mailer from '../mailer/Mailer';
import { ConfigService } from '@nestjs/config';

// // Custom Error class
// class CustomError extends Error {
//     private jobID: string;
//     constructor(jobID = 'jobid123', ...params) {
//         // Pass remaining arguments (including vendor specific ones) to parent constructor
//         super(...params)
//         // Maintains proper stack trace for where our error was thrown (only available on V8)
//         if (Error.captureStackTrace) {
//             Error.captureStackTrace(this, CustomError)
//         }
//         this.name = 'CustomError'
//         // Custom debugging information
//         this.jobID = jobID
//     }
// }

@WebSocketGateway()
export class ComputeAllGateway {
  constructor(
    private readonly computeAllService: ComputeAllService,
    private configService: ConfigService,
  ) {}

  @WebSocketServer()
  server: Server;

  @UsePipes(new ValidationPipe())
  @UseFilters(new BadRequestFilter())
  @SubscribeMessage('allGenomesRequest')
  async allGenomesRequest(
    @MessageBody() data: AllGenomesInput,
  ): Promise<WsResponse<any>> {
    console.log('Socket: submitAllGenomes', data);
    console.log(`Included genomes:\n${data.gi}`);
    if (data.gni.length > 0) console.log(`Excluded genomes:\n${data.gni}`);
    console.log(`${data.pam}`);
    console.log(`Length of motif: ${data.sgrna_length}`);

    try {
      const clientUrl: string = this.configService.get('client.url');
      const results: AllGenomesResults = await this.computeAllService.allGenomesCompare(
        data,
      );

      await Mailer.send(
        {
          to: data.email,
          subject: 'CSTB - Job completed',
        },
        'mail_job_completed',
        {
          job_id: results.tag,
          job_url: `${clientUrl}/results/${results.tag}`,
        },
      );

      if ('emptySearch' in results)
        return { event: 'emptySearch', data: results['emptySearch'] };
      if ('error' in results) throw new WsException(results['error']);

      return { event: 'allGenomesResults', data: results };
    } catch (e) {
      console.log('#Error', e);
      throw new WsException(e);
    }
  }
}
