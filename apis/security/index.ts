import express, { CookieOptions } from "express";
import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from "cors";
import { z } from "zod";
import { find } from "lodash";
import { deserializeUser, signJwt, accessTokenPrivateKey, refreshTokenPrivateKey, User, Session } from "auth";

// It would be wise to store this as a config.
const accessTokenExpiresIn = 15;
const refreshTokenExpiresIn = 60;

// This would be a database normally.
const users: User[] = [
    { username: 'user1', password: 'pass1', id: 1 },
    { username: 'user2', password: 'pass2', id: 2 }
];

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
}

const accessTokenCookieOptions = {
    ...cookieOptions,
    expires: new Date(Date.now() + accessTokenExpiresIn * 60 * 1000),
}

const refreshTokenCookieOptions = {
    ...cookieOptions,
    expires: new Date(
        Date.now() + refreshTokenExpiresIn * 60 * 1000
    ),
}

// Normally we would use redis or something to store the sessions.
const session: Record<string, Session> = {};

export const signToken = async (user: User) => {
    const userId = user.id.toString();
    const access_token = signJwt({ sub: userId }, accessTokenPrivateKey, {expiresIn: `15m`});
    const refresh_token = signJwt({ sub: userId }, refreshTokenPrivateKey, {expiresIn: `60m`});

    session[userId] = { access_token, refresh_token, user }

    return { access_token, refresh_token }
}

const createContext = ( { req, res, }: trpcExpress.CreateExpressContextOptions) =>
    deserializeUser({ req, res }, session, users);

type Context = inferAsyncReturnType<typeof createContext>;
export const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
    login: t.procedure
        .input(z.object({
            username: z.string(),
            password: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            const user = find(users, { username: input.username});
            if (!user || user.password !== input.password) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Incorrect username or password.',
                });
            }

            const { access_token, refresh_token } = await signToken(user)

            ctx.res.cookie('access_token', access_token, accessTokenCookieOptions);
            ctx.res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
            ctx.res.cookie('loggedIn', true, { ...accessTokenCookieOptions, httpOnly: false });

            return { status: 'success', access_token };
    }),
});

const app = express();
app.use(cors());
const port = 8081;

app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    }),
);

app.get("/", (req, res) => {
    res.send("Hello from security");
});

app.listen(port, () => {
    console.log(`api-auth listening at http://localhost:${port}`);
});
