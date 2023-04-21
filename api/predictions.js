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
      // Pinned to a specific version of Midjourney
      // See https://replicate.com/tstramer/midjourney-diffusion/
      version: "6359a0cab3ca6e4d3320c33d79096161208e9024d174b2311e5a21b6c7e1131c",
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/stable-diffussion/versions
  //  version: "6359a0cab3ca6e4d3320c33d79096161208e9024d174b2311e5a21b6c7e1131c",

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
