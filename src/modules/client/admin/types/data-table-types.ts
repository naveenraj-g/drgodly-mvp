import {
  App,
  AppMenuItem,
} from "@/modules/server/prisma/generated/main-database";

// App List Table
export type TAppData = App & {
  _count: {
    appMenuItems: number;
    appActions: number;
  };
};

export interface IManageAppsTableData {
  appDatas: TAppData[];
  total: number;
}

// App Menu Item Table
export type TAppMenuItem = AppMenuItem;

export interface IManageAppMenuItemTableData {
  appMenuItemDatas: TAppMenuItem[];
  total: number;
}
