import React, { useState } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { message, auth } from "./trpc";
import "./index.scss";

const client = new QueryClient();


const App = () => {
    const [messageClient] = useState(() =>
        message.createClient({
            links: [
                httpBatchLink({
                    url: "http://localhost:8001/trpc",
                }),
            ],
        })
    );

    const [authClient] = useState(() =>
        auth.createClient({
            links: [
                httpBatchLink({
                    url: "http://localhost:8081/trpc",
                }),
            ],
        })
    );


    return (
        <message.Provider client={messageClient} queryClient={client}>
            <auth.Provider client={authClient} queryClient={client}>
                <AppContent />
            </auth.Provider>
        </message.Provider>
    );
};

ReactDOM.render(<App />, document.getElementById("app"));
