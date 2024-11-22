import express from "express";
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";
import { deserializeUser, User } from "auth";

interface ChatMessage {
  user: string;
  message: string;
}

const messages: ChatMessage[] = [
  { user: "user1", message: "Hello" },
  { user: "user2", message: "Hi" },
];

const session = {};
const users: User[] = [];

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  const user = deserializeUser({ req, res }, session, users);
  return { req, res, user };
};

type Context = inferAsyncReturnType<typeof createContext>;
export const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
    getMessages: t.procedure
        .input(z.number().default(10))
        .query(async ({ input }) => {
            return messages.slice(0, input);
        }),
    addMessage: t.procedure
        .input(z.object({ user: z.string(), message: z.string() }))
        .mutation(async ({ input }) => {
            messages.push(input);
            return input;
        })
})

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
const port = 8080;

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get("/", (req, res) => {
  res.send("Hello from message");
});

app.listen(port, () => {
  console.log(`api-message listening at http://localhost:${port}`);
});
