export function getReleaseYear(dateString) {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).getFullYear().toString();
    } catch (error) {
      return 'Unknown';
    }
  };

  export function getReleaseFullDate(dateString) {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

export function formatRuntime(minutes){
  if(!minutes) return 'Unknown';
  const hours = Math.floor(minutes/60);
  const mins = minutes % 60;
  return `${hours}H ${mins}M`;

};

export function formatVoteBadge(vote_average){
  if(!vote_average) return 'bg-gray-400 text-gray-200';

  const vote = parseFloat(vote_average.toString());

  if (vote >= 8) return 'bg-green-400/70 text-white';
  if (vote >= 7) return 'bg-cyan-600 text-white';
  if (vote >= 5) return 'bg-yellow-500/70 text-white';
  return 'bg-red-500/50 text-white';
};

export function formatPopularityBar(popularity) {
  if (typeof popularity !== "number" || popularity < 0) {
    console.error("Invalid popularity value:", popularity);
    return "0%";
  }
  const width = Math.min(100, Math.floor(popularity / 10)); // Cap at 100%
  return `${width}%`;
}

// Format budget and revenue to USD
export function formatMoney(amount){
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(typeof amount === "string" ? parseFloat(amount) : amount);
};

// Calculate profit
export function calculateProfit(budget, revenue){
  if (!budget || !revenue) return null;
  return revenue - budget;
};

// Calculate ROI %
export function calculateROI(budget, revenue){
  if (!budget || !revenue || budget === 0) return null;
  return ((revenue - budget) / budget) * 100;
};