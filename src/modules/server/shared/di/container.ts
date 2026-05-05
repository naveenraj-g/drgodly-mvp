import "reflect-metadata";
import { Container } from "inversify";
import { DI_RETURN_TYPES, DI_SYMBOLS } from "./types";
import { MonitoringModule } from "./modules/monitoring.module";

const SharedContainer = new Container({ defaultScope: "Singleton" });

const initializeContainer = () => {
  SharedContainer.load(MonitoringModule);
};

initializeContainer();

export const getSharedInjection = <K extends keyof typeof DI_SYMBOLS>(
  symbol: K,
): DI_RETURN_TYPES[K] => {
  return SharedContainer.get(DI_SYMBOLS[symbol]);
};

export { SharedContainer };
