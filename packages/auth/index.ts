import {TRPCError} from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import {find} from "lodash";
import jwt, {SignOptions} from "jsonwebtoken";

export interface User {
    username: string;
    password: string;
    id: number;
}

export interface Session {
    access_token: string;
    refresh_token: string;
    user: User;
}

// It would be wise to store this as a config.
export const accessTokenPrivateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY as string;
export const accessTokenPublicKey = process.env.ACCESS_TOKEN_PUBLIC_KEY as string;
export const refreshTokenPrivateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY as string;
export const refreshTokenPublicKey = process.env.REFRESH_TOKEN_PUBLIC_KEY as string;

export const signJwt = (payload: Object, key: string, options: SignOptions = {}) => {
    return jwt.sign(payload, key, { ...(options ?? {}) });
}

export const verifyJwt = <T>(token: string, key: string,): T | null => {
    try {
        return jwt.verify(token, key) as T
    } catch (error) {
        console.log(error)
        return null
    }
}

export const deserializeUser = async (
    { req, res }: trpcExpress.CreateExpressContextOptions,
    session: Record<string, Session>
) => {
    try {
        // Get the token
        let access_token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            access_token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.access_token) {
            access_token = req.cookies.access_token;
        }

        const notAuthenticated = { req, res, user: null };

        if (!access_token) return notAuthenticated;

        const decoded = verifyJwt<{ sub: string }>(access_token, accessTokenPublicKey);

        if (!decoded) return notAuthenticated;

        // Check if user has a valid session
        const validSession = await session[decoded.sub];

        if (!validSession) return notAuthenticated;

        // Check if user still exist
        const user = await find(users, decoded.sub);

        if (!user) return notAuthenticated;

        return { req, res, user };
    } catch (err: any) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: err.message,
        })
    }
}
