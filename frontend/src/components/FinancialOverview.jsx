import * as movieDisplayUtils from "../utils/movieDisplayUtils";

export default function FinancialOverview({ movie }) {
  const profit = movieDisplayUtils.calculateProfit(movie.budget, movie.revenue);
  const roi = movieDisplayUtils.calculateROI(movie.budget, movie.revenue);

  return (
    (movie?.budget > 0 || movie?.revenue > 0) && (
      <div class="bg-gradient-to-b from-slate-800/30 to-transparent shadow-md shadow-blue-400/50 border border-blue-100/50 rounded-lg p-6 mb-8">
        <h3 class="text-xl text-white font-semibold mb-4">
          Financial Performance
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {movie?.budget > 0 && (
            <div>
              <h4 class="text-white text-sm">Budget</h4>
              <p class="text-xl text-white font-light">
                {movieDisplayUtils.formatMoney(movie.budget)}
              </p>
            </div>
          )}

          {movie?.revenue > 0 && (
            <div>
              <h4 class="text-white text-sm">Box Office Revenue</h4>
              <p class="text-xl text-white font-light">
                {movieDisplayUtils.formatMoney(movie.revenue)}
              </p>
            </div>
          )}

          {profit !== null && (
            <div>
              <h4 class="text-white text-sm">Profit / Loss</h4>
              <p
                class={`text-xl font-light ${
                  profit >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {movieDisplayUtils.formatMoney(profit)}
              </p>
            </div>
          )}

          {roi !== null && (
            <div>
              <h4 class="text-white text-sm">Return on Investment</h4>
              <p
                class={`text-xl font-light ${
                  roi >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {roi.toFixed(2)}%
              </p>
            </div>
          )}
        </div>
      </div>
    )
  );
}
