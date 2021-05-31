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

import { AllGenomesInput, AllGenomesResults } from './dto/compute.dto';
import { ComputeService } from './compute.service';

@WebSocketGateway()
export class ComputeGateway {
  constructor(private readonly computeService: ComputeService) { }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('submittedRequest')
  async allGenomes(@MessageBody() data: AllGenomesInput): Promise<AllGenomesResults> // Promise<WsResponse<AllGenomesResults>>
  {
    console.log('Getting data:', data);
    const results = await this.computeService.specificCompare(data);
    console.log("Returning");
    return results; // return { event: 'allGenomes', data : results };
  }

  // @SubscribeMessage('allGenomes')
  // async allGenomes(@MessageBody() data: any): Promise<WsResponse<AllGenomesResults>>{ // Observable<WsResponse<number>>  
  //     console.log("Getting data", data);
  //     const results = await this.computeService.specificCompare(data);
  //     console.log("Returning");
  //     return { event: 'allGenomes', data : results };
  // }

  // @SubscribeMessage('events')
  // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //   return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  // }
}