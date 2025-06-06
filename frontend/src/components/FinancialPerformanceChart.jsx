/**
 * FinancialPerformanceChart Component
 *
 * Horizontal bar chart for visualizing movie financial performance metrics.
 * Features:
 * - Displays revenue, budget, profit, or ROI data using Chart.js
 * - Configurable metric selection (revenue/budget/profit/ROI)
 * - Adjustable number of top movies to display (10-20)
 * - Smart number formatting for large values (B/M/K suffixes)
 * - Optional data labels with toggle control
 * - Color-coded bars based on selected metric
 * - Responsive design with proper chart scaling
 * - Handles missing financial data gracefully
 *
 * Used in MovieAnalytics component for financial data visualization.
 */

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function FinancialPerformanceChart({
  movies,
  metric = "revenue",
  maxMovies = 15,
  height = "400px",
  showDataLabels = false,
}) {
  const chartData = useMemo(() => {
    // Filter movies with valid financial data
    const filteredMovies = movies.filter((movie) => {
      if (metric === "revenue") return movie.revenue > 0;
      if (metric === "budget") return movie.budget > 0;
      if (metric === "profit") return movie.revenue > 0 && movie.budget > 0;
      if (metric === "roi")
        return movie.revenue > 0 && movie.budget > 0 && movie.budget > 100000;
      return false;
    });

    // Calculate the metric for each movie
    const moviesWithMetric = filteredMovies.map((movie) => {
      let value = 0;

      if (metric === "revenue") value = movie.revenue;
      else if (metric === "budget") value = movie.budget;
      else if (metric === "profit") value = movie.revenue - movie.budget;
      else if (metric === "roi") {
        // Calculate accurate ROI without capping
        value = ((movie.revenue - movie.budget) / movie.budget) * 100;
      }

      return {
        title: movie.title,
        value,
      };
    });

    // Sort by the metric value and take top N
    const sortedMovies = [...moviesWithMetric].sort(
      (a, b) => b.value - a.value
    );
    const topMovies = sortedMovies.slice(0, maxMovies);

    // For better visualization, show the chart in reverse order
    const reversedMovies = [...topMovies].reverse();

    return {
      labels: topMovies.map((m) => m.title),
      values: topMovies.map((m) => m.value),
    };
  }, [movies, metric, maxMovies]);

  // Format large numbers for display
  const formatNumber = (value) => {
    if (metric === "roi") {
      // Handle large ROI values with appropriate formatting
      if (value >= 10000) return `${(value / 1000).toFixed(0)}k%`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}k%`;
      return `${value.toFixed(0)}%`;
    }

    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }

    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }

    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  // Set color based on metric
  const getBarColor = () => {
    switch (metric) {
      case "revenue":
        return "rgba(75, 192, 250, 0.7)";
      case "budget":
        return "rgba(153, 102, 255, 0.7)";
      case "profit":
        return "rgba(54, 162, 235, 0.7)";
      case "roi":
        return "rgba(255, 206, 86, 0.7)";
      default:
        return "rgba(75, 192, 192, 0.7)";
    }
  };

  const options = {
    indexAxis: "y",
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          callback: function (value) {
            return formatNumber(value);
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          // Limit label length for clarity
          callback: function (index) {
            const label = chartData.labels[index];
            return label.length > 25 ? label.substr(0, 22) + "..." : label;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${formatNumber(context.raw)}`;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
      datalabels: {
        display: showDataLabels,
        align: "end",
        anchor: "end",
        formatter: (value) => formatNumber(value),
        color: "rgba(255, 255, 255, 1)",
        font: {
          weight: "light",
        },
      },
    },
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: getMetricLabel(),
        data: chartData.values,
        backgroundColor: getBarColor(),
        borderColor: getBarColor().replace("0.7", "1"),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  function getMetricLabel() {
    switch (metric) {
      case "revenue":
        return "Total Revenue";
      case "budget":
        return "Production Budget";
      case "profit":
        return "Profit / Loss";
      case "roi":
        return "Return on Investment (%)";
      default:
        return "Revenue";
    }
  }

  return (
    <div style={{ height, position: "relative" }}>
      {chartData.values.length > 0 ? (
        <Bar data={data} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">
            No financial data available for this metric
          </p>
        </div>
      )}
    </div>
  );
}
