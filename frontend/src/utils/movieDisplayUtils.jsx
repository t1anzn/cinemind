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

export function formatPopularityBar(popularity){
  if(!popularity) return null;

  const width = Math.min(100, popularity / 10); // cap at 100%

  return (
    <div className="space-y-1">
      <div className="text-xs text-slate-500 font-light tracking-wider">POPULARITY:</div>  
      <p className="text-xs text-slate-300 font-light tracking-wide">{Math.floor(width)}%</p>
      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-200 to-blue-500" style={{ width: `${width}%`}}></div>
      </div>
      

    </div>
  );
}