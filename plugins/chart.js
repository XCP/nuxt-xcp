import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement } from 'chart.js';

export default defineNuxtPlugin(() => {
    Chart.register(
        CategoryScale,
        LinearScale,
        BarElement,
        LineController, // Register LineController for line charts
        LineElement,    // Needed for drawing lines
        PointElement,   // Needed for drawing points on the line
        Title,
        Tooltip,
        Legend
    );
});
