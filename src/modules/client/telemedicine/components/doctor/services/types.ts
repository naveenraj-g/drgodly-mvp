import { TServices } from "@/modules/shared/entities/models/telemedicine/service";
import { TSharedUser } from "@/modules/shared/types";
import type { ZSAError } from "zsa";

export interface IServiceProps {
  services: TServices | null;
  error: ZSAError | null;
  user: TSharedUser;
}
