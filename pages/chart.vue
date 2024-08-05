<template>
  <div>
    <h1>OHLC Chart for {{ pairName }}</h1>
    <CandleStickChart :pairName="pairName" initialInterval="1m" :chartOptions="chartOptions" :seriesOptions="seriesOptions" :volumeSeriesOptions="volumeSeriesOptions" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const pairName = ref('XCP_BTC');

const chartOptions = ref({
    layout: {
        textColor: 'black',
        background: { type: 'solid', color: 'white' },
    },
    rightPriceScale: {
        borderVisible: false,
    },
});

const seriesOptions = ref({
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
});

const volumeSeriesOptions = ref({
    color: '#26a69a',
    priceFormat: {
        type: 'volume',
    },
    priceScaleId: '', // set as an overlay by setting a blank priceScaleId
    scaleMargins: {
        top: 0.7,
        bottom: 0,
    },
});
</script>
