import {
  TUser,
  TUserUniqueFields,
  TUserUserNameOrEmailAndOrgId,
} from "../../entities/models/user";

export interface IUserRepository {
  getUserById(id: string): Promise<TUser | null>;
  getUserByUniqueFields(fields: TUserUniqueFields): Promise<TUser | null>;
  isUserInOrg(userId: string, orgId: string): Promise<boolean>;
  getUsersByIdAndOrgId(userId: string, orgId: string): Promise<TUser | null>;
  getUserByUserNameOrEmailAndOrgId(
    payload: TUserUserNameOrEmailAndOrgId
  ): Promise<TUser | null>;
}
