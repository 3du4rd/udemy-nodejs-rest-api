const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');

const feedRoutes = require('./routes/feed');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// app.use(express.urlencoded()); // x-www-form-urlencoded <form>
app.use(express.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));