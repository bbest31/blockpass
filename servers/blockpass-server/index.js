'use strict';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const organizationRoutes = require('./src/routes/organizationRoutes.js');
const cors = require('cors');
const checkJwt = require('./src/middlewares/checkJwt.js');

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(checkJwt);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/Blockpass');
}
main().catch((err) => console.log(err));

// Parse incoming payloads as json
app.use(express.json());

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

app.use('/organization', organizationRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
