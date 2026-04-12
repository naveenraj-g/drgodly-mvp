import {
  TGetUserFilePermissionById,
  TGetUserFilePermissionsByOwner,
  TGetUserFilePermissionsByShared,
  TCreateUserFilePermissionByOwner,
  TUpdateUserFilePermissionByOwner,
  TDeleteUserFilePermissionByOwner,
  TUserFilePermissionSchema,
  TUserFilePermissionsSchema,
} from "../../../../shared/entities/models/filenest/userFilePermission";

export interface IUserFilePermissionRepository {
  getUserFilePermissionById(
    data: TGetUserFilePermissionById
  ): Promise<TUserFilePermissionSchema>;

  getUserFilePermissionsByOwner(
    data: TGetUserFilePermissionsByOwner
  ): Promise<TUserFilePermissionsSchema>;

  getUserFilePermissionsByShared(
    data: TGetUserFilePermissionsByShared
  ): Promise<TUserFilePermissionsSchema>;

  createUserFilePermissionByOwner(
    data: TCreateUserFilePermissionByOwner
  ): Promise<TUserFilePermissionSchema>;

  updateUserFilePermissionByOwner(
    data: TUpdateUserFilePermissionByOwner
  ): Promise<TUserFilePermissionSchema>;

  deleteUserFilePermissionByOwner(
    data: TDeleteUserFilePermissionByOwner
  ): Promise<TUserFilePermissionSchema>;
}
