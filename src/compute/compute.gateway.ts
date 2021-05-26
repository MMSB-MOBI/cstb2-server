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
  
  import { ComputeSpecificInput, ComputeSpecificResults } from './dto/compute.dto';
  import { ComputeService } from './compute.service';

  @WebSocketGateway()
  export class ComputeGateway {
    constructor(private readonly computeService: ComputeService) {}

    @WebSocketServer()
    server: Server;
  
    @SubscribeMessage('computeSpecific')
    async computeSpecific(@MessageBody() data: ComputeSpecificInput): Promise<WsResponse<ComputeSpecificResults>>{ // Observable<WsResponse<number>>  
        console.log("Getting data", data);
        const results = await this.computeService.specificCompare(data);
        console.log("Returning");
        return { event: 'computeSpecific', data : results };
    }

    @SubscribeMessage('events')
    findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
      return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    }
  
    @SubscribeMessage('identity')
    async identity(@MessageBody() data: number): Promise<number> {
      return data;
    }
  }