# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

# Added

    * New feature or functionality.
        - Detailed description of what the feature does.

# Changed

    * Modifications to existing functionality
        -  Specifics of the changes.

# Deprecated

    * Features that will be removed in the future.
        - Information on alternatives and removal timeframe.

### Removed

    * Features that have been removed.
        - The reason and what was removed.

### Fixed

    * Resolved issues and bugs.
        -  Detailed explanation of the fix.

### Security

    * Important security updates.
        - Information on any vulnerabilities or issues addressed

## [12-19-2024]
### Added

* Implemented dark mode functionality throughout the application.  The dark mode is activated automatically based on the user's system preferences.  Users can also manually toggle between light and dark mode.
* Added a loading indicator to improve user experience during data fetching.  The loading indicator is displayed while data is being fetched and disappears once the data has been loaded.
* Improved the overall styling and layout of the application, making it more visually appealing and user-friendly.
* Added more detailed descriptions to the updates section, making it easier for users to understand the progress of the project.
* Improved the accessibility of the application for users with disabilities.
* Improved performance by optimizing data fetching and rendering processes.

### Changed

* Updated the navigation bar to improve its usability and appearance.  The navigation bar is now easier to use on smaller screens.
* Updated the color scheme to match the overall branding of the project.
* Updated the font to improve readability.

### Fixed

* Fixed a bug that caused the application to crash on certain devices.
* Fixed a bug that prevented users from accessing certain pages.
* Fixed several minor bugs and improved the overall stability of the application.


## [Unreleased] - 2024-12-15

### Added

* Developed the following pages (Remix components) with placeholder content:
  * `/about`: Provides a basic description of the project.
    * `/updates`: Shows a list of recent updates with dates.
    * `/data`: Displays a message indicating where future data visualizations will be shown.
    * `/requirements`: Lists system requirements for the application.
* Implemented smooth scrolling for enhanced user experience.
* Implemented custom scrollbar styling for improved aesthetics.
* Created a fixed navigation bar in `layout.tsx` that remains visible at the top of the screen.  The navigation bar includes links to all major pages (`/`, `/about`, `/updates`, `/data`, `/requirements`). The currently active link is visually highlighted in bold.

### Changed

* Refined the styling in `global.css` for visual consistency and enhanced aesthetics.
* Restructured the application's layout for better maintainability and readability. Moved from `__layout.tsx` to `layout.tsx` for consistent layout application across all routes.

### Fixed

* Resolved issues with navigation bar rendering.
* Addressed potential routing issues by carefully reviewing the `routes` directory and ensuring that all page components are correctly linked to the navigation bar and the routes are correctly configured.
* Corrected CSS import issues to ensure proper Tailwind CSS application.



## [1.1.0] - 2024-12-14

# *# Added

    * Created a basic About Us page.
        - Added a simple `AboutUs.jsx` component to `/routes/about.jsx`.
        - Included a basic description of the project and its creator.
        - Styled with basic CSS modules using `app/styles/about.css`.
        - Created a link from the homepage to the about page
    * Improved the Homepage (`_index.jsx`).
        - Integrated Material UI components for better structure and styling.
        - Incorporated Tailwind CSS for layout and dark mode support.
        - Created a new `ResourceItem` component for list items to simplify the structure.
        - Converted the anchor tags to styled `Link` components from remix.
        - Updated the meta tags with more accurate info about the project.
        - Removed the need for a separate CSS file for the main page
        -  Updated the `CHANGELOG.md` template.
        - Added a section for today's changes, with clear and easy to read descriptions.
        - Added a `global.css` file for project wide styling.
        - Created a basic `global.css` in `/app/styles` and linked it using `app/root.jsx`

## [1.0.0] - 2024-12-13

# *# Created

    * Initial project setup.
    * Installed essential libraries using npm.
        - `@conform-to/zod`: Used for form validation with Zod.
        - `@emotion/react` & `@emotion/styled`: Used for CSS-in-JS.
        - `@hookform/resolvers`: Used to integrate Zod with React Hook Form.
        - `@mui/material`: Material UI component library.
        - `@remix-run/node`: Remix's Node adapter.
        - `@remix-run/react`: Remix's React adapter.
        - `@remix-run/serve`: For Remix production server.
        - `axios`: HTTP client for API requests.
        - `dayjs`: Lightweight date library.
        - `immer`: Immutable state management.
        - `isbot`: To detect bots for server rendering.
        - `react`: Core React library.
        - `react-dom`: DOM-specific React rendering.
        - `react-icons`: React icon library.
        - `react-query`: Data fetching and caching.
        - `react-router-dom`: React router library.
        - `recharts`: React charting library.
        - `remix-forms`: Utility for handling forms in Remix.
        - `remix-utils`: Helpful utilities for Remix.
        - `zod`: Schema validation and parsing.
        - `zustand`: State management.
        - `@remix-run/dev`: Remix's development tools.
        - `@types/react`: TypeScript types for React.
        - `@types/react-dom`: TypeScript types for React DOM.
        - `@typescript-eslint/eslint-plugin`: ESLint plugin for TypeScript.
        - `@typescript-eslint/parser`: ESLint parser for TypeScript.
        - `autoprefixer`: CSS post-processor.
        - `eslint`: Linter for JavaScript and TypeScript.
        - `eslint-import-resolver-typescript`: Resolves imports in TypeScript.
        - `eslint-plugin-import`: ESLint plugin for imports.
        - `eslint-plugin-jsx-a11y`: ESLint plugin for accessibility in JSX.
        - `eslint-plugin-react`: ESLint plugin for React.
        - `eslint-plugin-react-hooks`: ESLint plugin for React hooks.
        - `postcss`: Tool for transforming CSS with JS.
        - `remix-development-tools`: Development tools for Remix.
        - `tailwindcss`: CSS framework.
        - `typescript`: Language that adds static typing to Javascript.
        - `vite`: Front end build tool.
        - `vite-tsconfig-paths`: Vite plugin to resolve tsconfig paths.
        - Initialized project with `npm init`.
        - Started the development server with `npm run dev`.
        - Set up the basic frontend structure.

## [1.1.0] - 2024-12-14

# *# Added

    * Created a basic About Us page.
        - Added a simple `AboutUs.jsx` component to `/routes/about.jsx`.
        - Included a basic description of the project and its creator.
        - Styled with basic CSS modules using `app/styles/about.css`.
        - Created a link from the homepage to the about page
    * Improved the Homepage (`_index.jsx`).
        - Integrated Material UI components for better structure and styling.
        - Incorporated Tailwind CSS for layout and dark mode support.
        - Created a new `ResourceItem` component for list items to simplify the structure.
        - Converted the anchor tags to styled `Link` components from remix.
        - Updated the meta tags with more accurate info about the project.
        - Removed the need for a separate CSS file for the main page
        -  Updated the `CHANGELOG.md` template.
        - Added a section for today's changes, with clear and easy to read descriptions.
        - Added a `global.css` file for project wide styling.
        - Created a basic `global.css` in `/app/styles` and linked it using `app/root.jsx`

## [1.0.0] - 2024-12-13

# *# Created

    * Initial project setup.
    * Installed essential libraries using npm.
        - `@conform-to/zod`: Used for form validation with Zod.
        - `@emotion/react` & `@emotion/styled`: Used for CSS-in-JS.
        - `@hookform/resolvers`: Used to integrate Zod with React Hook Form.
        - `@mui/material`: Material UI component library.
        - `@remix-run/node`: Remix's Node adapter.
        - `@remix-run/react`: Remix's React adapter.
        - `@remix-run/serve`: For Remix production server.
        - `axios`: HTTP client for API requests.
        - `dayjs`: Lightweight date library.
        - `immer`: Immutable state management.
        - `isbot`: To detect bots for server rendering.
        - `react`: Core React library.
        - `react-dom`: DOM-specific React rendering.
        - `react-icons`: React icon library.
        - `react-query`: Data fetching and caching.
        - `react-router-dom`: React router library.
        - `recharts`: React charting library.
        - `remix-forms`: Utility for handling forms in Remix.
        - `remix-utils`: Helpful utilities for Remix.
        - `zod`: Schema validation and parsing.
        - `zustand`: State management.
        - `@remix-run/dev`: Remix's development tools.
        - `@types/react`: TypeScript types for React.
        - `@types/react-dom`: TypeScript types for React DOM.
        - `@typescript-eslint/eslint-plugin`: ESLint plugin for TypeScript.
        - `@typescript-eslint/parser`: ESLint parser for TypeScript.
        - `autoprefixer`: CSS post-processor.
        - `eslint`: Linter for JavaScript and TypeScript.
        - `eslint-import-resolver-typescript`: Resolves imports in TypeScript.
        - `eslint-plugin-import`: ESLint plugin for imports.
        - `eslint-plugin-jsx-a11y`: ESLint plugin for accessibility in JSX.
        - `eslint-plugin-react`: ESLint plugin for React.
        - `eslint-plugin-react-hooks`: ESLint plugin for React hooks.
        - `postcss`: Tool for transforming CSS with JS.
        - `remix-development-tools`: Development tools for Remix.
        - `tailwindcss`: CSS framework.
        - `typescript`: Language that adds static typing to Javascript.
        - `vite`: Front end build tool.
        - `vite-tsconfig-paths`: Vite plugin to resolve tsconfig paths.
        - Initialized project with `npm init`.
        - Started the development server with `npm run dev`.
        - Set up the basic frontend structure.
