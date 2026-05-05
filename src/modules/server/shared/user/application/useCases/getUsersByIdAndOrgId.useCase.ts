import { getSharedInjection } from "../../../di/container";
import { TUser } from "../../entities/models/user";

export async function getUsersByIdAndOrgIdUseCase(
  userId: string,
  orgId: string
): Promise<TUser> {
  const userService = getSharedInjection("IUserService");

  const user = await userService.getUsersByIdAndOrgId(userId, orgId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
