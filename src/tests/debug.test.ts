import { describe, it } from 'vitest';
import * as Lucide from 'lucide-react';
import App from '../App';

describe('Diagnostics', () => {
  it('checks imports', () => {
    console.log('--- LUCIDE ICONS CHECK ---');
    console.log('LayoutDashboard:', typeof Lucide.LayoutDashboard);
    console.log('Calendar:', typeof Lucide.Calendar);
    console.log('BookOpen:', typeof Lucide.BookOpen);
    console.log('Sparkles:', typeof Lucide.Sparkles);
    console.log('Compass:', typeof Lucide.Compass);
    console.log('HeartHandshake:', typeof Lucide.HeartHandshake);
    console.log('ShieldAlert:', typeof Lucide.ShieldAlert);
    console.log('Flame:', typeof Lucide.Flame);
    console.log('Sun:', typeof Lucide.Sun);
    console.log('Moon:', typeof Lucide.Moon);
    console.log('Award:', typeof Lucide.Award);
    
    console.log('--- APP TYPE ---');
    console.log('App default export:', typeof App);
  });
});
