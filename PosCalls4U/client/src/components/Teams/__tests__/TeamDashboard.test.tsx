import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { TeamDashboard } from '../TeamDashboard';
import { teamsSlice } from '@/store/slices/teamsSlice';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      teams: teamsSlice.reducer,
    },
    preloadedState: {
      teams: {
        teams: [],
        currentTeam: null,
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

const mockTeams = [
  {
    id: '1',
    name: 'Support Team',
    members: ['1', '2', '3'],
    supervisor: '1',
    stats: {
      totalCalls: 150,
      avgCallDuration: 300,
      resolution_rate: 0.85,
    },
  },
  {
    id: '2',
    name: 'Sales Team',
    members: ['4', '5', '6'],
    supervisor: '4',
    stats: {
      totalCalls: 200,
      avgCallDuration: 420,
      resolution_rate: 0.78,
    },
  },
];

describe('TeamDashboard', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    renderWithProviders(<TeamDashboard />, {
      initialState: { isLoading: true },
    });

    expect(screen.getByText(/loading teams/i)).toBeInTheDocument();
  });

  it('renders teams list when data is loaded', () => {
    renderWithProviders(<TeamDashboard />, {
      initialState: { teams: mockTeams },
    });

    expect(screen.getByText('Support Team')).toBeInTheDocument();
    expect(screen.getByText('Sales Team')).toBeInTheDocument();
  });

  it('displays team statistics correctly', () => {
    renderWithProviders(<TeamDashboard />, {
      initialState: { teams: mockTeams },
    });

    // Support Team stats
    expect(screen.getByText('150')).toBeInTheDocument(); // Total calls
    expect(screen.getByText('85%')).toBeInTheDocument(); // Resolution rate

    // Sales Team stats
    expect(screen.getByText('200')).toBeInTheDocument(); // Total calls
    expect(screen.getByText('78%')).toBeInTheDocument(); // Resolution rate
  });

  it('handles team selection', async () => {
    const { store } = renderWithProviders(<TeamDashboard />, {
      initialState: { teams: mockTeams },
    });

    const supportTeamCard = screen.getByText('Support Team');
    await user.click(supportTeamCard);

    await waitFor(() => {
      const state = store.getState();
      expect(state.teams.currentTeam).toEqual(mockTeams[0]);
    });
  });

  it('displays error message when teams fail to load', () => {
    renderWithProviders(<TeamDashboard />, {
      initialState: { error: 'Failed to fetch teams' },
    });

    expect(screen.getByText(/failed to fetch teams/i)).toBeInTheDocument();
  });

  it('renders create team button for supervisors', () => {
    renderWithProviders(<TeamDashboard />, {
      initialState: { 
        teams: mockTeams,
        userRole: 'supervisor'
      },
    });

    expect(screen.getByRole('button', { name: /create team/i })).toBeInTheDocument();
  });

  it('does not render create team button for agents', () => {
    renderWithProviders(<TeamDashboard />, {
      initialState: { 
        teams: mockTeams,
        userRole: 'agent'
      },
    });

    expect(screen.queryByRole('button', { name: /create team/i })).not.toBeInTheDocument();
  });

  it('filters teams by search query', async () => {
    renderWithProviders(<TeamDashboard />, {
      initialState: { teams: mockTeams },
    });

    const searchInput = screen.getByPlaceholderText(/search teams/i);
    await user.type(searchInput, 'Support');

    await waitFor(() => {
      expect(screen.getByText('Support Team')).toBeInTheDocument();
      expect(screen.queryByText('Sales Team')).not.toBeInTheDocument();
    });
  });

  it('shows empty state when no teams exist', () => {
    renderWithProviders(<TeamDashboard />, {
      initialState: { teams: [] },
    });

    expect(screen.getByText(/no teams found/i)).toBeInTheDocument();
  });

  it('handles refresh button click', async () => {
    const { store } = renderWithProviders(<TeamDashboard />, {
      initialState: { teams: mockTeams },
    });

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await user.click(refreshButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.teams.isLoading).toBe(true);
    });
  });
});
