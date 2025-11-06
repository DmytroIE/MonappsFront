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

import { createDsChartData, getTimeUnitAndDivider } from "../../utils/chartUtils";
import { dtFormatter } from "../../utils/timeUtils";


ChartJS.register(annotationPlugin);

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


function DsChartTab({ id, quantTime, readingInfos, setDtRange }) {
    const nodeData = useSelector((state) => state.tree.nodes[id]);
    const readingsLoadingState = useSelector((state) => state.tree.selNodeReadingsLoadingState);

    if (readingsLoadingState === 'pending') {
        return <CircularProgress />;
    }
    else {
        const readingMaps = {};
        for (const indInfo of readingInfos) {
            if (indInfo.id !== id) {
                continue;
            }
            readingMaps[indInfo.readingType] = indInfo.readings;
        }
        const chartData = createDsChartData(readingMaps, nodeData, quantTime * 5, quantTime, (newRange) => setDtRange(newRange));

        if (chartData.datasets.length === 0) {
            return <Typography variant='h3' sx={{ textAlign: "center", height: "500px", border: "1px solid red" }}>No data or data is corrupted</Typography>;
        }

        const data = { datasets: chartData.datasets };
        const annotations = chartData.annotations;
        const { startTs, endTs } = chartData; // These startTs and endTs are different from those adjusted by the dtSlider

        if (startTs > endTs) {
            return <Typography variant='h3' sx={{ textAlign: "center", height: "500px", border: "1px solid red" }}>No data in the selected range</Typography>;
        }

        let deltaTime = endTs - startTs;

        const { timeUnit, timeDivider } = getTimeUnitAndDivider(deltaTime, startTs, endTs);

        if (deltaTime === 0) { // a single reading to show
            deltaTime = 250000; // just to get some space around the point, it will be multiplied by 0.01 later
        }

        return (
            <Box sx={{ overflow: "auto", width: 1000, margin: "auto" }}>
                <Box sx={{ height: 500 }}>
                    <Line data={data} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'right',
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
                                    unit: timeUnit, // the timestamps with the resolution of 'time.unit' will be passed into 'ticks.callback'
                                },
                                min: startTs - Math.round(deltaTime * 0.01),    // Add explicit bounds
                                max: endTs + Math.round(deltaTime * 0.01),      // Add explicit bounds
                                ticks: {
                                    callback: function (val) {
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
                                    callback: function (val) { if (val % 1 === 0) { return val; } }
                                }
                            }
                        },
                    }}></Line>
                </Box>
            </Box>
        );
    }
}

export default DsChartTab;
