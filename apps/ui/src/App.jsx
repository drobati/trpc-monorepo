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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_query_1 = require("react-query");
const trpc_1 = require("./trpc");
require("./index.scss");
const client = new react_query_1.QueryClient();
const AppContent = () => {
    var _a;
    const [user, setUser] = (0, react_1.useState)("");
    const [msg, setMsg] = (0, react_1.useState)("");
    const auth = trpc_1.message.useQuery(["login"]);
    const getMessages = trpc_1.message.useQuery(["getMessages"]);
    const addMessage = trpc_1.message.useMutation("addMessage");
    const onAdd = () => {
        addMessage.mutate({
            message: msg,
            user,
        }, {
            onSuccess: () => {
                client.invalidateQueries(["getMessages"]).then(r => r);
            },
        });
    };
    return (<div className="mt-10 text-3xl mx-auto max-w-6xl">
            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" action="#" method="POST">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input id="email" name="email" type="email" autoComplete="email" required className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <ul role="list" className="divide-y divide-gray-200">
                {((_a = getMessages.data) !== null && _a !== void 0 ? _a : []).map((row) => (<li key={row.message} className="flex py-4">
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{row.user}</p>
                            <p className="text-sm text-gray-500">{row.message}</p>
                        </div>
                    </li>))}
            </ul>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6 mt-5 sm:flex sm:items-center">
                        <div className="w-full sm:max-w-xs">
                            <label htmlFor="email" className="sr-only">
                                Username
                            </label>
                            <input type="text" value={user} onChange={(e) => setUser(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="User"/>
                        </div>
                        <div className="w-full sm:max-w-xs">
                            <label htmlFor="email" className="sr-only">
                                Message
                            </label>
                            <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Message"/>
                        </div>
                        <button onClick={onAdd} className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Add Message
                        </button>
                </div>
            </div>
        </div>);
};
const App = () => {
    const [trpcClient] = (0, react_1.useState)(() => trpc_1.message.createClient({
        url: "http://localhost:8080/trpc",
    }));
    return (<trpc_1.message.Provider client={trpcClient} queryClient={client}>
            <react_query_1.QueryClientProvider client={client}>
                <AppContent />
            </react_query_1.QueryClientProvider>
        </trpc_1.message.Provider>);
};
react_dom_1.default.render(<App />, document.getElementById("app"));
