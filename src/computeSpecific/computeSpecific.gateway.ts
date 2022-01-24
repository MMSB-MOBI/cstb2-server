import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  SpecificGeneInput,
  SpecificGeneResults,
} from './dto/computeSpecific.dto';
import { ComputeSpecificService } from './computeSpecific.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { UseFilters } from '@nestjs/common';
import { WsExceptionFilter } from '../computeAll/ws-exception.filter';

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
export class ComputeSpecificGateway {
  constructor(
    private readonly computeSpecificService: ComputeSpecificService,
  ) {}

  @WebSocketServer()
  server: Server;

  @UsePipes(new ValidationPipe())
  @UseFilters(new WsExceptionFilter())
  @SubscribeMessage('specificGeneRequest')
  async specificGeneRequest(
    @MessageBody() data: SpecificGeneInput,
  ): Promise<WsResponse<SpecificGeneResults>> {
    /*console.log('Socket: submitSpecificGene\n', data);
    console.log(`Included genomes:\n${data.gi}`);
    if (data.gni.length > 0) console.log(`Excluded genomes:\n${data.gni}`);
    console.log(`PAM motifs: ${data.pam}`);
    console.log(`Length of motif: ${data.sgrna_length}`);
    console.log(`Query: ${data.seq}`);*/

    try {
      const results = await this.computeSpecificService.specificGeneCompare(
        data,
      );

      if ('emptySearch' in results)
        return { event: 'emptySearch', data: results['emptySearch'] };
      if ('error' in results) throw new WsException(results['error']);
      return { event: 'specificGeneResults', data: results };
    } catch (e) {
      console.log('Err', e);
      try {
        throw new WsException(e);
        // throw new CustomError(e);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
