import { Links, LiveReload, Meta, Scripts, ScrollRestoration, Outlet } from '@remix-run/react';
import { DarkModeProvider } from './context/DarkModeContext';
import './styles/index.css';
import './styles/page.css';  // Additional global styles

export default function App() {
    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
                <title>Dean Machines</title>
                <meta name="description" content="FPV Prototype Web App" />
            </head>
            <body>
                <DarkModeProvider>
                    <Outlet /> {/* Replace Layout with Outlet */}
                </DarkModeProvider>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}

export function ErrorBoundary() {
    const caught = useRouteError();

    let errorMessage = null;

    if (isRouteErrorResponse(caught)) {
        errorMessage = <p>{caught.status} {caught.statusText} {caught.data?.message}</p>;
    } else if (caught instanceof Error) {
        errorMessage = <p>A client-side error occurred. Error Message: {caught.message}</p>;
    } else {
        errorMessage = <p>An unexpected error occurred.</p>;
    }

    return (
        <div>
            <h1>Oops!</h1>
            {errorMessage}
        </div>
    );
}

function isRouteErrorResponse(caught: unknown): caught is { status: number; statusText: string; data?: { message?: string } } {
    return (
        caught != null &&
        typeof caught === 'object' &&
        'status' in caught &&
        'statusText' in caught
    );
}