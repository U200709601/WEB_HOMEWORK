import { Skeleton, Typography } from '@mui/material';
import { styled } from '@mui/system';
// ------------------------------------------------------------

const SkeletonStyle = styled(Skeleton)(({ theme }) => ({
    backgroundColor: theme.palette.primary.lighter,
}));

// ------------------------------------------------------------

export default function TableSkeleton() {
    return (
        [...Array(6)].map((item, i) => {
            return <Typography sx={{ mb: 1 }} variant="h2" key={`${i}-text`}>
                <SkeletonStyle key={`${i}-skeleton`} animation="wave" />
            </Typography>
        })
    );
}
