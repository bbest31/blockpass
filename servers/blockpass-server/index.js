'use strict';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const checkJwt = require('./src/middlewares/checkJwt.js');
const sendErrorResponse = require('./src/middlewares/errorResponseMiddleware.js');

//  ROUTES 
const organizationRoutes = require('./src/routes/organizationRoutes.js');
const userRoutes = require('./src/routes/userRoutes');


// APP SETUP
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(helmet());
app.use(checkJwt);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/Blockpass');
}
main().catch((err) => console.log(err));

// Parse incoming payloads as json
app.use(express.json());

app.use('/organization', organizationRoutes);
app.use('/users', userRoutes);

app.use(sendErrorResponse);

app.listen(port, () => {
  console.log(`BlockPass server listening on port ${port}`);
});
