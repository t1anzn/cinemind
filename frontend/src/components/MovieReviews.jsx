import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import {
  SparklesIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // Import the plugin

export default function MovieReviews({ movie, sentiment }) {
  if (!movie?.reviews) {
    return <p className="text-gray-500 italic">No reviews available.</p>;
  }

  // Separate author name from review content, returning an object
  const parseReview = (review) => {
    const [firstLine, ...rest] = review.split("\n"); // Split first line assuming its the name
    return {
      // Return an object with author and content properties
      author: firstLine.trim(),
      content: rest.join("\n").trim(),
    };
  };

  // Processes movie reviews string into an array of structured objects
  const splitReviews = movie.reviews
    .split(/Author:\s*/g)
    .filter(Boolean)
    .map((review) => parseReview(review));

  return (
    <div className="bg-gradient-to-b from-slate-800/30 to-transparent shadow-md shadow-blue-400/50 border border-blue-100/50 rounded-lg">
      <div className="p-6 border-b border-slate-700/50">
        <h2 className="text-2xl font-semibold text-white">Reviews</h2>
        <p className="text-slate-400 text-sm">
          {splitReviews.length}{" "}
          {splitReviews.length === 1 ? "review" : "reviews"}
        </p>
        {sentiment && (
          <div className="mt-4 p-4 bg-gradient-to-b from-blue-600/20 to-transparent rounded-xl">
            <h3 className="text-white font-normal tracking-normal text-2xl pt-2">
              <SparklesIcon className="w-5 h-5 inline mr-1 text-white mb-2" />
              Smart Review
            </h3>

            <p className="text-sm font-light text-cyan-400/80 border-b border-blue-500/20 pb-4  mb-2">
              powered by Gemini AI
            </p>
            <p className="text-slate-300 font-light text-md">{sentiment}</p>
          </div>
        )}
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {splitReviews.map((review, idx) => (
          <div
            key={idx}
            className="p-6 border-b border-slate-700/20 hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <FaUserCircle className="w-10 h-10 text-blue-400 flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-medium">{review.author}</h3>
                </div>

                <div className="text-white mb-4 tracking-wide font-light">
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      p: ({ node, ...props }) => (
                        <p {...props} className="text-sm leading-relaxed" />
                      ),
                    }}
                  >
                    {review.content}
                  </ReactMarkdown>
                </div>

                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-slate-400 hover:text-blue-400">
                    <HandThumbUpIcon className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-1 text-slate-400 hover:text-red-400">
                    <HandThumbDownIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
