<template>
    <div>
      <div ref="buttonsContainer" class="buttons-container">
        <button v-for="interval in intervals" :key="interval" @click="setChartInterval(interval)">
          {{ interval }}
        </button>
      </div>
      <div ref="chartContainer" class="chart-container"></div>
      <div ref="tooltip" class="tooltip"></div>
    </div>
  </template>
  
  <script setup>
  import {
    ref,
    onMounted,
    onUnmounted,
    watch,
    defineExpose,
    defineProps,
  } from 'vue';
  import { createChart } from 'lightweight-charts';
  
  const props = defineProps({
    pairName: {
      type: String,
      required: true,
    },
    initialInterval: {
      type: String,
      default: '1D',
    },
    autosize: {
      default: true,
      type: Boolean,
    },
    chartOptions: {
      type: Object,
    },
    seriesOptions: {
      type: Object,
    },
    timeScaleOptions: {
      type: Object,
    },
    priceScaleOptions: {
      type: Object,
    },
    volumeSeriesOptions: {
      type: Object,
    },
  });
  
  const intervals = ['1d', '1w', '1m', '1y'];
  
  let candlestickSeries;
  let volumeSeries;
  let chart;
  
  const chartContainer = ref();
  const buttonsContainer = ref();
  const tooltip = ref();
  
  const fitContent = () => {
    if (!chart) return;
    chart.timeScale().fitContent();
  };
  
  const getChart = () => {
    return chart;
  };
  
  defineExpose({ fitContent, getChart });
  
  // Auto resizes the chart when the browser window is resized.
  const resizeHandler = () => {
    if (!chart || !chartContainer.value) return;
    const dimensions = chartContainer.value.getBoundingClientRect();
    chart.resize(dimensions.width, dimensions.height);
  };
  
  // Fetch OHLC data from API
  const fetchData = async (pairName, interval) => {
    try {
      const response = await fetch(`http://app.xcp.io.test/api/v1/ohlc/${pairName}?interval=${interval}`);
      const data = await response.json();
      if (!Array.isArray(data.data)) {
        throw new Error('API response data is not an array');
      }
      return data.data;
    } catch (error) {
      console.error('Error fetching OHLC data:', error);
      return [];
    }
  };
  
  // Creates the chart series and sets the data.
  const addSeriesAndData = (data, type, seriesOptions, volumeSeriesOptions) => {
    const seriesConstructor = `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`;
    candlestickSeries = chart[seriesConstructor](seriesOptions);
  
    const formattedData = data.map(item => {
      if (item.ohlc_data && item.ohlc_data.length > 0) {
        const ohlc = item.ohlc_data[0];
        return {
          open: parseFloat(ohlc.open),
          high: parseFloat(ohlc.high),
          low: parseFloat(ohlc.low),
          close: parseFloat(ohlc.close),
          time: item.timestamp,
        };
      } else {
        return {
          time: item.timestamp,
        };
      }
    });
  
    candlestickSeries.setData(formattedData);
  
    const volumeData = data.map(item => {
      if (item.ohlc_data && item.ohlc_data.length > 0) {
        const ohlc = item.ohlc_data[0];
        const color = parseFloat(ohlc.close) >= parseFloat(ohlc.open) ? '#26a69a' : '#ef5350';
        return {
          value: parseFloat(ohlc.volume),
          time: item.timestamp,
          color
        };
      } else {
        return {
          time: item.timestamp,
          value: 0
        };
      }
    });
  
    volumeSeries = chart.addHistogramSeries(volumeSeriesOptions);
    volumeSeries.setData(volumeData);
  };
  
  const setChartInterval = async (interval) => {
    const rawData = await fetchData(props.pairName, interval);
    const formattedData = rawData.map(item => {
      if (item.ohlc_data && item.ohlc_data.length > 0) {
        const ohlc = item.ohlc_data[0];
        return {
          open: parseFloat(ohlc.open),
          high: parseFloat(ohlc.high),
          low: parseFloat(ohlc.low),
          close: parseFloat(ohlc.close),
          time: item.timestamp,
        };
      } else {
        return {
          time: item.timestamp,
        };
      }
    });
  
    const volumeData = rawData.map(item => {
      if (item.ohlc_data && item.ohlc_data.length > 0) {
        const ohlc = item.ohlc_data[0];
        const color = parseFloat(ohlc.close) >= parseFloat(ohlc.open) ? '#26a69a' : '#ef5350';
        return {
          value: parseFloat(ohlc.volume),
          time: item.timestamp,
          color
        };
      } else {
        return {
          time: item.timestamp,
          value: 0
        };
      }
    });
  
    candlestickSeries.setData(formattedData);
    volumeSeries.setData(volumeData);
    chart.timeScale().fitContent();
  };
  
  onMounted(async () => {
    // Fetch data
    const rawData = await fetchData(props.pairName, props.initialInterval);
  
    // Create the Lightweight Charts Instance using the container ref.
    chart = createChart(chartContainer.value, props.chartOptions);
    addSeriesAndData(rawData, 'candlestick', props.seriesOptions, props.volumeSeriesOptions);
  
    if (props.priceScaleOptions) {
      chart.priceScale().applyOptions(props.priceScaleOptions);
    }
  
    if (props.timeScaleOptions) {
      chart.timeScale().applyOptions(props.timeScaleOptions);
    }
  
    candlestickSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.3,
      },
    });
  
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
    });
  
    chart.timeScale().fitContent();
  
    chart.subscribeCrosshairMove(param => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > chartContainer.value.clientWidth ||
        param.point.y < 0 ||
        param.point.y > chartContainer.value.clientHeight
      ) {
        tooltip.value.style.display = 'none';
      } else {
        const dateStr = new Date(param.time * 1000).toLocaleDateString();
        tooltip.value.style.display = 'block';
        const ohlc = param.seriesData.get(candlestickSeries);
        const price = ohlc.close !== undefined ? ohlc.close : ohlc.value;
        tooltip.value.innerHTML = `<div style="color: ${props.seriesOptions.upColor}">Price</div><div style="font-size: 24px; margin: 4px 0px; color: black;">
            ${price}
            </div><div style="color: black;">
            ${dateStr}
            </div>`;
  
        const y = param.point.y;
        let left = param.point.x + 15;
        if (left > chartContainer.value.clientWidth - 80) {
          left = param.point.x - 95;
        }
  
        let top = y + 15;
        if (top > chartContainer.value.clientHeight - 80) {
          top = y - 95;
        }
        tooltip.value.style.left = left + 'px';
        tooltip.value.style.top = top + 'px';
      }
    });
  
    if (props.autosize) {
      window.addEventListener('resize', resizeHandler);
    }
  });
  
  onUnmounted(() => {
    if (chart) {
      chart.remove();
      chart = null;
    }
    if (candlestickSeries) {
      candlestickSeries = null;
    }
    if (volumeSeries) {
      volumeSeries = null;
    }
    window.removeEventListener('resize', resizeHandler);
  });
  
  watch(
    () => props.autosize,
    enabled => {
      if (!enabled) {
        window.removeEventListener('resize', resizeHandler);
        return;
      }
      window.addEventListener('resize', resizeHandler);
    }
  );
  
  watch(
    () => props.pairName,
    async (newPairName) => {
      const rawData = await fetchData(newPairName, props.initialInterval);
      const formattedData = rawData.map(item => {
        if (item.ohlc_data && item.ohlc_data.length > 0) {
          const ohlc = item.ohlc_data[0];
          return {
            open: ohlc.open,
            high: ohlc.high,
            low: ohlc.low,
            close: ohlc.close,
            time: item.timestamp,
          };
        } else {
          return {
            time: item.timestamp,
          };
        }
      });
  
      const volumeData = rawData.map(item => {
        if (item.ohlc_data && item.ohlc_data.length > 0) {
          const ohlc = item.ohlc_data[0];
          const color = parseFloat(ohlc.close) >= parseFloat(ohlc.open) ? '#26a69a' : '#ef5350';
          return {
            value: ohlc.volume,
            time: item.timestamp,
            color
          };
        } else {
          return {
            time: item.timestamp,
            value: 0
          };
        }
      });
  
      candlestickSeries.setData(formattedData);
      volumeSeries.setData(volumeData);
      chart.timeScale().fitContent();
    }
  );
  
  watch(
    () => props.chartOptions,
    newOptions => {
      if (!chart) return;
      chart.applyOptions(newOptions);
    }
  );
  
  watch(
    () => props.seriesOptions,
    newOptions => {
      if (!candlestickSeries) return;
      candlestickSeries.applyOptions(newOptions);
    }
  );
  
  watch(
    () => props.priceScaleOptions,
    newOptions => {
      if (!chart) return;
      chart.priceScale().applyOptions(newOptions);
    }
  );
  
  watch(
    () => props.timeScaleOptions,
    newOptions => {
      if (!chart) return;
      chart.timeScale().applyOptions(newOptions);
    }
  );
  </script>
  
  <style scoped>
  .chart-container {
    height: 500px;
    position: relative;
  }
  
  .buttons-container {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
  
  .buttons-container button {
    margin: 0 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  
  .tooltip {
    width: 96px;
    height: 80px;
    position: absolute;
    display: none;
    padding: 8px;
    box-sizing: border-box;
    font-size: 12px;
    text-align: left;
    z-index: 1000;
    top: 12px;
    left: 12px;
    pointer-events: none;
    border: 1px solid;
    border-radius: 2px;
    font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: white;
    color: black;
    border-color: rgba(38, 166, 154, 1);
  }
  </style>
  