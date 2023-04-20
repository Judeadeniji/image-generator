const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
// load environment variables from .env file
dotenv.config();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

const size = "512x512";
const response_format = "url";
const model_engine = "image-alpha-001";
const num_outputs = 1;

router.post('/', async (req, res) => {
  try {
    const response = await openai.createImage({
      model: model_engine,
      prompt: req.body.prompt,
      size: size,
      responseFormat: response_format,
      n: num_outputs,
    });
    const artUrl = response.data[0].url;
    res.status(201).json({ artUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const response = await openai.createImage({
      prompt: "A cute baby sea otter",
      n: 2,
      size: "1024x1024",
    });
    const artUrl1 = response.data[0].url;
    const artUrl2 = response.data[1].url;
    res.status(200).json({ artUrls: [artUrl1, artUrl2] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
