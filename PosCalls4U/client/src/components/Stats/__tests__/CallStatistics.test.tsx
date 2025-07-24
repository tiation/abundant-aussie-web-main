import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { CallStatistics } from '../CallStatistics';
import { statsSlice } from '@/store/slices/statsSlice';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      stats: statsSlice.reducer,
    },
    preloadedState: {
      stats: {
        callStats: null,
        agentStats: null,
        isLoading: false,
        error: null,
        ...initialState,
      },
    },
  });
};

const renderWithProviders = (
  component: React.ReactElement,
  { initialState = {} } = {}
) => {
  const store = createMockStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    ),
    store,
  };
};

const mockCallStats = {
  totalCalls: 1250,
  avgDuration: 280,
  peakHours: ['09:00', '14:00', '16:00'],
  resolution_rate: 0.78,
  satisfaction_score: 4.2,
  trendsData: [
    { date: '2024-01-01', calls: 45 },
    { date: '2024-01-02', calls: 52 },
    { date: '2024-01-03', calls: 38 },
  ],
};

describe('CallStatistics', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    renderWithProviders(<CallStatistics />, {
      initialState: { isLoading: true },
    });

    expect(screen.getByText(/loading statistics/i)).toBeInTheDocument();
  });

  it('displays call statistics when data is loaded', () => {
    renderWithProviders(<CallStatistics />, {
      initialState: { callStats: mockCallStats },
    });

    expect(screen.getByText('1,250')).toBeInTheDocument(); // Total calls
    expect(screen.getByText('4:40')).toBeInTheDocument(); // Avg duration (280 seconds)
    expect(screen.getByText('78%')).toBeInTheDocument(); // Resolution rate
    expect(screen.getByText('4.2')).toBeInTheDocument(); // Satisfaction score
  });

  it('displays peak hours correctly', () => {
    renderWithProviders(<CallStatistics />, {
      initialState: { callStats: mockCallStats },
    });

    expect(screen.getByText(/9:00 AM/)).toBeInTheDocument();
    expect(screen.getByText(/2:00 PM/)).toBeInTheDocument();
    expect(screen.getByText(/4:00 PM/)).toBeInTheDocument();
  });

  it('handles date range filter', async () => {
    const { store } = renderWithProviders(<CallStatistics />, {
      initialState: { callStats: mockCallStats },
    });

    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);
    const applyButton = screen.getByRole('button', { name: /apply filter/i });

    await user.type(startDateInput, '2024-01-01');
    await user.type(endDateInput, '2024-01-07');
    await user.click(applyButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.stats.isLoading).toBe(true);
    });
  });

  it('displays error message when stats fail to load', () => {
    renderWithProviders(<CallStatistics />, {
      initialState: { error: 'Failed to fetch statistics' },
    });

    expect(screen.getByText(/failed to fetch statistics/i)).toBeInTheDocument();
  });

  it('shows trends chart when data is available', () => {
    renderWithProviders(<CallStatistics />, {
      initialState: { callStats: mockCallStats },
    });

    expect(screen.getByTestId('trends-chart')).toBeInTheDocument();
  });

  it('handles export functionality', async () => {
    const mockDownload = jest.fn();
    global.URL.createObjectURL = jest.fn();
    global.document.createElement = jest.fn(() => ({
      setAttribute: jest.fn(),
      click: mockDownload,
      href: '',
      download: '',
    }));

    renderWithProviders(<CallStatistics />, {
      initialState: { callStats: mockCallStats },
    });

    const exportButton = screen.getByRole('button', { name: /export data/i });
    await user.click(exportButton);

    expect(mockDownload).toHaveBeenCalled();
  });

  it('refreshes data when refresh button is clicked', async () => {
    const { store } = renderWithProviders(<CallStatistics />, {
      initialState: { callStats: mockCallStats },
    });

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await user.click(refreshButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.stats.isLoading).toBe(true);
    });
  });

  it('displays real-time updates correctly', async () => {
    const { rerender } = renderWithProviders(<CallStatistics />, {
      initialState: { callStats: mockCallStats },
    });

    expect(screen.getByText('1,250')).toBeInTheDocument();

    // Simulate real-time update
    const updatedStats = { ...mockCallStats, totalCalls: 1260 };
    
    rerender(
      <Provider store={createMockStore({ callStats: updatedStats })}>
        <BrowserRouter>
          <CallStatistics />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('1,260')).toBeInTheDocument();
    });
  });

  it('handles time zone selection', async () => {
    renderWithProviders(<CallStatistics />, {
      initialState: { callStats: mockCallStats },
    });

    const timezoneSelect = screen.getByLabelText(/timezone/i);
    await user.selectOptions(timezoneSelect, 'America/New_York');

    expect(timezoneSelect).toHaveValue('America/New_York');
  });

  it('shows comparison with previous period', () => {
    const statsWithComparison = {
      ...mockCallStats,
      previousPeriod: {
        totalCalls: 1180,
        avgDuration: 295,
        resolution_rate: 0.75,
      },
    };

    renderWithProviders(<CallStatistics />, {
      initialState: { callStats: statsWithComparison },
    });

    // Should show percentage changes
    expect(screen.getByText(/\+5.9%/)).toBeInTheDocument(); // Calls increase
    expect(screen.getByText(/\-5.1%/)).toBeInTheDocument(); // Duration decrease
    expect(screen.getByText(/\+4.0%/)).toBeInTheDocument(); // Resolution rate increase
  });
});
