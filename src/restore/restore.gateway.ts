/* eslint-disable prettier/prettier */
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RestoreService } from './restore.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { RestoreInput } from './restore.dto'


@WebSocketGateway()
export class RestoreGateway {
  constructor(private readonly restoreService: RestoreService) {}

  @WebSocketServer()
  server: Server;

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('restoreResults')
  async restoreResults(@MessageBody() data: RestoreInput) {
    const results = await this.restoreService.reloadResults(data.id);
    if ('emptySearch' in results)
        return { event: 'emptySearch', data: results['emptySearch'] };
    if ('error' in results) throw new WsException(results['error']);
    if ('gene' in results) {
        return { event: 'specificGeneResults', data: results };
    } else return { event: 'allGenomesResults', data: results };

  }
}
