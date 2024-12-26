import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import tsconfigPaths from "vite-tsconfig-paths";


declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss({ config: './tailwind.config.ts' }), // Path corrected!
        autoprefixer(),
      ],
    },
  },
    ssr: {
        noExternal: ['react-router-dom', 'react-router', '@google-ai/generativelanguage', 'google-auth-library', 'composable-functions'],
        target: 'node', // Specify the Node.js environment
          resolve: {
              externalConditions: ['node'],
            }
    },
})