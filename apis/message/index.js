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
exports.appRouter = exports.t = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = require("@trpc/server");
const trpcExpress = __importStar(require("@trpc/server/adapters/express"));
const cors_1 = __importDefault(require("cors"));
const zod_1 = require("zod");
const auth_1 = require("auth");
const messages = [
    { user: "user1", message: "Hello" },
    { user: "user2", message: "Hi" },
];
const createContext = ({ req, res }) => (0, auth_1.deserializeUser)({ req, res });
exports.t = server_1.initTRPC.context().create();
exports.appRouter = exports.t.router({
    getMessages: exports.t.procedure
        .input(zod_1.z.number().default(10))
        .query(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        return messages.slice(0, input);
    })),
    addMessage: exports.t.procedure
        .input(zod_1.z.object({ user: zod_1.z.string(), message: zod_1.z.string() }))
        .mutation(({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        messages.push(input);
        return input;
    }))
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = 8080;
app.use("/trpc", trpcExpress.createExpressMiddleware({
    router: exports.appRouter,
    createContext: () => null,
}));
app.get("/", (req, res) => {
    res.send("Hello from message");
});
app.listen(port, () => {
    console.log(`api-message listening at http://localhost:${port}`);
});
