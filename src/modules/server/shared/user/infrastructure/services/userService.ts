import { headers } from "next/headers";
import { injectable } from "inversify";
import { OperationError } from "@/modules/shared/entities/errors/commonError";
import { IUserService } from "../../application/services/userService.interface";
import {
  TUser,
  TUserUniqueFields,
  TUserUserNameOrEmailAndOrgId,
} from "../../entities/models/user";

const BASE_URL = `${process.env.BETTER_AUTH_URL}/api/internal/user-context`;

type ApiUser = {
  id: string;
  email: string;
  username: string | null;
  name: string;
  createdAt: string;
};

function toTUser(raw: ApiUser): TUser {
  return {
    id: raw.id,
    email: raw.email,
    username: raw.username,
    name: raw.name,
    createdAt: new Date(raw.createdAt),
    // updatedAt is not exposed by the endpoint; fall back to createdAt
    updatedAt: new Date(raw.createdAt),
  };
}

@injectable()
export class UserService implements IUserService {
  async getUserById(id: string): Promise<TUser | null> {
    try {
      const reqHeaders = await headers();
      const res = await fetch(BASE_URL, {
        headers: reqHeaders,
        cache: "no-store",
      });

      if (res.status === 404 || res.status === 401 || res.status === 403) {
        return null;
      }

      if (!res.ok) {
        throw new OperationError(
          `getUserById failed with status ${res.status}`,
        );
      }

      const { user } = (await res.json()) as { user: ApiUser };

      // The endpoint resolves userId from auth — guard against id mismatch
      if (user.id !== id) return null;

      return toTUser(user);
    } catch (error) {
      if (error instanceof OperationError) throw error;
      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async getUserByUniqueFields(
    fields: TUserUniqueFields,
  ): Promise<TUser | null> {
    try {
      const reqHeaders = new Headers(await headers());
      reqHeaders.set("Content-Type", "application/json");

      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify(fields),
        cache: "no-store",
      });

      if (res.status === 404) return null;

      if (!res.ok) {
        throw new OperationError(
          `getUserByUniqueFields failed with status ${res.status}`,
        );
      }

      const { user } = (await res.json()) as { user: ApiUser };
      return toTUser(user);
    } catch (error) {
      if (error instanceof OperationError) throw error;
      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async isUserInOrg(userId: string, orgId: string): Promise<boolean> {
    try {
      const url = new URL(BASE_URL);
      url.searchParams.set("orgId", orgId);

      const res = await fetch(url.toString(), {
        headers: await headers(),
        cache: "no-store",
      });

      if (res.status === 403 || res.status === 404) return false;

      if (!res.ok) {
        throw new OperationError(
          `isUserInOrg failed with status ${res.status}`,
        );
      }

      const { user } = (await res.json()) as { user: ApiUser };
      return user.id === userId;
    } catch (error) {
      if (error instanceof OperationError) throw error;
      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async getUsersByIdAndOrgId(
    userId: string,
    orgId: string,
  ): Promise<TUser | null> {
    try {
      const url = new URL(BASE_URL);
      url.searchParams.set("orgId", orgId);

      const res = await fetch(url.toString(), {
        headers: await headers(),
        cache: "no-store",
      });

      if (res.status === 403 || res.status === 404) return null;

      if (!res.ok) {
        throw new OperationError(
          `getUsersByIdAndOrgId failed with status ${res.status}`,
        );
      }

      const { user } = (await res.json()) as { user: ApiUser };

      if (user.id !== userId) return null;

      return toTUser(user);
    } catch (error) {
      if (error instanceof OperationError) throw error;
      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async getUserByUserNameOrEmailAndOrgId(
    payload: TUserUserNameOrEmailAndOrgId,
  ): Promise<TUser | null> {
    try {
      const reqHeaders = new Headers(await headers());
      reqHeaders.set("Content-Type", "application/json");

      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (res.status === 404) return null;

      if (!res.ok) {
        throw new OperationError(
          `getUserByUserNameOrEmailAndOrgId failed with status ${res.status}`,
        );
      }

      const { user } = (await res.json()) as { user: ApiUser };
      return toTUser(user);
    } catch (error) {
      if (error instanceof OperationError) throw error;
      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }
}
