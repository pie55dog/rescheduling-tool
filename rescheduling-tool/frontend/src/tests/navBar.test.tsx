// AI NOTICE
/* 
I used AI to write these tests, but I designed them. 
I needed 9 tests, one for each potential navigation pathway. 
I gave this list to Claude, who created these tests using vitest for react!
Since I used vitest in the backend and understand
the syntax, I didn't comb though it as rigorously and
was able to skim for understanding. 
*/

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import NavBar from '../elements/NavBar';
import CardView from '../elements/CardView';
import HistoryView from '../elements/HistoryView';
import WaitlistView from '../elements/WaitlistView';

// Mock axios for CardView since it makes API calls
vi.mock('axios');
import axios from 'axios';

beforeEach(() => {
  // Mock the axios.get call that CardView makes
  vi.mocked(axios.get).mockResolvedValue({
    data: {
      To_Do: [],
      Waitlist: [],
      Done: [],
      AllCards: []
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// HELPER: Render a page with router and navbar
// ═══════════════════════════════════════════════════════════════════════
function renderPageWithNav(
  PageComponent: React.ComponentType,
  initialRoute: string
): ReturnType<typeof render> {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <NavBar />
      <PageComponent />
    </MemoryRouter>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TEST SUITE: Navigation from Home Page
// ═══════════════════════════════════════════════════════════════════════
describe('Navigation from Home Page', () => {
  it('should navigate to Home when Home link is clicked', async () => {
    const user = userEvent.setup();
    renderPageWithNav(CardView, '/home');
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    await user.click(homeLink);
    
    expect(homeLink).toHaveAttribute('href', '/home');
  });

  it('should navigate to Waitlists when Waitlists link is clicked', async () => {
    const user = userEvent.setup();
    renderPageWithNav(CardView, '/home');
    
    const waitlistsLink = screen.getByRole('link', { name: /waitlists/i });
    await user.click(waitlistsLink);
    
    expect(waitlistsLink).toHaveAttribute('href', '/waitlists');
  });

  it('should navigate to History when History link is clicked', async () => {
    const user = userEvent.setup();
    renderPageWithNav(CardView, '/home');
    
    const historyLink = screen.getByRole('link', { name: /history/i });
    await user.click(historyLink);
    
    expect(historyLink).toHaveAttribute('href', '/history');
  });
});

// ═══════════════════════════════════════════════════════════════════════
// TEST SUITE: Navigation from Waitlist Page
// ═══════════════════════════════════════════════════════════════════════
describe('Navigation from Waitlist Page', () => {
  it('should navigate to Home when Home link is clicked', async () => {
    const user = userEvent.setup();
    renderPageWithNav(WaitlistView, '/waitlists');
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    await user.click(homeLink);
    
    expect(homeLink).toHaveAttribute('href', '/home');
  });

  it('should navigate to Waitlists when Waitlists link is clicked', async () => {
    const user = userEvent.setup();
    renderPageWithNav(WaitlistView, '/waitlists');
    
    const waitlistsLink = screen.getByRole('link', { name: /waitlists/i });
    await user.click(waitlistsLink);
    
    expect(waitlistsLink).toHaveAttribute('href', '/waitlists');
  });

  it('should navigate to History when History link is clicked', async () => {
    const user = userEvent.setup();
    renderPageWithNav(WaitlistView, '/waitlists');
    
    const historyLink = screen.getByRole('link', { name: /history/i });
    await user.click(historyLink);
    
    expect(historyLink).toHaveAttribute('href', '/history');
  });
});

// ═══════════════════════════════════════════════════════════════════════
// TEST SUITE: Navigation from History Page
// ═══════════════════════════════════════════════════════════════════════
describe('Navigation from History Page', () => {
  it('should navigate to Home when Home link is clicked', async () => {
    const user = userEvent.setup();
    renderPageWithNav(HistoryView, '/history');
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    await user.click(homeLink);
    
    expect(homeLink).toHaveAttribute('href', '/home');
  });

  it('should navigate to Waitlists when Waitlists link is clicked', async () => {
    const user = userEvent.setup();
    renderPageWithNav(HistoryView, '/history');
    
    const waitlistsLink = screen.getByRole('link', { name: /waitlists/i });
    await user.click(waitlistsLink);
    
    expect(waitlistsLink).toHaveAttribute('href', '/waitlists');
  });

  it('should navigate to History when History link is clicked', async () => {
    const user = userEvent.setup();
    renderPageWithNav(HistoryView, '/history');
    
    const historyLink = screen.getByRole('link', { name: /history/i });
    await user.click(historyLink);
    
    expect(historyLink).toHaveAttribute('href', '/history');
  });
});
