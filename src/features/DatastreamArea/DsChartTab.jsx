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

import { createDsChartData } from "../../utils/chartUtils";
import verticalLinePlugin from '../../utils/verticalLinePlugin';


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
);


function DsChartTab({ id }) {

    const selNodeReadings = useSelector((state) => state.tree.selNodeReadings);
    const nodeData = useSelector((state) => state.tree.nodes[id]);
    const readingsLoadingState = useSelector((state) => state.tree.selNodeReadingsLoadingState);
    //console.log("DsChartTab");
    //console.log(selTreeItemReadings);

    if (readingsLoadingState === 'pending') {
        return <CircularProgress />;
    } 
    else if (selNodeReadings[id] === undefined) {
        if (readingsLoadingState === 'error') {
            return <Typography variant='h3' sx={{ textAlign: "center" }}>Data fetch failed</Typography>;
        }
        else {
            return <Typography variant='h3' sx={{ textAlign: "center" }}>No data or data is corrupted</Typography>;
        }
    }
    else {
        const colorObj = { r: 35, g: 99, b: 132 };

        const chartData = createDsChartData(selNodeReadings[id], nodeData, colorObj);
        // const labels = chartData.labels;
        //console.log(chartData);
        if (chartData.datasets.length === 0) {
            return <Typography variant='h3' sx={{ textAlign: "center" }}>No data or data is corrupted</Typography>;
        }

        const data = { datasets: chartData.datasets };
        const ndMarkerSets = chartData.ndMarkerSets;

        const numOfMinutes = Math.floor((chartData.maxTs - chartData.minTs) / 60000);
        const canvaswidth = numOfMinutes > 50 ? numOfMinutes * 20 : 1000;
        //console.log("before drawing a chart");
        //console.log(data);
        // console.log("!!!!!!!!!!!!!!!ndMarkerSets");
        // console.log(ndMarkerSets);
        return (
            <Box sx={{ overflow: "auto", width: 1000, margin: "auto" }}>
                <Box sx={{ height: 500, width: canvaswidth }}>
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
                            verticalline: {
                                lineDataSets: ndMarkerSets,
                            }
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

export default DsChartTab;
