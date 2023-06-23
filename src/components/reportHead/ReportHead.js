import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import { Box, Paper, Grid, Typography } from '@mui/material';


const BoxStyle = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.common.black,
    backgroundColor: theme.palette.secondary.main,
    width: "100%",
    flexGrow: 1,
    borderRadius: 10,
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'center',
    overflow: 'hidden',
}));

const ItemTitle = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    backgroundColor: theme.palette.secondary.main,
}));

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
}));

const ItemTotal = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
}));

const itemPropType = PropTypes.shape({
    icon: PropTypes.oneOf([PropTypes.string, PropTypes.node]).isRequired,
    count: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
});

ReportHead.propTypes = {
    item1: itemPropType,
    item2: itemPropType,
    item3: itemPropType,
    totalUsage: itemPropType,
};


export default function ReportHead({ item1, item2, item3, totalUsage }) {
    const getItemJsx = (item, total = false) => {
        const ItemIcon = item.icon;
        const Component = total ? ItemTotal : Item;
        return (
            <Component sx={{ minWidth: 120, ml: 4, mr: 4 }}>
                <ItemIcon />
                <Typography variant="body1">{`${item.count} ${item.label}`}</Typography>
            </Component>
        );
    }

    return (
        <BoxStyle>
            <Grid sx={{ flexGrow: 1, alignItems: "center", pt: 1.5, pb: 1.5 }} container spacing={2}>
                <Grid item xs={3} md={2}>
                    <ItemTitle>
                        <Typography variant="h5">24 Hour Overview</Typography>
                    </ItemTitle>
                </Grid>
                <Grid item xs={4} md={2}>
                    {getItemJsx(item1)}
                </Grid>
                <Grid item xs={4} md={2}>
                    {getItemJsx(item2)}
                </Grid>
                <Grid item xs={4} md={2}>
                    {getItemJsx(item3)}
                </Grid>
                <Grid item xs={8} md={4}>
                    {getItemJsx(totalUsage, true)}
                </Grid>
            </Grid>
        </BoxStyle>
    );
}
