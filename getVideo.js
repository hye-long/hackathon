// getVideo.js
const axios = require('axios');
const { extractVideoId } = require('./utils');
require('dotenv').config();

const API_KEY = process.env.YOUTUBE_API_KEY;

async function getBasicInfo(req, res) {
    const videoUrl = req.query.url;
    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
        return res.status(400).json({ error: "잘못된 주소입니당" });
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
        res.status(500).json({ error: "비디오 정보가 없습니다." });
    }
}

module.exports = getBasicInfo;
