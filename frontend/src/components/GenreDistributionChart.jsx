import React, { useMemo, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the required chart components for pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

export default function GenreDistributionChart({
  movies = [],
  maxGenres = 10,
  height = "400px",
  sortBy = "count",
  genreMap = {},
  showDataLabels = false,
}) {
  // Extract and count genres from movies
  const genreData = useMemo(() => {
    // Memoize the genre data calculation to avoid unnecessary re-renders
    if (!movies || movies.length === 0) {
      console.log("No movies data available");
      return { labels: [], counts: [] };
    }

    // Debug the movie structure
    console.log("Movie data structure sample:", movies[0]);
    console.log("Total movies to analyze:", movies.length);
    console.log("Genre map:", genreMap);

    // Create a map to count genre occurrences
    const genreCounts = {};
    const genrePopularity = {};

    // Process each movie's genres
    let movieGenreCount = 0;
    movies.forEach((movie) => {
      if (movie.genres && Array.isArray(movie.genres)) {
        // Check if genres exist and is an array
        movieGenreCount++;
        movie.genres.forEach((genre) => {
          if (genre) {
            if (genreCounts[genre]) {
              // Check if genre already exists in the map
              genreCounts[genre]++; // Increment count for existing genre

              // Track popularity if available
              if (movie.vote_average) {
                genrePopularity[genre].sum += movie.vote_average;
                genrePopularity[genre].count++;
              }
            } else {
              genreCounts[genre] = 1; // Initialize count for new genre if not seen before

              // Initialize popularity tracking
              genrePopularity[genre] = {
                sum: movie.vote_average || 0,
                count: movie.vote_average ? 1 : 0,
              };
            }
          }
        });
      }
    });

    console.log(
      `Found ${movieGenreCount} movies with genre data out of ${movies.length} total movies`
    );
    console.log("Genre counts:", genreCounts);

    // If no genres were found, check if we need to fetch genre data separately
    if (Object.keys(genreCounts).length === 0) {
      console.warn("No genre data found in the movies data");
    }

    // Convert to array of [genre, count] pairs
    let genreEntries = Object.entries(genreCounts); // Convert object to array for sorting, each entry is [genre, count]

    // Calculate average popularity for each genre
    const genreAvgPopularity = {};
    Object.keys(genrePopularity).forEach((genre) => {
      genreAvgPopularity[genre] =
        genrePopularity[genre].count > 0
          ? genrePopularity[genre].sum / genrePopularity[genre].count
          : 0;
    });

    // Sort by count (descending) or alphabetically based on sortBy prop
    if (sortBy === "alphabetical") {
      genreEntries.sort((a, b) => a[0].localeCompare(b[0])); // Sort alphabetically by genre name. localCompare is used for string comparison.
    } else if (sortBy === "popularity") {
      // Sort by average popularity (descending)
      genreEntries.sort((a, b) => {
        const popA = genreAvgPopularity[a[0]] || 0;
        const popB = genreAvgPopularity[b[0]] || 0;
        return popB - popA;
      });
    } else {
      genreEntries.sort((a, b) => b[1] - a[1]); // Sort by count (descending). b[1] - a[1] sorts in descending order, whilst a[1] - b[1] would sort in ascending order.
    }

    // Limit to maxGenres
    genreEntries = genreEntries.slice(0, maxGenres);

    // Separate into labels and counts
    const labels = genreEntries.map((entry) => entry[0]);
    const counts = genreEntries.map((entry) => entry[1]);

    return { labels, counts };
  }, [movies, maxGenres, sortBy, genreMap]);

  // Add a useEffect to log when the component renders with new data
  useEffect(() => {
    console.log("GenreDistributionChart rendered with data:", {
      movieCount: movies?.length,
      genreLabels: genreData.labels,
      genreCounts: genreData.counts,
    });
  }, [movies, genreData]);

  // Generate colors for pie chart
  const generateColors = (count) => {
    const backgroundColors = [];
    const borderColors = [];

    // Pre-defined vibrant colors with good contrast for dark mode
    // These colors are chosen to be visually distinct and work well on dark backgrounds
    const colorPalette = [
      "rgba(54, 162, 235, 0.8)", // blue
      "rgba(255, 99, 132, 0.8)", // red
      "rgba(75, 192, 192, 0.8)", // green
      "rgba(255, 206, 86, 0.8)", // yellow
      "rgba(153, 102, 255, 0.8)", // purple
      "rgba(255, 159, 64, 0.8)", // orange
      "rgba(199, 199, 199, 0.8)", // grey
      "rgba(83, 102, 255, 0.8)", // indigo
      "rgba(255, 99, 255, 0.8)", // pink
      "rgba(97, 255, 133, 0.8)", // mint
    ];

    for (let i = 0; i < count; i++) {
      // If we have enough colors in our palette, use them, otherwise generate random ones
      if (i < colorPalette.length) {
        backgroundColors.push(colorPalette[i]);
        // Slightly darker border color (less transparency)
        borderColors.push(colorPalette[i].replace("0.8", "1"));
      } else {
        // Generate random colors if we run out of pre-defined ones
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        backgroundColors.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
        borderColors.push(`rgba(${r}, ${g}, ${b}, 1)`);
      }
    }

    return { backgroundColors, borderColors };
  };

  const { backgroundColors, borderColors } = generateColors(
    genreData.labels.length
  );

  // Chart configuration
  const chartData = {
    labels: genreData.labels,
    datasets: [
      {
        data: genreData.counts,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
        hoverOffset: 35,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20,
    },
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#f1f5f9",
          font: {
            size: 11,
          },

          padding: 12,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} movies (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: "#fff",
        formatter: (value, context) => {
          // Get the corresponding genre name from labels array
          return context.chart.data.labels[context.dataIndex];
        },
        // Only show labels on segments that are large enough to be readable
        display: (context) => {
          if (!showDataLabels) return false; // Don't show if labels are turned off

          const index = context.dataIndex;
          const value = context.dataset.data[index];
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          // Only show labels for segments that are at least 4% of the total
          return value / total > 0.02; // Threshold for label display
        },
      },
    },
  };

  // Show a helpful message when no genre data is available
  if (genreData.labels.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-slate-400 flex-col"
      >
        <p className="mb-2">No genre data available</p>
        <p className="text-xs opacity-70">
          Check the console for debugging information
        </p>
        {movies && movies.length > 0 && (
          <button
            onClick={() => console.log("Movie sample:", movies[0])}
            className="mt-2 text-xs text-blue-400 underline"
          >
            Log Sample Movie Data
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ height }} className="flex justify-center items-center">
      <Pie data={chartData} options={options} />
    </div>
  );
}
