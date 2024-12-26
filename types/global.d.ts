/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

interface Window {
  ENV: {
    NODE_ENV: string;
    [key: string]: string;
  };
}