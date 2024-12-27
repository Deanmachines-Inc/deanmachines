import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRemixStub } from '@remix-run/testing';
import Genkit from '../genkit';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Define types inline to avoid import issues
type LoaderData = {
  configured: boolean;
  projectId: string | null;
  availableModels: Array<{
    id: string;
    name: string;
    maxTokens: number;
  }>;
};

type GenkitResponse = {
  text: string;
  analysis?: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    keywords: string[];
  };
};

afterEach(() => {
  cleanup();
});

describe('Genkit Component', () => {
  const mockResponse: GenkitResponse = {
    text: 'Test response',
    analysis: {
      sentiment: 'positive',
      confidence: 0.95,
      keywords: ['test', 'response'],
    },
  };

  const mockLoaderData: LoaderData = {
    configured: true,
    projectId: 'test-project',
    availableModels: [
      {
        id: 'text-bison-001',
        name: 'Text Bison',
        maxTokens: 8192,
      },
    ],
  };

  it('renders correctly when configured', () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Genkit,
        loader: () => mockLoaderData,
      },
    ]);

    render(<RemixStub />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render model selector when configured', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Genkit,
        loader: () => mockLoaderData,
      },
    ]);

    render(<RemixStub />);
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Text Bison')).toBeInTheDocument();
    });
  });

  it('should handle form submission', async () => {
    const user = userEvent.setup();
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Genkit,
        loader: () => mockLoaderData,
        action: async () => ({ response: mockResponse }),
      },
    ]);

    render(<RemixStub />);

    const input = screen.getByPlaceholderText(/enter text to process/i);
    await user.type(input, 'Test prompt');

    const submitButton = screen.getByRole('button', { name: /process text/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(mockResponse.text)).toBeInTheDocument();
      expect(screen.getByText(/confidence: 95%/i)).toBeInTheDocument();
    });
  });

  it('should show error when not configured', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Genkit,
        loader: () => ({
          configured: false,
          projectId: null,
          availableModels: [],
        }),
      },
    ]);

    render(<RemixStub />);
    await waitFor(() => {
      expect(screen.getByText(/configuration error/i)).toBeInTheDocument();
    });
  });

  it('should handle processing errors', async () => {
    const user = userEvent.setup();
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Genkit,
        loader: () => mockLoaderData,
        action: async () => ({ error: 'Processing failed' }),
      },
    ]);

    render(<RemixStub />);

    const input = screen.getByPlaceholderText(/enter text to process/i);
    await user.type(input, 'Test prompt');

    const submitButton = screen.getByRole('button', { name: /process text/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/processing failed/i)).toBeInTheDocument();
    });
  });
});

export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/app/$1',
  },
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
