export default function MovieCard(){
    return (
        <>
            <a href="#" className="movie-card block group relative">
                {/* Card Container */}
                <div className="relative rounded-lg overflow-hidden transition-all duration-100 shadow-lg shadow-black/50 group-hover:shadow-xl group-hover:shadow-cyan-900/10 border border-slate-800/50 group-hover:border-cyan-800/20">
                
                    {/* Hover Shadow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                    </div>

                    {/* Movie Poster */}
                    <div className="h-[400px] w-[200px] relative bg-slate-900">
                    <img src="https://cdn.prod.website-files.com/6009ec8cda7f305645c9d91b/66a4263d01a185d5ea22eeec_6408f6e7b5811271dc883aa8_batman-min.png" alt="Movie Poster" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>

                
                    
                </div>

                {/* Movie Info */}
                <div className="py-3 px-1 space-y-1">
                        <h3 className="font-light text-white/90 text-sm truncate tracking-wide group-hover:text-cyan-300 transition-colors duration-300">Movie Title</h3>
                        <p className="text-sm font-light text-slate-400/80 tracking-wider">2020</p>
                </div>
            </a>
        </>

    )
}