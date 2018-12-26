import React, { Component } from 'react'
import Main from 'layouts/main'
import ReactCrop from 'react-image-crop';
import { storage } from './../../firebase';
import axios from 'axios';
import TemplateTable from './TemplateTable';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'

// css
import 'react-image-crop/dist/ReactCrop.css';
import { Grid } from '@material-ui/core';

export default class index extends Component {
    render() {
        return (
            <Main title="Templates">
                <Grid container wrap="nowrap">
                    <Grid item container>
                        <Typography variant="h4" gutterBottom component="h2">
                            Templates
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Link to="template/create">
                            <Button variant="contained" color="primary">
                                Criar
                            </Button> 
                        </Link>
                    </Grid>
                </Grid>
                <TemplateTable />
            </Main>
        )
    }
}
