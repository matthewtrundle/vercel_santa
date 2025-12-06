import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GiftCard } from './gift-card';

// Mock the server actions
vi.mock('@/actions/santa-list', () => ({
  addToSantaList: vi.fn(),
  removeFromSantaList: vi.fn(),
}));

import { addToSantaList, removeFromSantaList } from '@/actions/santa-list';

const mockGift = {
  id: 'gift-1',
  name: 'Test Gift',
  description: 'A wonderful test gift',
  category: 'toys',
  price: '29.99',
  affiliateUrl: 'https://example.com/gift',
};

const defaultProps = {
  sessionId: 'session-123',
  gift: mockGift,
  score: 95,
  reasoning: 'This gift matches their interests perfectly',
  matchedInterests: ['LEGO', 'building', 'creativity'],
  recommendationId: 'rec-1',
  isInList: false,
};

describe('GiftCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders gift name and description', () => {
    render(<GiftCard {...defaultProps} />);
    expect(screen.getByText('Test Gift')).toBeInTheDocument();
    expect(screen.getByText('A wonderful test gift')).toBeInTheDocument();
  });

  it('displays the match score', () => {
    render(<GiftCard {...defaultProps} />);
    expect(screen.getByText('95% Match')).toBeInTheDocument();
  });

  it('displays the category', () => {
    render(<GiftCard {...defaultProps} />);
    expect(screen.getByText('toys')).toBeInTheDocument();
  });

  it('displays the price as Nice Points', () => {
    render(<GiftCard {...defaultProps} />);
    expect(screen.getByText(/30 Nice Points/)).toBeInTheDocument();
  });

  it('displays reasoning when provided', () => {
    render(<GiftCard {...defaultProps} />);
    expect(screen.getByText(/This gift matches their interests perfectly/)).toBeInTheDocument();
  });

  it('does not display reasoning when not provided', () => {
    render(<GiftCard {...defaultProps} reasoning={null} />);
    expect(screen.queryByText(/This gift matches/)).not.toBeInTheDocument();
  });

  it('displays matched interests', () => {
    render(<GiftCard {...defaultProps} />);
    expect(screen.getByText('LEGO')).toBeInTheDocument();
    expect(screen.getByText('building')).toBeInTheDocument();
    expect(screen.getByText('creativity')).toBeInTheDocument();
  });

  it('limits displayed interests to 3', () => {
    const manyInterests = ['one', 'two', 'three', 'four', 'five'];
    render(<GiftCard {...defaultProps} matchedInterests={manyInterests} />);
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();
    expect(screen.getByText('three')).toBeInTheDocument();
    expect(screen.queryByText('four')).not.toBeInTheDocument();
    expect(screen.queryByText('five')).not.toBeInTheDocument();
  });

  it('shows Add button when not in list', () => {
    render(<GiftCard {...defaultProps} isInList={false} />);
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('shows On List button when in list', () => {
    render(<GiftCard {...defaultProps} isInList={true} />);
    expect(screen.getByRole('button', { name: /on list/i })).toBeInTheDocument();
  });

  it('renders affiliate link when url is provided', () => {
    render(<GiftCard {...defaultProps} />);
    const viewLink = screen.getByRole('link', { name: /view/i });
    expect(viewLink).toHaveAttribute('href', 'https://example.com/gift');
    expect(viewLink).toHaveAttribute('target', '_blank');
    expect(viewLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render affiliate link when url is null', () => {
    render(<GiftCard {...defaultProps} gift={{ ...mockGift, affiliateUrl: null }} />);
    expect(screen.queryByRole('link', { name: /view/i })).not.toBeInTheDocument();
  });

  it('applies green ring styling when in list', () => {
    const { container } = render(<GiftCard {...defaultProps} isInList={true} />);
    const card = container.firstChild;
    expect(card).toHaveClass('ring-2');
    expect(card).toHaveClass('ring-green-500');
  });

  it('calls addToSantaList when Add button is clicked', async () => {
    (addToSantaList as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });

    render(<GiftCard {...defaultProps} isInList={false} />);
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addToSantaList).toHaveBeenCalledWith('session-123', 'gift-1', 'rec-1');
    });
  });

  it('calls removeFromSantaList when On List button is clicked', async () => {
    (removeFromSantaList as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });

    render(<GiftCard {...defaultProps} isInList={true} />);
    const removeButton = screen.getByRole('button', { name: /on list/i });

    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(removeFromSantaList).toHaveBeenCalledWith('session-123', 'gift-1');
    });
  });

  it('handles empty matched interests', () => {
    render(<GiftCard {...defaultProps} matchedInterests={[]} />);
    expect(screen.getByText('Test Gift')).toBeInTheDocument();
  });
});
