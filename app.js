const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');

const feedRoutes = require('./routes/feed');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// app.use(express.urlencoded()); // x-www-form-urlencoded <form>
app.use(express.json()); // application/json

app.use('/feed', feedRoutes);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));