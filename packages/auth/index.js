"use strict";
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
exports.deserializeUser = exports.verifyJwt = exports.signJwt = exports.refreshTokenPublicKey = exports.refreshTokenPrivateKey = exports.accessTokenPublicKey = exports.accessTokenPrivateKey = void 0;
const server_1 = require("@trpc/server");
const lodash_1 = require("lodash");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// It would be wise to store this as a config.
exports.accessTokenPrivateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
exports.accessTokenPublicKey = process.env.ACCESS_TOKEN_PUBLIC_KEY;
exports.refreshTokenPrivateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
exports.refreshTokenPublicKey = process.env.REFRESH_TOKEN_PUBLIC_KEY;
const signJwt = (payload, key, options = {}) => {
    return jsonwebtoken_1.default.sign(payload, key, Object.assign({}, (options !== null && options !== void 0 ? options : {})));
};
exports.signJwt = signJwt;
const verifyJwt = (token, key) => {
    try {
        return jsonwebtoken_1.default.verify(token, key);
    }
    catch (error) {
        console.log(error);
        return null;
    }
};
exports.verifyJwt = verifyJwt;
const deserializeUser = ({ req, res }, session) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the token
        let access_token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            access_token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies.access_token) {
            access_token = req.cookies.access_token;
        }
        const notAuthenticated = { req, res, user: null };
        if (!access_token)
            return notAuthenticated;
        const decoded = (0, exports.verifyJwt)(access_token, exports.accessTokenPublicKey);
        if (!decoded)
            return notAuthenticated;
        // Check if user has a valid session
        const validSession = yield session[decoded.sub];
        if (!validSession)
            return notAuthenticated;
        // Check if user still exist
        const user = yield (0, lodash_1.find)(users, decoded.sub);
        if (!user)
            return notAuthenticated;
        return { req, res, user };
    }
    catch (err) {
        throw new server_1.TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: err.message,
        });
    }
});
exports.deserializeUser = deserializeUser;
