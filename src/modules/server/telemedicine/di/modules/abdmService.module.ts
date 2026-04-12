import { Bind, ContainerModule } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IABDMService } from "../../application/services/abdmService.interface";
import { ABDMService } from "../../infrastructure/services/abdmService";

const initializeModules = ({ bind }: { bind: Bind }) => {
  bind<IABDMService>(DI_SYMBOLS.IABDMService)
    .to(ABDMService)
    .inSingletonScope();
};

export const AbdmServiceModule = new ContainerModule(initializeModules);
