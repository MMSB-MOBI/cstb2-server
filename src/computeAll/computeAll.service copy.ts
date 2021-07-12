import { ConfigService } from "@nestjs/config";
import { ComputeService } from "../computeVirtual/computeVirtual.service";

export class ComputeAllService extends ComputeService {
    constructor(ConfigServie) {
        super(ConfigService); // inherit
        console.log(this.rfg);
        
    }
}

// const a = new ComputeAllService();
