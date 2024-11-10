// getReview.js
const db = require('./db');

async function getReview(req, res) {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: "URL을 제공해야 합니다." });
    }

    try {
        
        const [rows] = await db.execute(
            'SELECT AVG(rating) AS averageRating, COUNT(rating) AS ratingCount FROM reviews WHERE youtube_url = ?',
            [videoUrl]
        );

        let { averageRating, ratingCount } = rows[0];

        
        averageRating = averageRating !== null ? parseFloat(averageRating).toFixed(2) : 0;

        // 결과 반환 시 키를 한국어로 변환
        res.status(200).json({
            youtube_url: videoUrl,
            평균점수: parseFloat(averageRating), 
            평점: ratingCount 
        });
    } catch (error) {
        console.error("MySQL에서 평균 평점 조회 중 오류 발생:", error.message);
        res.status(500).json({ error: "서버 오류로 인해 평균 평점 조회에 실패했습니다." });
    }
}

module.exports = getReview;
