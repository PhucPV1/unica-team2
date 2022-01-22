require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const morgan = require('morgan');
const route = require('./app/routes');
const db = require('./config/db');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const SortMiddleware = require('./app/middlewares/SortMiddleware');

db.connect();

app.use(express.static('./public'));

/* urlencoded, json and cookie reader */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

/* Custom Middleware */
app.use(SortMiddleware);

/* secure */
app.use(
  cors({
    origin: `http://127.0.0.1:${process.env.PORT}`,
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

app.listen(PORT);
