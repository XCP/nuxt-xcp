<template>
  <div class="flex flex-col bg-gray-800 text-white p-4">
    <!-- Responsive container for title and buttons -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-4 w-full">
      <!-- Title -->
      <h2 class="text-xl font-semibold">{{ title }}</h2>

      <!-- Control Buttons -->
      <div class="flex mt-4 md:mt-0">
        <button
          v-for="period in ['day', 'week', 'month', 'year']"
          :key="period"
          @click="changePeriod(period)"
          :class="{
            'bg-gray-700 hover:bg-gray-600': currentPeriodType !== period,
            'bg-red-500 hover:bg-red-400': currentPeriodType === period,
          }"
          class="text-sm px-4 py-2 mx-1 rounded focus:outline-none focus:ring"
        >
          {{ period.charAt(0).toUpperCase() + period.slice(1) }}
        </button>
      </div>
    </div>

    <!-- Chart Canvas -->
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Chart } from 'chart.js';

const props = defineProps({
  metric_type: { type: String, required: true },
  title: { type: String, required: true }
});

const currentPeriodType = ref('day');
const chartRef = ref(null);
let myChart = null;

const fetchData = async (metricType, periodType) => {
  const url = `https://api.xcp.io/api/metrics?period_type=${periodType}&metric_type=${metricType}`;

  try {
    const response = await fetch(url);
    const { labels, datasets } = await response.json();

    console.log(labels, datasets); // Check the data received from the API

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

const changePeriod = (period) => {
  currentPeriodType.value = period;
  fetchData(props.metric_type, period);
};

onMounted(() => {
  fetchData(props.metric_type, currentPeriodType.value);
});

watch(currentPeriodType, (newPeriodType) => {
  fetchData(props.metric_type, newPeriodType);
}, { immediate: true });

</script>
