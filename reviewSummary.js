// reviewSummary.js
const db = require('./db');

async function reviewSummary(req, res) {
    const videoUrl = req.query.url;

   
    if (!videoUrl) {
        return res.status(400).json({ error: "URL을 제공해야 합니다." });
    }

    try {
        
        const [negativeReviews] = await db.execute(
            'SELECT rating, review, timestamp FROM reviews WHERE youtube_url = ? AND rating <= 2 ORDER BY timestamp DESC LIMIT 2',
            [videoUrl]
        );

        
        const [positiveReviews] = await db.execute(
            'SELECT rating, review, timestamp FROM reviews WHERE youtube_url = ? AND rating >= 4 ORDER BY timestamp DESC LIMIT 2',
            [videoUrl]
        );

        
        const negativeResult = negativeReviews.length > 0 ? negativeReviews : "해당없음";
        const positiveResult = positiveReviews.length > 0 ? positiveReviews : "해당없음";

        
        res.status(200).json({
            youtube_url: videoUrl,
            부정적_평가: negativeResult,
            긍정적_평가: positiveResult
        });
    } catch (error) {
        console.error("MySQL에서 리뷰 요약 조회 중 오류 발생:", error.message);
        res.status(500).json({ error: "서버 오류로 인해 리뷰 요약 조회에 실패했습니다." });
    }
}

module.exports = reviewSummary;
