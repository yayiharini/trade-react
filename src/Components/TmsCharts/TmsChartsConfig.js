const commonConfig = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
  },
};

export const barChartConfig = {
  ...commonConfig,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  maintainAspectRatio: false,
};

export const pieChartConfig = {
  ...commonConfig,
  maintainAspectRatio: false,
};

export const lineChartConfig = {
  ...commonConfig,
  maintainAspectRatio: false,
  spanGaps: true,
  scales: {
    y: {
      display: true,
      beginAtZero: true,
      stacked: false,
      title: {
        display: true,
        text: "# Log/Avg of Material group",
      },
    },
    x: {
      stacked: false,
    },
  },
};
