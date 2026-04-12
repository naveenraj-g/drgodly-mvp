import axios from "axios";
import { IABDMService } from "../../application/services/abdmService.interface";
import { abdmApiEndpoints } from "../../../../../../abdmApiEndpoints";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import { TabdmFetchSession } from "../../entities/types/abdm.types";

export class ABDMService implements IABDMService {
  private readonly _clientId: string;
  private readonly _clientSecret: string;

  constructor() {
    if (!process.env.ABDM_CLIENT_ID || !process.env.ABDM_CLIENT_SECRET) {
      throw new Error("ABDM environment variables missing");
    }

    this._clientId = process.env.ABDM_CLIENT_ID;
    this._clientSecret = process.env.ABDM_CLIENT_SECRET;
  }

  private async _getSessionToken(): Promise<string> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "private_getSessionTokenService",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const res = await axios.post<TabdmFetchSession>(
        abdmApiEndpoints.fetchSessionToken,
        {
          clientId: this._clientId,
          clientSecret: this._clientSecret,
        },
        { timeout: 10000 }
      );

      const session = res.data;

      if (!session.accessToken) {
        throw new Error("ABDM accessToken missing in response");
      }

      // Success log
      logOperation("success", {
        name: "private_getSessionTokenService",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return session.accessToken;
    } catch (error) {
      // Error log
      logOperation("error", {
        name: "private_getSessionTokenService",
        startTimeMs,
        err: error,
        errName: "UnknownServiceError",
        context: {
          operationId,
        },
      });
      throw new Error("Failed to fetch ABDM session token");
    }
  }

  async getDoctorProfileByHPRId(hprId: string): Promise<any> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    // Start log
    logOperation("start", {
      name: "getABDMDoctorService",
      startTimeMs,
      context: {
        operationId,
      },
    });

    try {
      const token = await this._getSessionToken();

      const res = await axios.post(
        abdmApiEndpoints.fetchProfessionalDetails,
        {
          practitioner: {
            id: hprId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.data) {
        throw new Error("ABDM doctor details missing in response");
      }

      // Success log
      logOperation("success", {
        name: "getABDMDoctorService",
        startTimeMs,
        context: {
          operationId,
        },
      });

      return res.data;
    } catch (error) {
      console.log(error);
      // Error log
      logOperation("error", {
        name: "getABDMDoctorService",
        startTimeMs,
        err: error,
        errName: "UnknownServiceError",
        context: {
          operationId,
        },
      });
      throw new Error("Failed to fetch ABDM doctor details");
    }
  }
}
