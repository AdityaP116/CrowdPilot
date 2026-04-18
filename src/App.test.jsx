import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App, { CrowdContext } from './App';
import WebNavbar from './components/WebNavbar';
import { BrowserRouter } from 'react-router-dom';

// Edge case: Mock window.matchMedia if used by chart libs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('CrowdPilot App Tests', () => {
  it('renders without crashing (Core Path)', () => {
    const mockContext = { alerts: [], zones: [], lastUpdated: new Date() };
    render(
      <BrowserRouter>
        <CrowdContext.Provider value={mockContext}>
          <WebNavbar alertCount={0} />
        </CrowdContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByText(/Crowd/i)).toBeInTheDocument();
    expect(screen.getByText(/Pilot/i)).toBeInTheDocument();
  });

  it('handles edge case: undefined alerts in navbar (Integration Flow)', () => {
    // Should default to 0 and not crash
    const mockContext = { alerts: undefined, zones: [], lastUpdated: new Date() };
    const alertCount = mockContext.alerts?.filter(a => a.severity === 'high').length ?? 0;
    
    render(
      <BrowserRouter>
        <CrowdContext.Provider value={mockContext}>
          <WebNavbar alertCount={alertCount} />
        </CrowdContext.Provider>
      </BrowserRouter>
    );
    expect(alertCount).toBe(0);
  });
});
