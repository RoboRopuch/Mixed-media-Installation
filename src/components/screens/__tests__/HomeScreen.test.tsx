import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomeScreen } from '../HomeScreen';
import { HOME_TITLE, HOME_SUBTITLE } from '../../../constants';

describe('HomeScreen', () => {
    it('renders correctly', () => {
        const onSpacePress = vi.fn();
        render(<HomeScreen onSpacePress={onSpacePress} />);

        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getByText(HOME_TITLE)).toBeInTheDocument();
        expect(screen.getByText(HOME_SUBTITLE)).toBeInTheDocument();
        expect(screen.getByText('Press space to continue')).toBeInTheDocument();
    });

    it('calls onSpacePress when space is pressed', () => {
        const onSpacePress = vi.fn();
        render(<HomeScreen onSpacePress={onSpacePress} />);

        fireEvent.keyDown(window, { code: 'Space' });
        expect(onSpacePress).toHaveBeenCalledTimes(1);
    });

    it('does not call onSpacePress for other keys', () => {
        const onSpacePress = vi.fn();
        render(<HomeScreen onSpacePress={onSpacePress} />);

        fireEvent.keyDown(window, { code: 'Enter' });
        expect(onSpacePress).not.toHaveBeenCalled();
    });

    it('cleans up event listener on unmount', () => {
        const onSpacePress = vi.fn();
        const { unmount } = render(<HomeScreen onSpacePress={onSpacePress} />);

        unmount();
        fireEvent.keyDown(window, { code: 'Space' });
        expect(onSpacePress).not.toHaveBeenCalled();
    });
}); 