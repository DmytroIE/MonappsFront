// https://medium.com/@parkpoom.wiss/adding-a-vertical-line-plugin-to-a-scatter-plot-in-chart-js-v-acb19c8b3a60
import { Chart } from 'chart.js';

//let counter = 0;

const verticalLinePlugin = {
    id: "verticalline",

    // TODO: this function is executed too many times
    afterDraw: function (chart, args, options) {
        // console.log("afterDraw---");
        // console.log(chart);
        // it can be an outcome of the dataset structure where [timestamp, value] for each point 
        const lineDataSets = chart.config._config.options.plugins?.verticalline?.lineDataSets;
        // console.log("afterDraw---");
        // console.log(chart);
        // console.log(lineDataSets);

        if (!lineDataSets) {
            return;
        }

        var xScale = chart.scales['x'];
        var yScale = chart.scales['y'];

        for (const lineData of lineDataSets) {
            const { pointIndex, strokeStyle = '#000000' } = lineData;
            // Get the x position of the x-value
            var xPos = xScale.getPixelForValue(pointIndex);

            // Draw the line
            chart.ctx.beginPath();
            chart.ctx.moveTo(xPos, yScale.bottom);
            chart.ctx.strokeStyle = strokeStyle;
            chart.ctx.lineTo(xPos, yScale.top);
            chart.ctx.stroke();
        }

    }
};

Chart.register(verticalLinePlugin);

export default verticalLinePlugin;



