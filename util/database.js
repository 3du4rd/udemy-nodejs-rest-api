require('dotenv').config();
const mongoose = require('mongoose');

const username = encodeURIComponent(process.env.MONGODB_USER);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const clusterUrl = process.env.MONGODB_CLUSTERURL;
const database = process.env.MONGODB_DATABASE;

const uri =
  `mongodb+srv://${username}:${password}@${clusterUrl}/${database}?retryWrites=true&w=majority`;

const mongoConnect = mongoose.connect(uri);

exports.mongoConnect = mongoConnect;
exports.mongoUri = uri;
