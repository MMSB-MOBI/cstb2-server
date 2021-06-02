import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

import { AllGenomesInput, SpecificGeneInput, AllGenomesResults, SpecificGeneResults } from './dto/compute.dto';
import { ComputeService } from './compute.service';
import { UsePipes, ValidationPipe } from '@nestjs/common'

@WebSocketGateway()
export class ComputeGateway {
  constructor(private readonly computeService: ComputeService) { }

  @WebSocketServer()
  server: Server;

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('specificGeneRequest')
  async specificGeneRequest(@MessageBody() data: SpecificGeneInput): Promise<WsResponse<SpecificGeneResults>>
  {
    console.log('Getting data:', data);
    const results = await this.computeService.specificGeneCompare(data);
    console.log("Returning specificGeneRequest");
    return { event: 'specificGeneResults', data : results };
    // return results
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('allGenomesRequest')
  async allGenomesRequest(@MessageBody() data: AllGenomesInput): Promise<WsResponse<AllGenomesResults>>
  {
    console.log('Getting data:', data);
    const results = await this.computeService.allGenomesCompare(data);
    console.log("Returning allGenomesRequest");
    return { event: 'allGenomesResults', data : results };
  }

  // @SubscribeMessage('events')
  // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //   return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  // }
}