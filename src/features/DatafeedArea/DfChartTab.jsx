import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';

import { createDfChartData, getTimeUnitAndDivider } from "../../utils/chartUtils";
import { dtFormatter } from "../../utils/timeUtils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    TimeScale,
    annotationPlugin
);


const DfChartTab = ({ id, timeResample, readingInfo }) => {

    const nodeData = useSelector((state) => state.tree.nodes[id]);
    const readingsLoadingState = useSelector((state) => state.tree.selNodeReadingsLoadingState);

    if (readingsLoadingState === 'pending') {
        return <CircularProgress />;
    } else {
        const colorObj = { r: 255, g: 99, b: 132 };

        const chartData = createDfChartData(readingInfo, timeResample, nodeData, colorObj);

        if (chartData.datasets.length === 0) {
            return (
                <Typography variant='h3' sx={{ textAlign: "center", height: "400px" }}>
                    No data
                </Typography>);
        }

        const data = { datasets: chartData.datasets };
        const annotations = chartData.annotations;
        const { startTs, endTs } = chartData; // These startTs and endTs are different from those adjusted by the dtSlider

        if (startTs > endTs) {
            return (
                <Typography variant='h3' sx={{ textAlign: "center", height: "400px" }}>
                    No data in the selected range
                </Typography>
            );
        }

        let deltaTime = endTs - startTs;

        const { timeUnit, timeDivider } = getTimeUnitAndDivider(deltaTime, startTs, endTs);

        if (deltaTime === 0) { // a single reading to show
            deltaTime = 250000; // just to get some space around the point, it will be multiplied by 0.01 later
        }

        return (
            <Box sx={{ height: 400 }}>
                <Line data={data} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'circle',
                                pointRadius: 5
                            },
                        },
                        title: {
                            display: false,
                            text: 'Readings',
                        },
                        annotation: {
                            annotations,
                        }
                    },
                    scales: {
                        x: {
                            type: "time",
                            time: {
                                unit: timeUnit,
                            },
                            min: startTs - timeResample,    // Add explicit bounds
                            max: endTs + timeResample,
                            ticks: {
                                callback: (val) => {
                                    const date = new Date(val);
                                    const dateTimeStr = dtFormatter.format(date);
                                    if (val % timeDivider === 0) {
                                        if (val % 3600000 === 0) {
                                            return dateTimeStr.split(" ")[1];
                                        }
                                        else if (val % 86400000 === 0) {
                                            return dateTimeStr.split(" ")[0];
                                        }
                                        else {
                                            return dateTimeStr.split(":").slice(1).join(":");
                                        }
                                    }
                                    return null;
                                }
                            }
                        },
                        y: {
                            ticks: {
                                callback: (val) => {
                                    if (val % 1 === 0) {
                                        return val;
                                    }
                                }
                            }
                        }
                    },
                }}></Line>
            </Box>
        );
    }
}

export default DfChartTab;


