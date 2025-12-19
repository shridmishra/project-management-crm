import themeReducer, { toggleTheme, setTheme, loadTheme } from './themeSlice';

describe('themeSlice', () => {
    const initialState = { theme: 'light' };

    beforeEach(() => {
        // Clear localStorage and classList before each test
        localStorage.clear();
        document.documentElement.classList.remove('dark');
    });

    it('should handle initial state', () => {
        expect(themeReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle toggleTheme', () => {
        const actual = themeReducer(initialState, toggleTheme());
        expect(actual.theme).toEqual('dark');
        expect(localStorage.getItem('theme')).toEqual('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);

        const next = themeReducer(actual, toggleTheme());
        expect(next.theme).toEqual('light');
        expect(localStorage.getItem('theme')).toEqual('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should handle setTheme', () => {
        const actual = themeReducer(initialState, setTheme('dark'));
        expect(actual.theme).toEqual('dark');
    });

    it('should handle loadTheme', () => {
        localStorage.setItem('theme', 'dark');
        const actual = themeReducer(initialState, loadTheme());
        expect(actual.theme).toEqual('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
});
