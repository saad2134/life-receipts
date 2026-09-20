import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';

function ProblematicComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test component crash simulated');
  }
  return <div>Normal Content Rendering</div>;
}

describe('ErrorBoundary Component (FAIE Parameter 4: Reliability)', () => {
  it('renders normal children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Content Rendering')).toBeInTheDocument();
  });

  it('catches runtime errors and renders accessible error fallback alert', () => {
    // Suppress console.error during expected crash test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblematicComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went unexpected')).toBeInTheDocument();
    expect(screen.getByText(/Test component crash simulated/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Experience/i })).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
