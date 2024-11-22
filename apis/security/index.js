"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = exports.t = exports.signToken = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = require("@trpc/server");
const trpcExpress = __importStar(require("@trpc/server/adapters/express"));
const cors_1 = __importDefault(require("cors"));
const zod_1 = require("zod");
const lodash_1 = require("lodash");
const auth_1 = require("auth");
// It would be wise to store this as a config.
const accessTokenExpiresIn = 15;
const refreshTokenExpiresIn = 60;
// This would be a database normally.
const users = [
    { username: 'user1', password: 'pass1', id: 1 },
    { username: 'user2', password: 'pass2', id: 2 }
];
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
};
const accessTokenCookieOptions = Object.assign(Object.assign({}, cookieOptions), { expires: new Date(Date.now() + accessTokenExpiresIn * 60 * 1000) });
const refreshTokenCookieOptions = Object.assign(Object.assign({}, cookieOptions), { expires: new Date(Date.now() + refreshTokenExpiresIn * 60 * 1000) });
// Normally we would use redis or something to store the sessions.
const session = {};
const signToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = user.id.toString();
    const access_token = (0, auth_1.signJwt)({ sub: userId }, auth_1.accessTokenPrivateKey, { expiresIn: `15m` });
    const refresh_token = (0, auth_1.signJwt)({ sub: userId }, auth_1.refreshTokenPrivateKey, { expiresIn: `60m` });
    session[userId] = { access_token, refresh_token, user };
    return { access_token, refresh_token };
});
exports.signToken = signToken;
const createContext = ({ req, res, }) => (0, auth_1.deserializeUser)({ req, res }, session);
exports.t = server_1.initTRPC.context().create();
exports.appRouter = exports.t.router({
    login: exports.t.procedure
        .input(zod_1.z.object({
        username: zod_1.z.string(),
        password: zod_1.z.string()
    }))
        .mutation(({ input, ctx }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = (0, lodash_1.find)(users, { username: input.username });
        if (!user || user.password !== input.password) {
            throw new server_1.TRPCError({
                code: 'FORBIDDEN',
                message: 'Incorrect username or password.',
            });
        }
        const { access_token, refresh_token } = yield (0, exports.signToken)(user);
        ctx.res.cookie('access_token', access_token, accessTokenCookieOptions);
        ctx.res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
        ctx.res.cookie('loggedIn', true, Object.assign(Object.assign({}, accessTokenCookieOptions), { httpOnly: false }));
        return { status: 'success', access_token };
    })),
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = 8081;
app.use('/trpc', trpcExpress.createExpressMiddleware({
    router: exports.appRouter,
    createContext,
}));
app.get("/", (req, res) => {
    res.send("Hello from security");
});
app.listen(port, () => {
    console.log(`api-auth listening at http://localhost:${port}`);
});
