import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function SkeletonLoader(props) {
    const iterationArray = Array.from({ length: props.count }, (_, index) => index + 1);
    return (
        // <Box sx={{ width: "100%" }}>
        <>
            {iterationArray.map((iteration) => (
                <Skeleton key={iteration} height={props.height} width={props.width} />
            ))}
            {/* <Grid container spacing={8}>
                <Grid item xs>
                    <Skeleton height={props.height} width={200} />
                </Grid>
                <Grid item xs>
                    <Skeleton height={props.height} width={200} />
                </Grid>
                <Grid item xs>
                    <Skeleton height={props.height} width={200} />
                </Grid>
                <Grid item xs>
                    <Skeleton height={props.height} width={200} />
                </Grid>
            </Grid> */}
        </>
        // </Box>
    );
}