const express = require('express');
const router = express.Router();
let fetch;
import('node-fetch').then((module) => {
  fetch = module.default;
});
const dotenv = require('dotenv');

// load environment variables from .env file
dotenv.config();

router.get('/:id', async (req, res) => {
  try {
    const response = await fetch(
      "https://api.replicate.com/v1/predictions/" + req.params.id,
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
    }

    const prediction = await response.json();
    res.json(prediction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

module.exports = router;
