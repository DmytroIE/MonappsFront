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

import { createDfChartData } from "../../utils/chartUtils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    TimeScale
);


function DfChartTab({ id }) {

    const selNodeReadings = useSelector((state) => state.tree.selNodeReadings);
    const nodeData = useSelector((state) => state.tree.nodes[id]);
    const readingsLoadingState = useSelector((state) => state.tree.selNodeReadingsLoadingState);
    //console.log("DfChartTab");
    //console.log(selNodeReadings);
    //console.log(readingsLoadingState);

    if (readingsLoadingState === 'pending') {
        return <CircularProgress />;
    } else {
        const colorObj = { r: 255, g: 99, b: 132 };
        const chartData = createDfChartData(selNodeReadings[id], nodeData, colorObj);
        //console.log(chartData);
        if (chartData.datasets.length === 0) {
            return <Typography variant='h3' sx={{ textAlign: "center" }}>No data or data is corrupted</Typography>;
        }

        //console.log(chartData.maxTs);
        const numOfMinutes = Math.floor((chartData.maxTs - chartData.minTs) / 60000);
        const canvaswidth = numOfMinutes > 25 ? numOfMinutes * 40 : 1000;

        return (
            <Box sx={{ overflow: "auto", width: 1000, margin: "auto" }}>
                <Box sx={{ height: 500, width: canvaswidth }}>
                    <Line data={chartData} options={{
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
                        },
                        scales: {
                            x: {
                                type: "time",
                                //parsing: false,
                                //source: 'labels',
                                time: {
                                    unit: 'minute', // the timestamps with the resolution of 'time.unit' will be passed into 'ticks.callback'
                                },
                                ticks: {
                                    callback: function (val) {
                                        // 'val' will be a multiple of 'time.unit'
                                        if (val % 120000 === 0) {
                                            const timeStr = (new Date(val)).toLocaleTimeString();
                                            if (val % 600000 === 0) {
                                                return timeStr;
                                            }
                                            return (timeStr.split(":").slice(1)).join(":");
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

export default DfChartTab;


