import { createTRPCReact } from "@trpc/react-query";
import { AppRouter as MessageRouter } from "message";
import { AppRouter as AuthRouter } from "security";

export const message = createTRPCReact<MessageRouter>();
export const auth = createTRPCReact<AuthRouter>();
