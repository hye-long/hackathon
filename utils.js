//정규화시키기
function extractVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/;
    const match = url.match(regex);
    return match ? (match[1] || match[2]) : null;
}

module.exports = { extractVideoId };
