<template>
  <div class="flex flex-col rounded-2xl border border-gray-700 rounded bg-gray-800 text-white p-4">
    <!-- Responsive container for title and dropdown -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-4 w-full">
      <!-- Dropdown for selecting metric type -->
      <select v-model="selectedMetric" @change="changeMetricType" class="text-white bg-gray-800 font-medium rounded px-3 py-2 focus:outline-none md:w-auto w-full">
        <option value="messages" class="font-semibold">All Messages</option>
        <option value="xcp_dominance">% of Total (XCP)</option>
        <!-- Popular Metrics -->
        <optgroup label="Popular">
          <option v-for="(metric, index) in popularMetrics" :key="index" :value="metric">{{ snakeCaseToTitleCase(metric) }}</option>
        </optgroup>
        <!-- Remaining Metrics -->
        <optgroup label="Charts">
          <option v-for="(metric, index) in availableMetrics" :key="index" :value="metric">{{ snakeCaseToTitleCase(metric) }}</option>
        </optgroup>
      </select>

      <!-- Control Buttons -->
      <div class="flex mt-4 md:mt-0 md:w-auto w-full">
        <button
          v-for="period in ['day', 'week', 'month', 'year']"
          :key="period"
          @click="changePeriod(period)"
          :class="{
            'bg-white/10 hover:bg-white/20': currentPeriodType !== period,
            'bg-primary hover:bg-primary/80': currentPeriodType === period,
          }"
          class="text-sm px-4 py-2 mx-1 rounded focus:outline-none focus:ring w-full md:w-auto"
        >
          {{ period.charAt(0).toUpperCase() + period.slice(1) }}
        </button>
      </div>
    </div>

    <!-- Chart Canvas -->
    <div class="chart-container" ref="chartContainer">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Chart } from 'chart.js';

const { trackEvent } = useFathom();

const props = defineProps({
  title: { type: String, required: true }
});

const popularMetrics = [
  'sends', 'orders', 'issuances', 'dispensers',
];

const availableMetrics = [
  'issuances', 'sends', 'sweeps', 'orders', 'order_expirations',
  'order_matches', 'order_match_expirations', 'btcpays', 'cancels', 'dispensers',
  'dispenses', 'broadcasts', 'replace', 'rps', 'rps_expirations', 'rps_matches',
  'rps_match_expirations', 'rpsresolves', 'credits', 'debits', 'dividends',
  'destructions', 'dispenser_refills', 'burns', 'bets', 'bet_expirations',
  'bet_matches', 'bet_match_expirations', 'bet_match_resolutions'
];

availableMetrics.sort((a, b) => a.localeCompare(b));

const currentPeriodType = ref('day');
const selectedMetric = ref('messages');
const chartRef = ref(null);
let myChart = null;

const fetchData = async (metricType, periodType) => {
  const url = `https://api.xcp.io/api/metrics?period_type=${periodType}&metric_type=${metricType}`;

  try {
    const response = await fetch(url);
    const { labels, datasets } = await response.json();

    const responseColor = 'rgba(236, 21, 80, 0.5)'; // Using the color #ec1550 with 50% opacity
    datasets.forEach((dataset) => {
      dataset.borderColor = responseColor;
      dataset.backgroundColor = 'rgba(236, 21, 80, 0.2)'; // Lighter fill color with more transparency
      dataset.pointBorderColor = responseColor;
      dataset.pointBackgroundColor = responseColor;
      dataset.pointHoverBackgroundColor = 'rgba(236, 21, 80, 0.75)'; // Slightly less opaque when hovering
      dataset.pointHoverBorderColor = 'rgba(236, 21, 80, 1)'; // Solid color when hovering
    });

    if (myChart) {
      myChart.destroy();
      myChart = null;
    }

    const ctx = chartRef.value?.getContext('2d');
    if (ctx) {
      myChart = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
          maintainAspectRatio: false, // Allow the chart to adjust its aspect ratio
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)', // Lighten grid lines for dark mode
              },
              ticks: {
                color: '#fff', // White text for the x-axis
              }
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)', // Lighten grid lines for dark mode
              },
              ticks: {
                color: '#fff', // White text for the y-axis
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: '#fff', // White text for the legend
              }
            },
            tooltip: {
              titleColor: '#fff', // White text for the tooltip title
              bodyColor: '#fff',  // White text for the tooltip body
            }
          }
        },
      });
    }
  } catch (error) {
    console.error("Failed to fetch metrics or initialize chart:", error);
  }
};

function snakeCaseToTitleCase(str) {
  // Replace underscores with spaces
  let titleCase = str.replace(/_/g, ' ');
  
  // Capitalize the first letter of each word
  titleCase = titleCase.replace(/\b\w/g, match => match.toUpperCase());
  
  return titleCase;
}

const changePeriod = (period) => {
  trackEvent(`Period: ${period}`);
  currentPeriodType.value = period;
  fetchData(selectedMetric.value, period);
};

const changeMetricType = (event) => {
  trackEvent(`Metric: ${event.target.value}`);
  selectedMetric.value = event.target.value;
  fetchData(event.target.value, currentPeriodType.value);
};

onMounted(() => {
  fetchData(selectedMetric.value, currentPeriodType.value);
});

watch(currentPeriodType, (newPeriodType) => {
  fetchData(selectedMetric.value, newPeriodType);
}, { immediate: true });

watch(selectedMetric, (newMetric) => {
  fetchData(newMetric, currentPeriodType.value);
}, { immediate: true });

</script>

<style>
.chart-container {
  position: relative;
  height: 70vh; /* Adjust height as needed */
  width: 100%;
}
</style>