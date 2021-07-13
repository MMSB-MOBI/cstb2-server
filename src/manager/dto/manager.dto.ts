import { IsDefined } from "class-validator"

export { jobOptProxyClient } from "ms-jobmanager"

export class Error {
    @IsDefined()
    message: string

    @IsDefined()
    id: string
}