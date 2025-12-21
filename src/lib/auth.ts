import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { createTemplateWorkspace } from "@/lib/seed-workspace";

export const auth = betterAuth({
    databaseHooks: {
        user: {
            create: {
                after: async (user: { id: string }) => {
                    try {
                        await createTemplateWorkspace(user.id);
                    } catch (e) {
                        console.error("Failed to create template workspace in hook:", e);
                    }
                }
            }
        }
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schema,
            user: schema.users,
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verifications,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});
