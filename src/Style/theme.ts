'use client';
import { createTheme } from '@mui/material/styles';
import GlobalColors from "./GlobalColors";

// Create a theme instance using our color system
const theme = createTheme({
    cssVariables: true,
    typography: {
        fontFamily: 'var(--font-roboto)',
        // Define typography variants to use Roboto consistently
        h1: { fontFamily: 'var(--font-roboto)' },
        h2: { fontFamily: 'var(--font-roboto)' },
        h3: { fontFamily: 'var(--font-roboto)' },
        h4: { fontFamily: 'var(--font-roboto)' },
        h5: { fontFamily: 'var(--font-roboto)' },
        h6: { fontFamily: 'var(--font-roboto)' },
        subtitle1: { fontFamily: 'var(--font-roboto)' },
        subtitle2: { fontFamily: 'var(--font-roboto)' },
        body1: { fontFamily: 'var(--font-roboto)' },
        body2: { fontFamily: 'var(--font-roboto)' },
        button: { fontFamily: 'var(--font-roboto)' },
        caption: { fontFamily: 'var(--font-roboto)' },
        overline: { fontFamily: 'var(--font-roboto)' },
    },
    palette: {
        primary: {
            main: GlobalColors.primary[500],
            light: GlobalColors.primary[300],
            dark: GlobalColors.primary[700],
            contrastText: GlobalColors.common.white,
        },
        secondary: {
            main: GlobalColors.secondary[500],
            light: GlobalColors.secondary[300],
            dark: GlobalColors.secondary[700],
            contrastText: GlobalColors.common.white,
        },
        error: {
            main: GlobalColors.error[500],
            light: GlobalColors.error[300],
            dark: GlobalColors.error[700],
            contrastText: GlobalColors.common.white,
        },
        warning: {
            main: GlobalColors.warning[500],
            light: GlobalColors.warning[300],
            dark: GlobalColors.warning[700],
            contrastText: GlobalColors.common.white,
        },
        info: {
            main: GlobalColors.info[500],
            light: GlobalColors.info[300],
            dark: GlobalColors.info[700],
            contrastText: GlobalColors.common.white,
        },
        success: {
            main: GlobalColors.success[500],
            light: GlobalColors.success[300],
            dark: GlobalColors.success[700],
            contrastText: GlobalColors.common.white,
        },
        grey: {
            50: GlobalColors.gray[50],
            100: GlobalColors.gray[100],
            200: GlobalColors.gray[200],
            300: GlobalColors.gray[300],
            400: GlobalColors.gray[400],
            500: GlobalColors.gray[500],
            600: GlobalColors.gray[600],
            700: GlobalColors.gray[700],
            800: GlobalColors.gray[800],
            900: GlobalColors.gray[900],
            A100: GlobalColors.gray[100],
            A200: GlobalColors.gray[200],
            A400: GlobalColors.gray[400],
            A700: GlobalColors.gray[700],
        },
        // Optional dark mode support
        // mode: 'dark' as PaletteMode,
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: false,
            },
        },
        // You can customize other components here
    },
});

export default theme;