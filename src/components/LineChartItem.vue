<script setup>
import {onMounted, ref} from 'vue'
import ApexCharts from "apexcharts"
import {netWorthTimeSeries} from "../store";

window.ApexCharts = ApexCharts;

const mainChart = ref()
const barChart = ref()

onMounted(() => {
  const options1 = {
    chart: {
      id: 'net-worth-chart',
      type: 'line',
      height: '75%',
      width: '100%',
      toolbar: {
        autoSelected: undefined,
        tools: {
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        },
        show: false,
      }
    },
    stroke: {
      curve: 'smooth',
      width: 5,
    },
    series: [{name: 'Net worth', data: netWorthTimeSeries.value}],
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
          return formatter.format(value).slice(0, -3)
        }
      }
    },
    tooltip: {
      x: {
        show: false,
        format: 'dd/MM/yyyy HH:mm'
      },
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

  const options2 = {
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    chart: {
      id: 'net-worth-bar',
      type: "area",
      height: '25%',
      width: '100%',
      brush: {
        enabled: true,
        target: "net-worth-chart"
      },
      selection: {
        enabled: true,
        xaxis: {
          min: netWorthTimeSeries.value.at(-100).x,
          max: netWorthTimeSeries.value.at(-1).x
        },
        animations: {
          enabled: false
        }
      }
    },
    series: [{data: netWorthTimeSeries.value}],
    xaxis: {
      type: 'datetime',
      tooltip: {
        enabled: false
      },
      labels: {
        datetimeUTC: false
      }
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        formatter: function (value) {
          const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'CAD'
          });
          return formatter.format(value).slice(0, -3)
        }
      }
    }
  }


  mainChart.value = new ApexCharts(document.querySelector("#net-worth-chart"), options1);
  barChart.value = new ApexCharts(document.querySelector("#net-worth-bar"), options2);
  mainChart.value.render();
  barChart.value.render();
})

</script>

<template>
  <div id="net-worth-chart"></div>
  <div id="net-worth-bar"></div>
</template>

<style scoped>

</style>
