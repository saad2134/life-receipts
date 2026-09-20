import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectionDetectiveView } from '../components/ConnectionDetectiveView';
import { INITIAL_LIFE_RECEIPTS } from '../data/lifeReceiptsData';

describe('Connection Detective View (Competitive Advantage & Problem Overview Alignment)', () => {
  it('renders the initial case file and breadcrumb stepper', () => {
    const handleSelect = vi.fn();
    render(
      <ConnectionDetectiveView
        receipts={INITIAL_LIFE_RECEIPTS}
        onSelectReceipt={handleSelect}
      />
    );

    // Case title and detective banner
    expect(screen.getByText(/CONNECTION DETECTIVE MODE/i)).toBeInTheDocument();
    expect(screen.getAllByText(/The 2 AM Koramangala Pivot/i)[0]).toBeInTheDocument();

    // First clue details
    expect(screen.getByText(/Forensic Clue 1 of 5/i)).toBeInTheDocument();
    expect(screen.getAllByText(/The Trigger Search/i)[0]).toBeInTheDocument();
  });

  it('navigates through clues using Next Clue and Previous Clue buttons', () => {
    const handleSelect = vi.fn();
    render(
      <ConnectionDetectiveView
        receipts={INITIAL_LIFE_RECEIPTS}
        onSelectReceipt={handleSelect}
      />
    );

    // Step 1
    const nextBtn = screen.getByRole('button', { name: /Next Clue/i });
    fireEvent.click(nextBtn);

    // Step 2
    expect(screen.getByText(/Forensic Clue 2 of 5/i)).toBeInTheDocument();
    expect(screen.getAllByText(/The Atmospheric Score/i)[0]).toBeInTheDocument();

    // Previous clue
    const prevBtn = screen.getByRole('button', { name: /Previous Clue/i });
    fireEvent.click(prevBtn);
    expect(screen.getByText(/Forensic Clue 1 of 5/i)).toBeInTheDocument();
  });

  it('switches between investigation chains', () => {
    const handleSelect = vi.fn();
    render(
      <ConnectionDetectiveView
        receipts={INITIAL_LIFE_RECEIPTS}
        onSelectReceipt={handleSelect}
      />
    );

    const monsoonTab = screen.getByRole('button', { name: /Monsoon Transit to Sea/i });
    fireEvent.click(monsoonTab);

    expect(screen.getAllByText(/Monsoon Transit to Sea/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/The Departure Terminal/i)[0]).toBeInTheDocument();
  });

  it('invokes onSelectReceipt when clicking the anchored receipt card', () => {
    const handleSelect = vi.fn();
    render(
      <ConnectionDetectiveView
        receipts={INITIAL_LIFE_RECEIPTS}
        onSelectReceipt={handleSelect}
      />
    );

    const inspectBtn = screen.getByRole('button', { name: /Inspect anchored receipt in modal/i });
    fireEvent.click(inspectBtn);

    expect(handleSelect).toHaveBeenCalled();
  });

  it('solves the case and displays synthesis story when completing all 5 steps', () => {
    const handleSelect = vi.fn();
    render(
      <ConnectionDetectiveView
        receipts={INITIAL_LIFE_RECEIPTS}
        onSelectReceipt={handleSelect}
      />
    );

    // Click next 4 times to reach step 5
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Next Clue/i }));
    }

    // Now on step 5, button is Solve Case
    const solveBtn = screen.getByRole('button', { name: /Solve Case/i });
    fireEvent.click(solveBtn);

    // Synthesis story banner should appear
    expect(screen.getByText(/Investigation Complete/i)).toBeInTheDocument();
    expect(screen.getByText(/5 of 5 Clues Verified/i)).toBeInTheDocument();
  });
});
