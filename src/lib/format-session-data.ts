export function formattedRBACSessionData(session: any) {
  const filteredData = session?.userRBAC.reduce((acc: any, data: any) => {
    const roleName = data?.role?.name;
    if (!roleName) return acc;

    const orgApps =
      data?.organization?.appOrganization.map((app: any) => app?.appId) || [];

    const uniqueSlugs = new Set<string>();

    data?.role?.menuPermission.forEach((menuItem: any) => {
      const isOrgApp = orgApps.includes(menuItem.app.id);

      if (isOrgApp) {
        uniqueSlugs.add(menuItem.app.slug);
      }

      if (
        orgApps.length > 0 &&
        orgApps.includes(menuItem?.appId) &&
        menuItem?.appMenuItem?.slug
      ) {
        uniqueSlugs.add(menuItem?.appMenuItem?.slug);
      }
    });

    if (!acc[roleName]) {
      acc[roleName] = Array.from(uniqueSlugs);
    } else {
      acc[roleName].push(...Array.from(uniqueSlugs));
    }
    return acc;
  }, {});

  return filteredData;
}

export function matchDynamicRoute(pattern: string, pathname: string): boolean {
  const regex = new RegExp(
    "^" +
      pattern
        .replace(/:[^/]+/g, "[^/]+") // `:param` → dynamic match
        .replace(/\*/g, ".*") + // `*` → wildcard
      "$"
  );
  return regex.test(pathname);
}
