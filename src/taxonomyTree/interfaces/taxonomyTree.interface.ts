import { HttpException, HttpStatus } from "@nestjs/common";

export interface Node {
    text: string,
    children?: Node[],
    genome_uuid?: string,
}

export class NotFoundException extends HttpException {
    constructor() {
        super('Not Found', HttpStatus.NOT_FOUND);
    }
}

export class ForbiddenException extends HttpException {
    constructor() {
        super('Forbidden', HttpStatus.FORBIDDEN);
    }
}