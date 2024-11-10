const db = require('./db');
const { extractVideoId } = require('./utils'); 

async function postRatingReview(req, res) {
    const videoUrl = req.query.url; 
    const { rating, review } = req.body; 

    
    if (!videoUrl || !rating || !review) {
        return res.status(400).json({ error: "비디오 URL, 평점, 후기를 모두 제공해야 합니다." });
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "평점은 1에서 5 사이의 정수여야 합니다." });
    }

    if (typeof review !== 'string' || review.length > 300) {
        return res.status(400).json({ error: "후기는 300자 이하의 문자열이어야 합니다." });
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
        return res.status(400).json({ error: "유효한 YouTube URL을 제공해야 합니다." });
    }

    try {
        
        const [result] = await db.execute(
            'INSERT INTO reviews (youtube_url, rating, review) VALUES (?, ?, ?)',
            [videoUrl, rating, review]
        );

        res.status(201).json({
            message: "평점과 후기가 성공적으로 등록되었습니다.",
            data: {
                id: result.insertId,
                youtube_url: videoUrl,
                rating,
                review
            }
        });
    } catch (error) {
        console.error("MySQL에 데이터 삽입 중 오류 발생:", error);
        res.status(500).json({ error: "평점과 후기 등록에 실패했습니다." });
    }
}

module.exports = postRatingReview;
