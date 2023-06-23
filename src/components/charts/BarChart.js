import PropTypes from 'prop-types';
import Chart from "react-apexcharts";
import { styled } from '@mui/system';
import { Box } from "@mui/material";
import palette from 'src/theme/palette';


const BoxStyle = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.secondary.darkmost,
    backgroundColor: theme.palette.primary.light,
    width: "100%",
    flexGrow: 1,
    borderRadius: 10,
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'center',
    overflow: 'hidden',
}));


BarChart.propTypes = {
    yAxisTitle: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.number),
    categories: PropTypes.arrayOf(PropTypes.string),
    chartHeight: PropTypes.number,
};

export default function BarChart({ yAxisTitle, data = [], categories = [], chartHeight = 500 }) {
    const series = [{
        name: yAxisTitle,
        data: data,
    }];

    const options = {
        chart: {
            height: chartHeight,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                columnWidth: '30%',
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: [palette.primary.lighter]
            }
        },
        stroke: {
            width: 3,
            colors: [palette.secondary.dark, palette.secondary.darker,]
        },
        states: {
            hover: {
                filter: {
                    type: 'lighten',
                    value: 0.04
                }
            },
            active: {
                filter: {
                    type: 'darken',
                    value: 0.88
                }
            }
        },
        fill: {
            opacity: 1,
            gradient: {
                type: 'vertical',
                shadeIntensity: 0,
                opacityFrom: 0.4,
                opacityTo: 0,
                stops: [0, 100]
            },
            colors: [palette.secondary.dark, palette.secondary.darker,]
        },
        grid: {
            row: {
                colors: [palette.primary.light, palette.primary.lighter]
            }
        },
        xaxis: {
            labels: {
                rotate: -45,
                style: {
                    colors: palette.common.white,
                    fontSize: '15px',
                    fontWeight: 400,
                },
            },
            categories: categories,
            tickPlacement: 'on',
            axisBorder: {
                color: palette.common.white
            },
            axisTicks: {
                color: palette.common.white
            }
        },
        yaxis: {
            title: {
                text: yAxisTitle,
                style: {
                    color: palette.common.white,
                    fontSize: "15px"
                }
            },
            labels: {
                style: {
                    colors: palette.common.white,
                    fontSize: '15px',
                    fontWeight: 400,
                },
            }
        },
    };

    return (
        <BoxStyle>
            <Chart
                options={options}
                series={series}
                height={chartHeight}
                type="bar"
            />
        </BoxStyle>
    );
}
