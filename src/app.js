import createError from 'http-errors';
import express from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import expressWs from 'express-ws';
import { Server } from 'http';
import cors from 'cors';

import indexRouter from './routes/index';
import alarmsRouter from './routes/api/alarms';
import timerRouter from './routes/api/timer';
import relaysRouter from './routes/api/relays';
import { subscribe } from './routes/sse';
import settingsRouter from './routes/api/settings';
import authRouter from './routes/api/auth';
import playbackRouter from './routes/api/playback';
import serverRouter from './routes/api/server';

export const app = express();
export const server = Server(app);
export const wsApp = expressWs(app,server, {leaveRouterUntouched: false});

// view engine setup
/*global __dirname, require*/
app.set('views', join(__dirname, '../views'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/dist', express.static(join(__dirname, '../dist')));
app.use(cors());

app.use('/api/alarms', alarmsRouter);
app.use('/api/timer', timerRouter);
app.use('/api/relays', relaysRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/auth', authRouter);
app.use('/api/playback', playbackRouter);
app.use('/api/server', serverRouter);

app.use('/sse', cors(), subscribe);

app.use(/\/api.*/, function(req, res, next) {
  next(createError(404));
})

app.use('*', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//export default app;
