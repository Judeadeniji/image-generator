const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
let fetch;
// load environment variables from .env file
dotenv.config();

import("node-fetch").then((module) => {
  fetch = module.default;
});

const engineId = "stable-diffusion-512-v2-1";
const apiHost = "https://api.stability.ai";
const apiKey = process.env.STABILITY_API_KEY;

if (!apiKey) throw new Error("Missing Stability API key.");

router.post("/", async (req, res) => {
try {
  const response = await fetch(
    `${apiHost}/v1/generation/${engineId}/text-to-image`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: String(req.body.prompt),
          },
        ],
        cfg_scale: 7,
        clip_guidance_preset: "FAST_BLUE",
        height: 512,
        width: 512,
        samples: 1,
        steps: 15,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`);
  }
  const responseJSON = await response.json();

  res.end(JSON.stringify(responseJSON));
  
} catch (e) {
  console.error(e)
}
});

module.exports = router;
