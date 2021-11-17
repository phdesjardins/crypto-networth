<script setup>
import {onMounted, ref} from 'vue'
import ApexCharts from "apexcharts"
import {netWorthTimeSeries} from "../store";

window.ApexCharts = ApexCharts;

const mainChart = ref()

onMounted(() => {
  const ppfdOptions = {
    series: [{type: 'line', data: netWorthTimeSeries.value}],
    chart: {
      id: 'net-worth-chart',
      height: '100%',
      width: '100%'
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false
      }
    },
    yaxis: {
      title: {
        text: 'Net worth'
      },
      labels: {
        formatter: function (value) {
          const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'CAD'
          });
          return formatter.format(value)
        }
      }
    },
    tooltip: {
      x: {format: 'dd/MM/yyyy HH:mm'},
      y: {
        formatter: function(value) {
          const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'CAD'
          });
          return `${formatter.format(value)}$`
        }
      }
    },
  }
  mainChart.value = new ApexCharts(document.querySelector("#net-worth-chart"), ppfdOptions);
  mainChart.value.render();
})

</script>

<template>
  <div id="net-worth-chart"></div>
</template>

<style scoped>

</style>
