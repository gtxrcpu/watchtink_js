import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FrontCamera from '../FrontCamera';

describe('FrontCamera', () => {
    it('menampilkan dua panel kamera dan kontrolnya', () => {
        render(<FrontCamera />);
        expect(screen.getByText('Front Camera')).toBeTruthy();
        expect(screen.getByText('Back Camera')).toBeTruthy();
        expect(screen.getByText('Capture Front')).toBeTruthy();
        expect(screen.getByText('Capture Back')).toBeTruthy();
        expect(screen.getAllByText(/Active|Offline/i).length).toBeGreaterThanOrEqual(2);
    });

    it('toggle sync capture mengubah label', () => {
        render(<FrontCamera />);
        const toggle = screen.getAllByTitle('Sync Capture')[0];
        const initial = toggle.textContent;
        fireEvent.click(toggle);
        const after = toggle.textContent;
        expect(initial).not.toEqual(after);
    });
});
