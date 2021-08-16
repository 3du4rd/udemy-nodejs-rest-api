const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const { mongoConnect,mongoUri } = require('./util/database');
const auth = require('./middleware/auth');
const { clearImage } = require('./util/file');

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
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(auth);


app.put('/post-image', (req, res, next) => {
    if (!req.isAuth) {
      throw new Error('Not authenticated!');
    }
    if (!req.file) {
      return res.status(200).json({ message: 'No file provided!' });
    }
    if (req.body.oldPath) {
      clearImage(req.body.oldPath);
    }
    return res
      .status(201)
      .json({ message: 'File stored.', filePath: req.file.path });
  });

//-> GraphQL
app.use(
    '/graphql',
    graphqlHTTP({
      schema: graphqlSchema,
      rootValue: graphqlResolver,
      graphiql: true,
      formatError(err) {
          console.error(err);
        if (!err.originalError) {
          return err;
        }
        const data = err.originalError.data;
        const message = err.message || 'An error occurred.';
        const code = err.originalError.code || 500;
        return { message: message, status: code, data: data };
      }
    })
  );

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
    const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
})
.catch(err => {
  console.log(err)
});