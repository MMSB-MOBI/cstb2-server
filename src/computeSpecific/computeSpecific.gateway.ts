import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SpecificGeneInput, SpecificGeneResults } from './dto/computeSpecific.dto';
import { ComputeSpecificService } from "./computeSpecific.service";
import { UsePipes, ValidationPipe } from '@nestjs/common'
import utils from 'util'

@WebSocketGateway()
export class ComputeSpecificGateway {
    constructor(private readonly computeSpecificService: ComputeSpecificService) { }

    @WebSocketServer()
    server: Server;

    @UsePipes(new ValidationPipe())
    @SubscribeMessage('specificGeneRequest')
    async specificGeneRequest(@MessageBody() data: SpecificGeneInput): Promise<WsResponse<SpecificGeneResults>> {
        console.log('Getting data:', data);

        console.log(`socket:submitSpecificGene\n${utils.format(data)}`);

        console.log(`included genomes:\n${utils.format(data.gi)}`);
        console.log(`excluded genomes:\n${utils.format(data.gni)}`);
        console.log(`${utils.format(data.pam)}`);
        console.log(`Length of motif: ${utils.format(data.sgrna_length)}`);
        console.log(`Query : ${utils.format(data.seq)}`);

        try {
            const results = await this.computeSpecificService.specificGeneCompare(data);
            console.log("Returning specificGeneRequest");
            console.log(results);
            return { event: 'specificGeneResults', data: results };
        } catch (e) {
            console.log("Error", e);
        }
    }
}