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
import usersRouter from './routes/api/users';
import playerRouter from './routes/api/player';
import pandoraRouter from './routes/api/pandora';
import relaysRouter from './routes/api/relays';
import { subscribe } from './routes/sse';

export const app = express();
export const server = Server(app);
export const wsApp = expressWs(app,server, {leaveRouterUntouched: false});

// view engine setup
app.set('views', join(__dirname, '../views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/dist', express.static(join(__dirname, '../dist')));
app.use('/', express.static(join(__dirname, '../dist')));
app.use(cors());

app.use('/', indexRouter);

app.use('/api/users', usersRouter);
app.use('/api/player', playerRouter);
app.use('/api/pandora', pandoraRouter);
app.use('/api/relays', relaysRouter);

app.use('/sse', cors(), subscribe);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//export default app;
