const express = require('express');
require('dotenv').config();

const postReview = require('./postReview');
const getReviewsByUrl = require('./getReview');
const getBasicInfo = require('./getVideo'); 
const reviewSummary = require('./reviewSummary');

const app = express();
const PORT = 2024;

app.use(express.json());


app.get('/', (req, res) => {
    res.send("success");
});


app.post('/video/ratings_reviews', postReview);

app.get('/video/ratings/mean', getReviewsByUrl);

app.get('/video/basic_info', getBasicInfo);
app.get('/video/reviews/summary', reviewSummary

);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
