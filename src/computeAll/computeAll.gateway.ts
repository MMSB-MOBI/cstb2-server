import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    WsException
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AllGenomesInput, AllGenomesResults } from './dto/computeAll.dto';
import { ComputeAllService } from "./computeAll.service";
import { UsePipes, ValidationPipe } from '@nestjs/common'
import { UseFilters, WsExceptionFilter } from '@nestjs/common';

@WebSocketGateway()
export class ComputeAllGateway {
    constructor(private readonly computeAllService: ComputeAllService) { }

    @WebSocketServer()
    server: Server;

    @UsePipes(new ValidationPipe())
    @UseFilters(/* new WsExceptionFilter() */)
    @SubscribeMessage('allGenomesRequest')
    async allGenomesRequest(@MessageBody() data: AllGenomesInput): Promise<WsResponse<AllGenomesResults>> {
        console.log('socket:submitAllGenomes', data);
        console.log(`included genomes:\n${data.gi}`);
        if (data.gni.length > 0) console.log(`excluded genomes:\n${data.gni}`);
        console.log(`${data.pam}`);
        console.log(`Length of motif: ${data.sgrna_length}`);

        try {
            const results: AllGenomesResults = await this.computeAllService.allGenomesCompare(data);
            console.log("Returning allGenomesRequest");
            console.log(results);
            return { event: 'allGenomesResults', data: results };
        } catch (e) {
            console.log("Error", e);
            throw new WsException(e);
        }
    }
}