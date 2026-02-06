import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MentalHealth from '../MentalHealth';

describe('MentalHealth', () => {
    it('menampilkan header admin dan panel utama', () => {
        render(<MentalHealth />);

        expect(screen.getByRole('heading', { name: /Admin Mental Health Command Center/i })).toBeTruthy();
        expect(screen.getByRole('heading', { name: /Tren Absensi vs Risiko Mental/i })).toBeTruthy();
        expect(screen.getByRole('heading', { name: /Live Monitoring Feed/i })).toBeTruthy();
    });

    it('menampilkan monitoring dan laporan otomatis', () => {
        render(<MentalHealth />);

        expect(screen.getAllByRole('heading', { name: /Monitoring Risiko User/i }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole('heading', { name: /Auto Report System/i }).length).toBeGreaterThan(0);
        expect(screen.getAllByRole('button', { name: /Generate Report/i }).length).toBeGreaterThan(0);
    });
});
