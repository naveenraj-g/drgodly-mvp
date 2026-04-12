import { create } from "zustand";
import {
  App,
  AppMenuItem,
  Organization,
  Role,
} from "../../../server/prisma/generated/main-database";

export type ModalType =
  | "addUser"
  | "editUser"
  | "viewProfile"
  | "deleteUser"
  | "addOrganization"
  | "manageOrgMembers"
  | "manageOrgApps"
  | "manageRoleAppMenus"
  | "manageRoleAppActions"
  | "editOrganization"
  | "deleteOrganization"
  | "addRole"
  | "editRole"
  | "deleteRole"
  | "addApp"
  | "editApp"
  | "deleteApp"
  | "addAppMenuItem"
  | "editAppMenuItem"
  | "deleteAppMenuItem"
  | "addAppAction"
  | "editAppAction"
  | "deleteAppAction"
  | "addPreferenceTemplate"
  | "editPreferenceTemplate"
  | "deletePreferenceTemplate";

type TUser = {
  id: string;
  name: string;
  username: string;
  role: string;
};

interface AdminStore {
  type: ModalType | null;
  isOpen: boolean;
  userId?: string;
  organizationId?: string;
  roleId?: string;
  appId?: string;
  user?: TUser | null;
  appMenuItemId?: string;
  appActionId?: string;
  appData?: App;
  appMenuItemData?: AppMenuItem;
  organizationData?: Organization;
  roleData?: Role;
  trigger: number;
  triggerInModal: number;
  incrementTrigger: () => void;
  incrementInModalTrigger: () => void;
  onOpen: (props: {
    type: ModalType;
    userId?: string;
    organizationId?: string;
    roleId?: string;
    appId?: string;
    appActionId?: string;
    appMenuItemId?: string;
    appData?: App;
    appMenuItemData?: AppMenuItem;
    organizationData?: Organization;
    roleData?: Role;
    user?: TUser | null;
  }) => void;
  onClose: () => void;
}

const _useAdminModalStore = create<AdminStore>((set) => ({
  type: null,
  isOpen: false,
  trigger: 0,
  triggerInModal: 0,
  onOpen: ({
    type,
    userId = "",
    organizationId = "",
    roleId = "",
    appId = "",
    appMenuItemId = "",
    appActionId = "",
    appData = undefined,
    appMenuItemData = undefined,
    organizationData = undefined,
    roleData = undefined,
    user = null,
  }) =>
    set({
      isOpen: true,
      type,
      userId,
      organizationId,
      roleId,
      appId,
      appMenuItemId,
      appActionId,
      appData,
      appMenuItemData,
      organizationData,
      roleData,
      user,
    }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      trigger: 0,
      triggerInModal: 0,
      userId: "",
      organizationId: "",
      roleId: "",
      appId: "",
      appMenuItemId: "",
      appActionId: "",
      appData: undefined,
      appMenuItemData: undefined,
      organizationData: undefined,
      roleData: undefined,
      user: null,
    }),
  incrementTrigger: () => set((state) => ({ trigger: state.trigger + 1 })),
  incrementInModalTrigger: () =>
    set((state) => ({ triggerInModal: state.triggerInModal + 1 })),
}));

export const useAdminModalStore = _useAdminModalStore;
export const adminModalStore = _useAdminModalStore;
