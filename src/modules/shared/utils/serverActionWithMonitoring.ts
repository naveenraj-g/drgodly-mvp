"server-only";

import { redirect } from "@/i18n/navigation";
import { getServerSession } from "@/modules/server/auth/get-session";
import { getSharedInjection } from "@/modules/server/shared/di/container";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import {
  InputParseError,
  OperationError,
} from "../entities/errors/commonError";
import { ZSAError } from "zsa";
import { logOperation } from "./server-logger/log-operation";
import { randomUUID } from "crypto";

function isNextJsControlError(error: any) {
  return (
    error?.digest === "NEXT_REDIRECT" || error?.digest === "NEXT_NOT_FOUND"
  );
}

export async function withMonitoring<T>(
  name: string,
  handler: () => Promise<T>,
  options?: {
    url?: string | null;
    revalidatePath?: boolean;
    revalidateType?: "layout";
    redirect?: boolean;
    operationErrorMessage?: string;
    inputData?: Record<string, unknown>;
  },
): Promise<T> {
  const monitoringService = getSharedInjection("IMonitoringService");
  const locale = await getLocale();
  const session = await getServerSession();
  const userId = session?.user?.id;
  const operationId = randomUUID();

  // Start log
  const startTimeMs = Date.now();
  logOperation("start", {
    name,
    userId,
    startTimeMs,
    context: {
      operationId,
    },
  });

  return monitoringService.instrumentServerAction(
    name,
    { op: "server.action" },
    async () => {
      if (session?.user) {
        monitoringService.setUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user?.username ?? undefined,
        });
      }

      let data: T;

      try {
        data = await handler();

        // Success log
        logOperation("success", {
          name,
          userId,
          startTimeMs,
          context: {
            operationId,
          },
        });

        if (options?.url && options?.revalidatePath) {
          revalidatePath(options.url, options.revalidateType ?? "page");
        }
      } catch (err) {
        if (!isNextJsControlError(err)) {
          monitoringService.report(err);
        }

        // Error log
        logOperation("error", {
          name,
          userId,
          startTimeMs,
          err,
          context: {
            operationId,
          },
        });

        if (err instanceof InputParseError) {
          throw new ZSAError("INPUT_PARSE_ERROR", err.cause);
        }

        if (err instanceof OperationError) {
          throw new ZSAError(
            "ERROR",
            options?.operationErrorMessage ?? "Failed to perform operation.",
          );
        }

        throw new ZSAError("ERROR", err);
      } finally {
        monitoringService.clearUser();
      }

      if (options?.url && options?.redirect && data) {
        redirect({ href: options.url, locale });
      }

      return data;
    },
  );
}
