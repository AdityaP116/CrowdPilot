import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './pages/user/Home';
import { CrowdContext } from './App';
import { BrowserRouter } from 'react-router-dom';

describe('Home Page Logic Tests', () => {
  it('renders fallback when no bestGate exists', () => {
    const mockContext = {
      zones: [{ level: 'high', density: 85 }],
      alerts: [],
      overallStatus: 'High',
      lastUpdated: new Date(),
      bestGate: null // Null edge case pathway
    };

    render(
      <BrowserRouter>
        <CrowdContext.Provider value={mockContext}>
          <Home />
        </CrowdContext.Provider>
      </BrowserRouter>
    );

    // Ensure the normal titles rendered
    expect(screen.getByText('CrowdPulse')).toBeInTheDocument();
    
    // Ensure the suggestion banner does NOT render when bestGate is null
    const gateSuggestionTxt = screen.queryByText(/Best Entry Right Now/i);
    expect(gateSuggestionTxt).not.toBeInTheDocument();
  });

  it('renders bestGate suggestion when available', () => {
    const mockContext = {
      zones: [{ level: 'low', density: 15 }],
      alerts: [],
      overallStatus: 'Low',
      lastUpdated: new Date(),
      bestGate: { name: 'Gate C', density: 15 } // Happy pathway
    };

    render(
      <BrowserRouter>
        <CrowdContext.Provider value={mockContext}>
          <Home />
        </CrowdContext.Provider>
      </BrowserRouter>
    );

    // Gate C should be rendered inside the banner
    expect(screen.getByText(/Gate C/i)).toBeInTheDocument();
  });
});
