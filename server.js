const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 2024;
const API_KEY = process.env.YOUTUBE_API_KEY;


function extractVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/;
    const match = url.match(regex);
    return match ? (match[1] || match[2]) : null;
}


app.get('/video/basic_info', async (req, res) => {
    const videoUrl = req.query.url;
    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`;
    
    try {
        const response = await axios.get(url);
        if (response.data.items.length === 0) {
            return res.status(404).json({ error: "Video not found" });
        }

        const video = response.data.items[0];
        const videoInfo = {
            "영상 제목": video.snippet.title,
            "영상 설명": video.snippet.description,
            "채널 이름": video.snippet.channelTitle,
            "조회수": video.statistics.viewCount,
            "좋아요 수": video.statistics.likeCount,
            "댓글 수": video.statistics.commentCount,
            "영상 업로드 날짜와 시간": video.snippet.publishedAt
        };
        res.json(videoInfo);
    } catch (error) {
        console.error("Error fetching video information:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch video information" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
