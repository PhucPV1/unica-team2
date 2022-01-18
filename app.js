require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.port || 3000;
const morgan = require('morgan');
const route = require('./app/routes');
const db = require('./config/db');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const formidable = require("express-formidable");
const SortMiddleware = require('./app/middlewares/SortMiddleware');

db.connect();

app.use(express.static('./public'));

/* urlencoded, json and cookie reader */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(formidable());

/* Custom Middleware */
app.use(SortMiddleware);

/* secure */
app.use(
  cors({
    origin: `http://127.0.0.1:${process.env.port}`,
    credentials: true,
  }),
);

app.use(methodOverride('_method'));

/* Http logger */
app.use(morgan('tiny'));

/* Template engine */
app.set('view engine', 'ejs');
app.set('views', './app/views');

/* Route */
route(app);

app.listen(port);
