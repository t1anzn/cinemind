/**
 * YouTube Utilities
 * 
 * This module provides utility functions for working with YouTube URLs and video IDs.
 * It handles URL parsing and extraction of video identifiers from various YouTube
 * URL formats for embedding and API interactions.
 * 
 * Key Features:
 * - YouTube URL parsing and video ID extraction
 * - Support for multiple YouTube URL formats (youtube.com and youtu.be)
 * - Regex-based pattern matching for reliable ID extraction
 */

export function extractYouTubeId(url) {
    const regex = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

