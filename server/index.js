const keys = require('./keys');

//express setup
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// postgress client setup

const { Pool } = require('pg');
const pgClient = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  database: keys.pgDatabase,
  user: keys.pgUser,
  password: keys.pgPassword,
});

pgClient.on('connect', client => {
  client
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err => console.error(err));
});

//Redis client setup

const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

//routes

app.get('/', (req, res) => {
  res.send('Hi from server');
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');

  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const index = req.body.index;
  if (index > 40) {
    return res.status(422).send('Index is too high');
  }
  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);

  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ working: true });
});

app.listen(5000, err => {
  console.log('listening on 5000');
});
