import http from 'http';
import 'dotenv/config';
import * as redis from 'redis';
import { DEF_HEADER, WINNERS_DB_KEY } from './constants';
import { WinnerData } from './interfaces';

const PORT = process.env.PORT || 8000;
const REDIS_PORT = parseInt(process.env.REDIS_PORT as string, 10) || 11799;
const REDIS_ADDRESS = process.env.REDIS_ADDRESS || '';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';

const client = redis.createClient({
  socket: {
    host: REDIS_ADDRESS,
    port: REDIS_PORT,
  },
  password: REDIS_PASSWORD,
});

const runRedisClient = async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error(`Error ${err}`);
  }
};

runRedisClient();

client.on('error', (err) => {
  console.error(`Error ${err}`);
});

export const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/sw' && (req.method === 'GET' || req.method === 'POST')) {
      if (req.method === 'GET') {
        const winnersArr = await client.get(WINNERS_DB_KEY);
        const winnersArrParsed: WinnerData[] = JSON.parse(winnersArr || '[]');
        res.writeHead(200, DEF_HEADER);
        res.end(
          JSON.stringify({
            statusCode: 200,
            content: winnersArrParsed,
          })
        );
      } else if (req.method === 'POST') {
        let winner = '';
        req.on('data', async (data) => {
          winner += data.toString();
          const winnersArr = await client.get(WINNERS_DB_KEY);
          let winnersArrParsed: WinnerData[] = JSON.parse(winnersArr || '[]');
          const winnerParsed: WinnerData = JSON.parse(winner);
          const ind = winnersArrParsed.findIndex((i) => i.name === winnerParsed.name);
          if (ind !== -1) {
            if (winnerParsed.score > winnersArrParsed[ind].score) {
              winnersArrParsed[ind] = { ...winnerParsed };
              winnersArrParsed.sort((a, b) => b.score - a.score);
            }
          } else {
            winnersArrParsed = [...winnersArrParsed, winnerParsed]
              .sort((a, b) => b.score - a.score)
              .slice(0, 10);
          }
          await client.set(WINNERS_DB_KEY, JSON.stringify(winnersArrParsed));
        });

        res.writeHead(201, DEF_HEADER);
        res.end(JSON.stringify({ statusCode: 201 }));
      }
    } else {
      res.writeHead(404, DEF_HEADER);
      res.end(JSON.stringify({ statusCode: 404, message: 'Not found' }));
    }
  } catch (err) {
    console.error(err);
  }
});

server.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
