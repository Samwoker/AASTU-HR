import React from "react";
import Chart from "react-apexcharts";

interface DonutChartProps {
  title: string;
  labels: string[];
  series: number[];
}

export default function DonutChart({ title, labels, series }: DonutChartProps) {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      animations: {
        enabled: true,
        speed: 900,
      },
    },
    labels,
    legend: {
      position: "bottom",
      fontSize: "14px",
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "16px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
    colors: ["#e55400", "#ffda00", "#ff6b6b", "#4dabf7", "#51cf66", "#a78bfa"],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-card border border-gray-100">
      {title && (
        <h2 className="text-lg font-semibold text-k-dark-grey mb-4">{title}</h2>
      )}
      <Chart options={options} series={series} type="donut" height={320} />
    </div>
  );
}
