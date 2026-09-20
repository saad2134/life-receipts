import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App Integration & End-to-End User Flow (FAIE Parameters 1, 3, 4, 5, 6)', () => {
  it('renders the initial view with branding, stats, and thermal tape', async () => {
    render(<App />);

    // Brand and logo
    expect(screen.getByText('LifeReceipts')).toBeInTheDocument();
    expect(screen.getByText(/ARCHIVE EDITION/i)).toBeInTheDocument();

    // Stats
    expect(screen.getByText(/Digital Receipts/i)).toBeInTheDocument();
    expect(screen.getByText(/Financial Footprint/i)).toBeInTheDocument();

    // Thermal tape view default (lazy loaded)
    expect(await screen.findByText(/LIFE ARCHIVE/i)).toBeInTheDocument();
  });

  it('switches between views using navigation tabs', async () => {
    render(<App />);

    // Switch to Bento Grid
    const bentoTab = screen.getAllByRole('tab', { name: /Bento Grid/i })[0];
    fireEvent.click(bentoTab);

    // Should display receipt search input in Grid view
    expect(await screen.findByLabelText(/Search life receipts/i)).toBeInTheDocument();

    // Switch to Constellation (lazy loaded)
    const constellationTab = screen.getAllByRole('tab', { name: /Constellation/i })[0];
    fireEvent.click(constellationTab);
    expect(await screen.findByText(/Discovered Patterns:/i)).toBeInTheDocument();

    // Switch to Life Chapters (lazy loaded)
    const chaptersTab = screen.getAllByRole('tab', { name: /Life Chapters/i })[0];
    fireEvent.click(chaptersTab);
    expect(await screen.findByText(/CHAPTER 1 OF/i)).toBeInTheDocument();

    // Switch to Connection Detective (lazy loaded)
    const detectiveTab = screen.getAllByRole('tab', { name: /Connection Detective/i })[0];
    fireEvent.click(detectiveTab);
    expect(await screen.findByText(/CONNECTION DETECTIVE MODE/i)).toBeInTheDocument();
  });

  it('filters receipts when typing in search bar in grid view', () => {
    render(<App />);

    const bentoTab = screen.getAllByRole('tab', { name: /Bento Grid/i })[0];
    fireEvent.click(bentoTab);

    const searchInput = screen.getByLabelText(/Search life receipts/i);
    fireEvent.change(searchInput, { target: { value: 'Lana' } });

    // Should filter down and still have results
    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
  });

  it('opens and closes the dataset management modal', () => {
    render(<App />);

    const datasetBtn = screen.getByRole('button', { name: /Upload custom or organizer dataset/i });
    fireEvent.click(datasetBtn);

    expect(screen.getByText('Dataset Management')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close modal/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Dataset Management')).not.toBeInTheDocument();
  });
});
