import { google } from '@genkit-ai/core';

export const googleClient = google({
  credentials: {
    // Replace with your actual credentials
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
});
