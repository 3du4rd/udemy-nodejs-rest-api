const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); 

const { mongoConnect,mongoUri } = require('./util/database');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const PORT = process.env.PORT || 8080;
const app = express();

//-> Especificacion de almacenamiento de imagenes (Multer)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname); // + '-' + uniqueSuffix)
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/images', express.static(path.join(__dirname,'images')));

app.use(multer({ 
    storage: storage, 
    fileFilter: fileFilter 
  }).single('image'));

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
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

//-> Middleware para Manejo de Errores
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });

mongoConnect
.then(result => {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  console.log('UUID: ' + uuidv4());
})
.catch(err => {
  console.log(err)
});