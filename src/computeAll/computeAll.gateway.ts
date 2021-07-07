import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import utils from 'util'

import { AllGenomesInput, SpecificGeneInput, AllGenomesResults, SpecificGeneResults } from './dto/computeAll.dto';
import { ComputeAllService } from "./computeAll.service";
import { UsePipes, ValidationPipe } from '@nestjs/common'

@WebSocketGateway()
export class ComputeAllGateway {
    constructor(private readonly computeAllService: ComputeAllService) { }

    @WebSocketServer()
    server: Server;

    // @UsePipes(new ValidationPipe())
    // @SubscribeMessage('specificGeneRequest')
    // async specificGeneRequest(@MessageBody() data: SpecificGeneInput): Promise<WsResponse<SpecificGeneResults>> {
    //     console.log(`socket:submitSpecificGene\n${utils.format(data)}`);

    //     console.log(`included genomes:\n${utils.format(data.gi)}`);
    //     console.log(`excluded genomes:\n${utils.format(data.gni)}`);
    //     console.log(`${utils.format(data.pam)}`);
    //     console.log(`Length of motif: ${utils.format(data.sgrna_length)}`);
    //     console.log(`Query : ${utils.format(data.seq)}`);

    //     const results = await this.computeAllService.specificGeneCompare(data);
    //     console.log("Returning specificGeneRequest");
    //     return { event: 'specificGeneResults', data: results };
    // }

    @UsePipes(new ValidationPipe())
    @SubscribeMessage('allGenomesRequest')
    async allGenomesRequest(@MessageBody() data: AllGenomesInput): Promise<WsResponse<AllGenomesResults>> {
        console.log('Getting data:', data);
        try {
            const results: AllGenomesResults = await this.computeAllService.allGenomesCompare(data);
            console.log("Returning allGenomesRequest");
            console.log(results);
            
            return { event: 'allGenomesResults', data: results };
        } catch (e) {
            console.log("error", e);
        }
    }
}