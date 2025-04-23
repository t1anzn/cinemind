import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function YearDistributionChart({
  movies,
  groupByDecade = false,
  maxBars = 20,
  height = "300px",
}) {
  const chartData = useMemo(() => {
    if (!movies || movies.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }],
      };
    }

    // Extract release years from movies
    const releaseYears = movies
      .map((movie) =>
        movie.release_date ? new Date(movie.release_date).getFullYear() : null
      )
      .filter((year) => year && !isNaN(year));

    let labels, counts;

    if (groupByDecade) {
      // Group by decade
      const decadeCounts = {};

      releaseYears.forEach((year) => {
        const decade = Math.floor(year / 10) * 10;
        decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
      });

      // Sort decades and take top maxBars
      const sortedDecades = Object.keys(decadeCounts)
        .map(Number)
        .sort((a, b) => a - b);

      labels = sortedDecades.map((decade) => `${decade}s`);
      counts = sortedDecades.map((decade) => decadeCounts[decade]);
    } else {
      // Count movies per year
      const yearCounts = {};

      releaseYears.forEach((year) => {
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      });

      // Sort years and limit to maxBars
      const sortedYears = Object.keys(yearCounts)
        .map(Number)
        .sort((a, b) => a - b);

      // If we have too many years, sample them
      let filteredYears = sortedYears;
      if (sortedYears.length > maxBars) {
        const step = Math.ceil(sortedYears.length / maxBars);
        filteredYears = sortedYears.filter((_, i) => i % step === 0);
      }

      labels = filteredYears.map(String);
      counts = filteredYears.map((year) => yearCounts[year]);
    }

    return {
      labels,
      datasets: [
        {
          label: groupByDecade ? "Movies per Decade" : "Movies per Year",
          data: counts,
          backgroundColor: "rgba(75, 192, 250, 0.7)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [movies, groupByDecade, maxBars]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      },
    },
  };

  return (
    <div className="relative" style={{ height }}>
      {movies.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400">No data available</p>
        </div>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}
