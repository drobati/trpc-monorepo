"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.message = void 0;
const react_query_1 = require("@trpc/react-query");
exports.message = (0, react_query_1.createTRPCReact)();
exports.auth = (0, react_query_1.createTRPCReact)();
