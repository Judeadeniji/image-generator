const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
let fetch;
// load environment variables from .env file
dotenv.config();

import('node-fetch').then((module) => {
  fetch = module.default;
});

router.post('/', async (req, res) => {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "6ca8d8299a9bfe947c807e2eab145b8edd5d432644ba16c4073122b63940b01f",

      // This is the text prompt that will be submitted by a form on the frontend
      input: { prompt: req.body.prompt },
    }),
  });


  if (false) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
});
router.get('/', async (req, res) => {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });


 const prediction = await response.json();
  if (prediction.statusCode > 300) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
});

module.exports = router;
