/**
 * MovieAnalytics Component
 *
 * Comprehensive analytics dashboard displaying movie data visualizations.
 * Features:
 * - Three interactive Chart.js visualizations (year, genre, financial)
 * - Configurable chart controls for customization (grouping, sorting, limits)
 * - Client-side only rendering to prevent hydration errors
 * - Loading states and fallback UI handling
 * - Responsive grid layout with styled control panels
 * - Real-time chart updates based on user interactions
 * - Support for decade grouping, metric switching, and data label toggles
 *
 * Used as a tab in MoviePage component for data exploration and insights.
 */

import { useState, useEffect } from "react"; // Add useEffect
import YearDistributionChart from "./YearDistributionChart";
import GenreDistributionChart from "./GenreDistributionChart";
import FinancialPerformanceChart from "./FinancialPerformanceChart";

export default function MovieAnalytics({
  analyticsData,
  isLoading,
  genreMap = {},
}) {
  const [chartOptions, setChartOptions] = useState({
    yearChart: {
      groupByDecade: true,
      maxBars: 20,
      height: "400px",
      showDataLabels: false,
    },
    genreChart: {
      maxGenres: 10,
      height: "400px",
      sortBy: "count", // Add sort option (count or alphabetical)
      showDataLabels: false,
    },
    financialChart: {
      maxMovies: 15,
      metric: "revenue", // revenue, budget, profit, roi
      height: "400px",
      showDataLabels: false,
    },
  });

  // Add client-side only rendering to prevent hydration errors with charts
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="bg-transparent rounded-lg p-6 text-white">
      <h2 className="text-4xl font-bold tracking-wide mb-4">Movie Analytics</h2>
      <p className=" mb-4 text-gray-400 font-light">
        Explore visual insights about our movie collection. These interactive
        charts show distribution by release year and genre, revealing trends and
        patterns in our database. Use the controls above each chart to customize
        your view.
      </p>
      <p className="text-gray-400 text-sm italic">
        Currently showing{" "}
        <span className="text-cyan-500 text-sm font-bold tracking-wide">
          {analyticsData.length}
        </span>{" "}
        of the top rated movies in our database.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3">Loading analytics data...</p>
        </div>
      ) : isClient ? ( // Only render charts on client-side, because they are heavy and can cause hydration errors
        <>
          {/* Movie Release Years Chart */}
          <div className="mb-8 mt-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Movie Release Year Distribution
              </h3>
              <p className="text-sm text-gray-400 font-light">
                Number of movies released by year
              </p>

              {/* Year Chart Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="groupByDecade"
                    checked={chartOptions.yearChart.groupByDecade}
                    onChange={(e) =>
                      setChartOptions({
                        ...chartOptions,
                        yearChart: {
                          ...chartOptions.yearChart,
                          groupByDecade: e.target.checked,
                        },
                      })
                    }
                    className="mr-2 h-4 w-4"
                  />
                  <label
                    htmlFor="groupByDecade"
                    className="text-sm text-gray-300"
                  >
                    Group by decade
                  </label>
                </div>

                <div className="flex items-center">
                  <label className="text-sm text-gray-300 mr-2">
                    Max bars:
                  </label>
                  <select
                    value={chartOptions.yearChart.maxBars}
                    onChange={(e) =>
                      setChartOptions({
                        ...chartOptions,
                        yearChart: {
                          ...chartOptions.yearChart,
                          maxBars: Number(e.target.value),
                        },
                      })
                    }
                    className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div className="flex">
                  <button
                    onClick={() =>
                      setChartOptions({
                        ...chartOptions,
                        yearChart: {
                          ...chartOptions.yearChart,
                          showDataLabels:
                            !chartOptions.yearChart.showDataLabels,
                        },
                      })
                    }
                    className={`text-sm px-3 py-1 rounded-md ${
                      chartOptions.yearChart.showDataLabels
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    } transition-colors`}
                  >
                    {chartOptions.yearChart.showDataLabels
                      ? "Hide Labels"
                      : "Show Labels"}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-b from-slate-800/30 to-transparent shadow-md shadow-blue-400/50 border border-blue-100/50 rounded-lg p-4">
              <YearDistributionChart
                movies={analyticsData}
                groupByDecade={chartOptions.yearChart.groupByDecade}
                maxBars={chartOptions.yearChart.maxBars}
                height={chartOptions.yearChart.height}
                showDataLabels={chartOptions.yearChart.showDataLabels}
              />
            </div>
          </div>

          {/* Genre Distribution Chart */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Genre Distribution</h3>
              <p className="text-sm text-gray-400 font-light">
                Top {chartOptions.genreChart.maxGenres} genres by movie count
              </p>

              {/* Genre Chart Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <label className="text-sm text-gray-300 mr-2">
                    Max genres:
                  </label>
                  <select
                    value={chartOptions.genreChart.maxGenres}
                    onChange={(e) =>
                      setChartOptions({
                        ...chartOptions,
                        genreChart: {
                          ...chartOptions.genreChart,
                          maxGenres: Number(e.target.value),
                        },
                      })
                    }
                    className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="text-sm text-gray-300 mr-2">Sort by:</label>
                  <select
                    value={chartOptions.genreChart.sortBy}
                    onChange={(e) =>
                      setChartOptions({
                        ...chartOptions,
                        genreChart: {
                          ...chartOptions.genreChart,
                          sortBy: e.target.value,
                        },
                      })
                    }
                    className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700"
                  >
                    <option value="count">Movie count</option>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>

                <div className="flex">
                  <button
                    onClick={() =>
                      setChartOptions({
                        ...chartOptions,
                        genreChart: {
                          ...chartOptions.genreChart,
                          showDataLabels:
                            !chartOptions.genreChart.showDataLabels,
                        },
                      })
                    }
                    className={`text-sm px-3 py-1 rounded-md ${
                      chartOptions.genreChart.showDataLabels
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    } transition-colors`}
                  >
                    {chartOptions.genreChart.showDataLabels
                      ? "Hide Labels"
                      : "Show Labels"}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-b from-slate-800/30 to-transparent shadow-md shadow-blue-400/50 border border-blue-100/50 rounded-lg p-4">
              <GenreDistributionChart
                movies={analyticsData}
                maxGenres={chartOptions.genreChart.maxGenres}
                height={chartOptions.genreChart.height}
                sortBy={chartOptions.genreChart.sortBy}
                genreMap={genreMap}
                showDataLabels={chartOptions.genreChart.showDataLabels}
              />
            </div>
          </div>

          {/* Financial Performance Chart */}
          <div className="mb-8 mt-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Financial Performance</h3>
              <p className="text-sm text-gray-400 font-light">
                Top {chartOptions.financialChart.maxMovies} movies by{" "}
                {chartOptions.financialChart.metric === "revenue"
                  ? "box office revenue"
                  : chartOptions.financialChart.metric === "budget"
                  ? "production budget"
                  : chartOptions.financialChart.metric === "profit"
                  ? "profit margin"
                  : "return on investment"}
              </p>

              {/* Financial Chart Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <label className="text-sm text-gray-300 mr-2">Metric:</label>
                  <select
                    value={chartOptions.financialChart.metric}
                    onChange={(e) =>
                      setChartOptions({
                        ...chartOptions,
                        financialChart: {
                          ...chartOptions.financialChart,
                          metric: e.target.value,
                        },
                      })
                    }
                    className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700"
                  >
                    <option value="revenue">Revenue</option>
                    <option value="budget">Budget</option>
                    <option value="profit">Profit</option>
                    <option value="roi">ROI</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="text-sm text-gray-300 mr-2">Show:</label>
                  <select
                    value={chartOptions.financialChart.maxMovies}
                    onChange={(e) =>
                      setChartOptions({
                        ...chartOptions,
                        financialChart: {
                          ...chartOptions.financialChart,
                          maxMovies: Number(e.target.value),
                        },
                      })
                    }
                    className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700"
                  >
                    <option value={10}>Top 10</option>
                    <option value={15}>Top 15</option>
                    <option value={20}>Top 20</option>
                  </select>
                </div>

                <div className="flex">
                  <button
                    onClick={() =>
                      setChartOptions({
                        ...chartOptions,
                        financialChart: {
                          ...chartOptions.financialChart,
                          showDataLabels:
                            !chartOptions.financialChart.showDataLabels,
                        },
                      })
                    }
                    className={`text-sm px-3 py-1 rounded-md ${
                      chartOptions.financialChart.showDataLabels
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    } transition-colors`}
                  >
                    {chartOptions.financialChart.showDataLabels
                      ? "Hide Labels"
                      : "Show Labels"}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-b from-slate-800/30 to-transparent shadow-md shadow-blue-400/50 border border-blue-100/50 rounded-lg p-4">
              <FinancialPerformanceChart
                movies={analyticsData}
                metric={chartOptions.financialChart.metric}
                maxMovies={chartOptions.financialChart.maxMovies}
                height={chartOptions.financialChart.height}
                showDataLabels={chartOptions.financialChart.showDataLabels}
              />
            </div>
          </div>
        </>
      ) : (
        // Placeholder while waiting for client-side rendering
        <div className="text-center mt-8">
          <p>Preparing analytics visualization...</p>
        </div>
      )}
    </div>
  );
}
