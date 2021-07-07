import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import utils from 'util'

import { AllGenomesInput, SpecificGeneInput, AllGenomesResults, SpecificGeneResults } from './dto/computeSpecific.dto';
import { ComputeSpecificService } from "./computeSpecific.service";
import { UsePipes, ValidationPipe } from '@nestjs/common'

@WebSocketGateway()
export class ComputeSpecificGateway {
    constructor(private readonly computeSpecificService: ComputeSpecificService) { }

    @WebSocketServer()
    server: Server;

    @UsePipes(new ValidationPipe())
    @SubscribeMessage('specificGeneRequest')
    async specificGeneRequest(@MessageBody() data: SpecificGeneInput): Promise<WsResponse<SpecificGeneResults>> {
        console.log(`socket:submitSpecificGene\n${utils.format(data)}`);

        console.log(`included genomes:\n${utils.format(data.gi)}`);
        console.log(`excluded genomes:\n${utils.format(data.gni)}`);
        console.log(`${utils.format(data.pam)}`);
        console.log(`Length of motif: ${utils.format(data.sgrna_length)}`);
        console.log(`Query : ${utils.format(data.seq)}`);

        const results = await this.computeSpecificService.specificGeneCompare(data);
        console.log("Returning specificGeneRequest");
        return { event: 'specificGeneResults', data: results };
    }

    // @UsePipes(new ValidationPipe())
    // @SubscribeMessage('allGenomesRequest')
    // async allGenomesRequest(@MessageBody() data: AllGenomesInput): Promise<WsResponse<AllGenomesResults>> {
    //     console.log('Getting data:', data);
    //     const results = await this.computeService2.allGenomesCompare(data);
    //     console.log("Returning allGenomesRequest");
    //     return { event: 'allGenomesResults', data: results };
    // }
}