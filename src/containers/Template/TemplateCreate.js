import React, { Component } from 'react'
import Main from 'layouts/main'
import { withStyles } from '@material-ui/core/styles';
import ReactCrop from 'react-image-crop';
import { storage } from './../../firebase';
import axios from 'axios';
import TemplateTable from './TemplateTable';
import { Link } from 'react-router-dom'

//material-ui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

// css
import 'react-image-crop/dist/ReactCrop.css';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    container: {
        flexWrap: 'wrap',
        padding: '12px'
    },
    templateImg: {
        maxHeight: '500px',
        border: '1px solid black'
    },
    cropImg: {
        maxHeight: '250px',
        border: '1px solid black',
        marginBottom: '14px',
    }
});

const DESCRIPTION = 'description';
const APPLICATION = 'application';

class TemplateCreate extends Component {

    constructor(props) {
        super(props)

        this.state = {
            ocrResult: '',
            src: null,
            description: {
                crop: {
                    x: 0,
                    y: 0,
                },
                croppedUrl: ''
            },
            application: {
                crop: {
                    x: 0,
                    y: 0,
                },
                croppedUrl: ''
            }
        }

        this.recognizeImg = this.recognizeImg.bind(this)
    }

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result }),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    onImageLoaded = (image, pixelCrop) => {
        this.imageRef = image;

        // Make the library regenerate aspect crops if loading new images.
        const { description, application } = this.state;

        if (description.crop.aspect && description.crop.height && description.crop.width) {
            this.setState({
                description: {
                    crop: { ...description.crop, height: null },
                }
            });
        }

        if (application.crop.aspect && application.crop.height && application.crop.width) {
            this.setState({
                application: {
                    crop: { ...application.crop, height: null },
                }
            });
        }
    };

    onCropApplicationComplete = (crop, pixelCrop) => {
        this.setState({
            application: {
                ...this.state.application,
                loading: true
            }
        }, () => this.makeClientCrop(crop, pixelCrop, APPLICATION))
    };

    onCropDescriptionComplete = (crop, pixelCrop) => {
        this.setState({
            description: {
                ...this.state.description,
                loading: true
            }
        }, () => this.makeClientCrop(crop, pixelCrop, DESCRIPTION))

    };

    onCropApplicationChange = crop => {
        this.setState({
            application: {
                crop: crop,
            }
        });
    };

    onCropDescriptionChange = crop => {
        this.setState({
            description: {
                crop: crop
            }
        });
    };

    async makeClientCrop(crop, pixelCrop, typeCrop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImage = await this.getCroppedImg(
                this.imageRef,
                pixelCrop,
                Math.random().toString(36).substr(2, 9),
            );
            this.saveCroppedImage(croppedImage, typeCrop)
        }
    }

    getCroppedImg(image, pixelCrop, fileName) {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                blob.name = fileName;
                resolve(blob);
            }, 'image/jpeg');
        });
    }


    recognizeImg(image, typeCrop) {
        axios.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAlcOAZE9ezLzsraY7s4SluYj0KXXMCujY",
            {
                "requests": [
                    {
                        "image": {
                            "source": {
                                "imageUri": image
                            }
                        },
                        "features": [
                            {
                                "type": "TEXT_DETECTION"
                            }
                        ]
                    }
                ]
            }
        ).then((res) =>
            res
        ).then((res) => {
            this.setState({
                [typeCrop]: {
                    ...this.state[typeCrop],
                    text: res.data.responses[0].fullTextAnnotation.text,
                    loading: false
                }
            })
        }).catch((err) => console.log(err))

    }

    saveCroppedImage(image, typeCrop) {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on('state_changed',
            (snapshot) => {
                // progrss function ....
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                this.setState({ progress });
            },
            (error) => {
                // error function ....
                console.log(error);
            },
            () => {
                // complete function ....
                storage.ref('images').child(image.name).getDownloadURL().then(url => {
                    this.setState({
                        [typeCrop]: {
                            ...this.state[typeCrop],
                            croppedUrl: url
                        }
                    }, this.recognizeImg(url, typeCrop))
                })
            });
    }

    render() {
        const { description, application, src, text } = this.state;
        const { classes } = this.props;

        return (
            <Main title="Templates">
                <Grid container wrap="nowrap">
                    <Grid item container>
                        <Typography variant="h4" gutterBottom component="h2">
                            Criar template
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Link to="/template">
                            <Button color="primary">
                                Voltar
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
                <Paper className={classes.root}>
                    <div className={classes.container}>
                        <Typography variant="h6" gutterBottom component="h2">
                            Dados do Fornecedor
                        </Typography>
                        <TextField
                            label="Nome"
                            value={this.state.name}
                            margin="normal"
                        />
                    </div>
                </Paper>
                <Paper className={classes.root}>
                    <div className={classes.container}>
                        <Typography variant="h6" gutterBottom component="h2">
                            Dados do Template
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => { this.upload.click() }}>
                            Enviar template
                        </Button>
                        <div>
                            <input style={{
                                display: 'none'
                            }} type="file"
                                onChange={this.onSelectFile}
                                ref={(ref) => this.upload = ref}
                            />
                        </div>
                        {(src &&
                            <React.Fragment>
                                <Typography variant="h6" gutterBottom component="h2">
                                    Descrição
                                </Typography>
                                <Grid container item wrap="nowrap">
                                    <Grid item container>
                                        {src && (
                                            <ReactCrop
                                                src={src}
                                                crop={description.crop}
                                                onImageLoaded={this.onImageLoaded}
                                                onComplete={this.onCropDescriptionComplete}
                                                onChange={this.onCropDescriptionChange}
                                                className={classes.templateImg}
                                            />
                                        )}
                                    </Grid>
                                    <Grid item container justify='center' alignItems='center'>
                                        {(description.loading ?
                                            <CircularProgress />
                                            :
                                            <Grid container direction='column'>
                                                <Grid item container justify='center' alignItems='center'>
                                                    {description.croppedUrl && <img alt="Crop" src={description.croppedUrl} className={classes.cropImg} />}
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="caption" gutterBottom align='center'>
                                                        {description.text}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>


                                <Typography variant="h6" gutterBottom component="h2">
                                    Aplicação
                                </Typography>
                                <Grid container item wrap="nowrap">
                                    <Grid item container>
                                        {src && (
                                            <ReactCrop
                                                src={src}
                                                crop={application.crop}
                                                onImageLoaded={this.onImageLoaded}
                                                onComplete={this.onCropApplicationComplete}
                                                onChange={this.onCropApplicationChange}
                                                className={classes.templateImg}
                                            />
                                        )}
                                    </Grid>
                                    <Grid item container justify='center' alignItems='center'>
                                        {(application.loading) ?
                                            <CircularProgress />
                                            :
                                            <Grid container direction='column'>
                                                <Grid item container justify='center' alignItems='center'>
                                                    {application.croppedUrl && <img alt="Crop" src={application.croppedUrl} className={classes.cropImg} />}
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="caption" gutterBottom align='center'>
                                                        {application.text}
                                                    </Typography>
                                                </Grid>
                                            </Grid>   
                                        }
                                    </Grid>
                                </Grid>

                            </React.Fragment>
                        )}
                    </div>
                </Paper>
            </Main>
        )
    }
}

export default withStyles(styles)(TemplateCreate);