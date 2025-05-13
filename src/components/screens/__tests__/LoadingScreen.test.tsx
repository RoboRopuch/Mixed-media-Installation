import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoadingScreen } from '../LoadingScreen';

describe('LoadingScreen', () => {
    it('renders correctly', () => {
        const onVideoEnded = vi.fn();
        render(<LoadingScreen onVideoEnded={onVideoEnded} />);

        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading Screen');
        expect(screen.getByRole('status')).toHaveClass('loading-screen');
    });

    it('shows loading indicator initially', () => {
        const onVideoEnded = vi.fn();
        render(<LoadingScreen onVideoEnded={onVideoEnded} />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    });

    it('calls onVideoEnded when video ends', () => {
        const onVideoEnded = vi.fn();
        render(<LoadingScreen onVideoEnded={onVideoEnded} />);

        const video = screen.getByRole('status', { name: 'Loading animation' });
        fireEvent.ended(video);
        expect(onVideoEnded).toHaveBeenCalledTimes(1);
    });

    it('shows error message when video fails to load', () => {
        const onVideoEnded = vi.fn();
        render(<LoadingScreen onVideoEnded={onVideoEnded} />);

        const video = screen.getByRole('status', { name: 'Loading animation' });
        fireEvent.error(video);

        expect(screen.getByText('Failed to load video')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows retry button when error occurs', () => {
        const onVideoEnded = vi.fn();
        render(<LoadingScreen onVideoEnded={onVideoEnded} />);

        const video = screen.getByRole('status', { name: 'Loading animation' });
        fireEvent.error(video);

        const retryButton = screen.getByRole('button', { name: /retry/i });
        expect(retryButton).toBeInTheDocument();
    });
}); 