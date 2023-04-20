const path = require("path");
const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const predictionsRouter = require('./api/predictions');
const DallERouter = require('./api/dall-e');
const predictionStatusRouter = require('./api/id');

// load environment variables from .env file
dotenv.config();

const app = express();
app.disable("x-powered-by");

//use cors
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cors());


// parse incoming JSON requests
app.use(express.json());

// set static folder
app.use(express.static(path.join(__dirname, "client","www","assets")));

// use dall-e creation router
app.use('/api/dall-e', DallERouter);

// use prediction creation router
app.use('/api/predictions', predictionsRouter);

// use prediction status router
app.use('/api/predictions', predictionStatusRouter);

// use the default home page
app.use("/", express.static(path.join(__dirname, "client/www")));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
