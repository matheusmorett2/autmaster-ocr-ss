import React, { Component } from 'react'
import createPalette from '@material-ui/core/styles/createPalette';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import createBrowserHistory from 'history/createBrowserHistory';
import { Router, Route } from 'react-router-dom';
import RouterComp from './router';

const history = createBrowserHistory({});

const theme = createMuiTheme({
    typography: {
        fontFamily: '"Roboto", serif',
    },
    overrides: {
        MuiTypography: {
            title: {
                fontWeight: 700,
                fontSize: '18px'
            }
        },
        MuiButton: {
            //overrides all button css flat and raised
            root: {
                margin: '5px'
            }
        },
    },
    palette: createPalette({
        primary: {
            light: '#a0a0a0',
            main: '#00938d',
            dark: '#000000',
            contrastText: '#ffffff',
        },
        secondary: {
            light: '#ff5ca1',
            main: '#f50673',
            dark: '#bc0048',
            contrastText: '#ffffff',
        },
        error: {
            main: '#ff4400',
        },
        textSecondary: {
            main: '#cccccc',
        },
    })
});

class index extends Component {

    componentWillMount() {
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Router history={history}>
                    <Route component={RouterComp} />
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default index;