import { IsDefined } from "class-validator"

export class Error {
    @IsDefined()
    message: string

    @IsDefined()
    id: string
}