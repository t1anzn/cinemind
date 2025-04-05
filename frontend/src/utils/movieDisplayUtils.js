export function getReleaseYear(dateString) {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).getFullYear().toString();
    } catch (error) {
      return 'Unknown';
    }
  }

export function formatRuntime(minutes){
  if(!minutes) return 'Unknown';
  const hours = Math.floor(minutes/60);
  const mins = minutes % 60;
  return `${hours}H ${mins}M`;

}

export function formatVoteBadge(vote_average){
  if(!vote_average) return 'bg-gray-400 text-gray-200';

  const vote = parseFloat(vote_average.toString());

  if (vote >= 7) return 'bg-cyan-700 text-white';
  if (vote >= 5) return 'bg-yellow-500/60 text-white';
  return 'bg-red-500/50 text-white';
}