const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');

const { mongoConnect,mongoUri } = require('./util/database');
const feedRoutes = require('./routes/feed');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/images', express.static(path.join(__dirname,'images')));

// app.use(express.urlencoded()); // x-www-form-urlencoded <form>
app.use(express.json()); // application/json

//-> Middleware para el Manejo de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

//-> Middleware para Manejo de Errores
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
  });

mongoConnect
.then(result => {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
})
.catch(err => {
  console.log(err)
});