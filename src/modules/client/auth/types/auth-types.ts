import { auth } from "@/modules/server/auth/betterauth/auth";

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
// export type OrganizationType = typeof auth.$Infer.Organization;
// export type MemberType = typeof auth.$Infer.Member;
// export type InvitationType = typeof auth.$Infer.Invitation;

// export type RBACsessionType = typeof auth.$Infer.Session.userRBAC;
