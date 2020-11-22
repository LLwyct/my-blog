import React from 'react';
import { Grid, Container} from '@material-ui/core';


const PageNotFound: React.FunctionComponent = props => {
    return (
        <Container>
            <Grid item container justify="center">
                <Grid item>
                    <h1>T^T Page Not Found~</h1>
                </Grid>
            </Grid>
        </Container>
    )
}

export default PageNotFound;