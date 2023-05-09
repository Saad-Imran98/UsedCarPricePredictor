import React from "react";
import {createRoot} from 'react-dom/client';
import ResponsiveAppBar from "./Nav";
import {Grid, Paper} from '@mui/material'
import {deepOrange, grey} from '@mui/material/colors'
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CarForm from "./CarForm";
import {CarProvider} from "../context/CarContext";
import "../styles/waves.css"
import background from "../styles/back.svg"

let palette = {
    primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
    },
    secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
    },
}

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // palette values for light mode
                primary: deepOrange,
                divider: deepOrange,
                text: {
                    primary: grey[900],
                    secondary: grey[800],
                },
                background: {
                    default: '#001220',
                    paper: 'rgba(250,250,250,0.98)',
                }
            }
            : {
                // palette values for dark mode
                primary: deepOrange,
                divider: deepOrange[900],
                background: {
                    default: '#001220',
                    paper: palette.secondary.light
                },
                text: {
                    primary: palette.primary.dark,
                    secondary: palette.secondary.dark,
                },

            }),
    },
});

const lightModeTheme = createTheme(getDesignTokens('light'));
const darkModeTheme = createTheme(getDesignTokens('dark'));

/**
 * Main app component.
 * @returns {JSX.Element}
 * @constructor
 */
export default function App() {

    return (
        <div className="App" style={{backgroundImage: `url(${background})`}}>
            <ThemeProvider theme={lightModeTheme}>
                <CssBaseline/>
                <CarProvider>
                    <ResponsiveAppBar/>
                    <Grid container spacing={0}>
                        <Grid item xs={0.5} sm={2} md={3}></Grid>
                        <Grid item xs={11} sm={8} md={6}>
                            <Paper elevation={24} style={{height: "100%", padding: "15px", marginTop: "5%"}}>
                                <CarForm/>
                            </Paper>
                        </Grid>
                        <Grid item xs={0.5} sm={2} md={3}></Grid>
                    </Grid>
                </CarProvider>
            </ThemeProvider>
        </div>
    )
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App/>);
