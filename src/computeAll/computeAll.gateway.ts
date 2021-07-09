import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AllGenomesInput, AllGenomesResults } from './dto/computeAll.dto';
import { ComputeAllService } from "./computeAll.service";
import { UsePipes, ValidationPipe } from '@nestjs/common'

@WebSocketGateway()
export class ComputeAllGateway {
    constructor(private readonly computeAllService: ComputeAllService) { }

    @WebSocketServer()
    server: Server;

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
            console.log("Error", e);
        }
    }
}