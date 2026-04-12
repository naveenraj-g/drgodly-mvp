import { prismaMain } from "../src/modules/server/prisma/prisma";
import { prismaTelemedicine } from "../src/modules/server/prisma/prisma";
import { prismaFilenest } from "../src/modules/server/prisma/prisma";

async function prismMainFn() {
    try {
        // Create a Org
        const bezsOrg = await prismaMain.organization.create({
            data: {
                name: "Bezs",
                slug: "bezs-org",
                logo: "BellElectric",
            }
        })
        const orgId = bezsOrg.id

        // Create apps
        const apps = await prismaMain.app.create({
            data: {
                name: "",
                slug: "",
                type: "platform",
                description: "",
            }
        })

        const adminUser = await prismaMain.user.create({
            data: {
                name: "Admin",
                username: "admin",
                email: "testuser.gnr@gmail.com",
                role: "admin",
                currentOrgId: orgId,
                members: {
                    create: {
                        role: "member",
                        organizationId: orgId,
                    }
                },
                rbac: {
                    create: {
                        organizationId: orgId,
                        roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                        defaultRedirectUrl: "/bezs/telemedicine/doctor"
                    }
                }
            }
        })
    } catch (err) {
        console.log("seed script failed", err);
    }
}