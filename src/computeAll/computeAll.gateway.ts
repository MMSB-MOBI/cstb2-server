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

// // Custom Error class
// class CustomError extends Error {
//     private jobID: string;
//     constructor(jobID = 'jobid123', ...params) {
//         // Pass remaining arguments (including vendor specific ones) to parent constructor
//         super(...params)
//         // Maintains proper stack trace for where our error was thrown (only available on V8)
//         if (Error.captureStackTrace) {
//             Error.captureStackTrace(this, CustomError)
//         }
//         this.name = 'CustomError'
//         // Custom debugging information
//         this.jobID = jobID
//     }
// }

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
            try {
                throw new WsException(e);
                // throw new CustomError(e);
            } catch (e) {
                console.error(e);
            }
        }
    }
}