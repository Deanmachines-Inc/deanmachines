# Code Style and Conventions:

- For JavaScript/TypeScript, use camelCase for variable names and PascalCase for class names. # Naming conventions for Javascript/Typescript.
- When generating TypeScript, use type annotations whenever possible, especially with function parameters and return types. # TypeScript style
- In TypeScript/Javascript, always use double quotes for string values, unless single quotes are needed to avoid escaping special characters inside double quotes. # Style to use double quotes for string values
- Use tabs for indentation in TypeScript, JavaScript, JSX, and TSX files. # Indentation
- When writing React code, always prefer functional components with hooks. # Preferred components.
- When generating React components that involve state, prefer to use the 'useState' hook. # Hooks in React components.
- For functions, add a brief comment if it is non-trivial, and provide a docstring using JSDoc or TSDoc format for documentation. # Functions documentation standards
- When suggesting new functions or components, always provide clear usage examples, including how to call the function with different values, or how to invoke the new component. # Examples for new functions
- When generating React components, ensure that the styling aligns with TailwindCSS conventions and also provide the styling needed for that component. # Enforce TailwindCSS usage.
- When using SQL queries, use parameterized queries with placeholders for all dynamic values, and do not include specific values directly into the query string. # Security practice.
- When dealing with environment variables, please provide a sample of how to set it in a `.env` file, along with a sample command line export instruction using `$export [VARIABLE_NAME]=[VALUE]` if that variable will be used in the command line. # Specific way of showing env vars

# Tone and Response Style:
- Assume the user has some experience with command line, only give explanation on the steps if asked for. # User knowledge assumed.
- Use a conversational, helpful and friendly tone. # Tone for the LLM.
- If the response includes code, make sure the code is in a code block and indicate the language used. # Ensure code blocks.
- Keep the responses concise, especially if the answer is straightforward. If it is complex, include necessary details as needed. # Control response length.
- Do not make comments on the prompt that was provided, just respond with the required answer. # Avoid LLM comments on prompts.

# Project Specifics:
- When working with Firebase, try to provide suggestions or code for utilizing the Firebase SDK with React and show how to initialize it with a sample `.env` file. # Firebase
- If a prompt contains a reference to "genaiscript", use the genaiscript settings from the settings.json and always provide a `genkit.config.ts` file if required in your code output. # Genaiscript preference.
- When generating code related to git, consider adding commonly used git commands (e.g., `git add .`, `git commit -m "message"`, etc.) that would be appropriate for that code change, for example after generating files. # Git commands.

# Architectural Practices:
- When generating Remix code, adhere to all the best practices for data loading in Remix and using the Remix router, including data loading using the `loader` and `action` functions. # Best Practices.
- Use the `useLoaderData` and `useActionData` hooks for data management within Remix routes. # Data management patterns in Remix.
- When generating Remix components, always follow the folder structure conventions, including the `app`, `components` and `routes` folder. # Enforce Remix structure
- Always include a type for Remix loader data or action data, to ensure that the data has the correct type, and that you have the types to use for error checking. # Type data for remix.

# Genkit specifics:
- When working with Genkit, prioritize using the Genkit SDK, and configuration files like `genkit.config.ts`, for managing genkit flows. # How to use Genkit
- When generating code related to Genkit, make sure that the code is commented, and that every function is documented with docstrings using JSDoc or TSDoc format. # Coding style for Genkit.
- Assume that when you generate code that is related to genkit, that the `genkit.config.ts` has already been configured with the necessary provider and models, and you can only make changes to the values needed. # Configuring genkit.

# Testing:
- If the response includes a new function, always provide a unit test function (or method) along with instructions on how to run and test it. # Unit tests for all functions.
- If the response contains instructions that include commands that modify the code, provide instructions on how to verify those changes. # Verifying command output.
