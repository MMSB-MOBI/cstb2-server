import { Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';

import { BaseWsExceptionFilter } from '@nestjs/websockets';

interface BadRequestMinimal {
  statusCode: number;
  message: string[];
  error: string;
}

@Catch(BadRequestException)
export class BadRequestFilter extends BaseWsExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const wsClient = ctx.getClient();
    const err = exception.getResponse() as BadRequestMinimal;

    //throw new WsException(msg);
    wsClient.emit('badRequestException', err);
    //super.catch(exception, host);
  }
}
