import http from 'http';
import 'dotenv/config';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { DEF_HEADER } from './constants';
import { getUsers, getUser, createUser, updateUser, deleteUser } from './userController';

const PORT = process.env.PORT || 3333;

export const server = http.createServer((req, res) => {
  if (req.url === '/api/users' || req.url === '/api/users/') {
    if (req.method === 'GET') {
      getUsers(req, res);
    }
    if (req.method === 'POST') {
      createUser(req, res);
    }
  } else if (req.url?.startsWith('/api/users/') && req.url.length > 11 && !req.url.split('/')[4]) {
    const id = req.url.split('/')[3];
    const validUuid = uuidValidate(id) && uuidVersion(id) === 4;

    if (!validUuid && (req.method === 'GET' || req.method === 'PUT' || req.method === 'DELETE')) {
      res.writeHead(400, DEF_HEADER);
      res.end(JSON.stringify({ statusCode: 400, message: 'User id is not valid' }));
    } else if (req.method === 'GET') {
      getUser(req, res, id);
    } else if (req.method === 'PUT') {
      updateUser(req, res, id);
    } else if (req.method === 'DELETE') {
      deleteUser(req, res, id);
    }
  } else {
    res.writeHead(404, DEF_HEADER);
    res.end(JSON.stringify({ statusCode: 404, message: 'Not found' }));
  }
});

server.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
