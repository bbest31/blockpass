'use strict';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const Moralis = require('moralis').default;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const checkJwt = require('./src/middlewares/checkJwt.js');
const sendErrorResponse = require('./src/middlewares/errorResponseMiddleware.js');
const MORALIS_CONFIG = require('./src/configs/moralisConfig.js');

// UTILS
const { httpResponseMessage } = require('./src/utils/responseMessages.js');

//  ROUTES
const routes = require('./src/routes/index.js');

// APP SETUP
const app = express();
const port = process.env.PORT;
const regex = /^(?!\/(events|logout|verify|authenticate|request-message|ticket-tiers)(?:\/|$)).*$/;

app.use(cors());
app.use(helmet());
app.use(regex, checkJwt);

async function main() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.MONGODB_CONNECT);
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
}
main().catch((err) => console.log(err));

// Parse incoming payloads as json
app.use(express.json());
app.use(cookieParser());

app.use('', routes);

// request message to be signed by client for attendee authentication
app.post('/request-message', async (req, res) => {
  const { address, chain, network } = req.body;

  try {
    const message = await Moralis.Auth.requestMessage({
      address,
      chain,
      ...MORALIS_CONFIG,
    });

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
    console.error(error);
  }
});

app.post('/verify', async (req, res) => {
  try {
    const { message, signature } = req.body;

    const { address, profileId } = (
      await Moralis.Auth.verify({
        message,
        signature,
        networkType: 'evm',
      })
    ).raw;

    const user = { address, profileId, signature };

    // create JWT token
    const token = jwt.sign(user, process.env.AUTH_SECRET);

    // set JWT cookie
    res.cookie('jwt', token, {
      httpOnly: true,
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
    console.error(error);
  }
});

app.get('/authenticate', async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) return res.sendStatus(403); // if the user did not send a jwt token, they are unauthorized

  try {
    const data = jwt.verify(token, process.env.AUTH_SECRET);
    res.json(data);
  } catch {
    return res.sendStatus(403);
  }
});

app.get('/logout', async (req, res) => {
  try {
    res.clearCookie('jwt');
    return res.sendStatus(200);
  } catch {
    return res.sendStatus(403);
  }
});

app.get('*', (_, res) => {
  res.status(404).send(httpResponseMessage[404]);
});

app.use(sendErrorResponse);

app.listen(port, () => {
  console.log(`BlockPass server listening on port ${port}`);
});
