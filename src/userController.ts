/* eslint-disable consistent-return */
import { IncomingMessage, ServerResponse } from 'http';
import { DEF_HEADER, DEF_ERROR } from './constants';
import { UserData } from './interfaces';
import * as User from './userModel';

export const getUsers = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const users = await User.getAll();
    res.writeHead(200, DEF_HEADER);
    res.end(JSON.stringify(users));
  } catch (err) {
    console.error(err);
    res.writeHead(500, DEF_HEADER);
    res.end(DEF_ERROR);
  }
};

export const getUser = async (req: IncomingMessage, res: ServerResponse, id: string) => {
  try {
    const user = await User.getById(id);
    if (!user) {
      res.writeHead(404, DEF_HEADER);
      res.end(JSON.stringify({ statusCode: 404, message: 'User not found' }));
    } else {
      res.writeHead(200, DEF_HEADER);
      res.end(JSON.stringify(user));
    }
  } catch (err) {
    console.error(err);
    res.writeHead(500, DEF_HEADER);
    res.end(DEF_ERROR);
  }
};

function getUsersData(req: IncomingMessage) {
  return new Promise((resolve, reject) => {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        resolve(body);
      });
    } catch (err) {
      console.error(err);
    }
  });
}

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const body = await getUsersData(req);
    const { username, age, hobbies }: UserData = JSON.parse(body as string);
    if (!username || !age || !hobbies) {
      res.writeHead(400, DEF_HEADER);
      return res.end(
        JSON.stringify({
          statusCode: 400,
          message: 'Request body does not contain required fields',
        })
      );
    }
    const user = {
      username,
      age,
      hobbies,
    };

    const newUser = await User.create(user);
    res.writeHead(201, DEF_HEADER);
    return res.end(JSON.stringify(newUser));
  } catch (err) {
    console.error(err);
    res.writeHead(500, DEF_HEADER);
    res.end(DEF_ERROR);
  }
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse, id: string) => {
  try {
    const userGet = await User.getById(id);

    if (!userGet) {
      res.writeHead(404, DEF_HEADER);
      res.end(JSON.stringify({ statusCode: 404, message: 'User not found' }));
    } else {
      const body = await getUsersData(req);
      const { username, age, hobbies }: UserData = JSON.parse(body as string);

      if (!username || !age || !hobbies) {
        res.writeHead(400, DEF_HEADER);
        return res.end(
          JSON.stringify({
            statusCode: 400,
            message: 'Request body does not contain required fields',
          })
        );
      }
      const userInfo = {
        username,
        age,
        hobbies,
      };

      const updUser = await User.update(id, userInfo);
      res.writeHead(200, DEF_HEADER);
      return res.end(JSON.stringify(updUser));
    }
  } catch (err) {
    console.error(err);
    res.writeHead(500, DEF_HEADER);
    res.end(DEF_ERROR);
  }
};

export const deleteUser = async (req: IncomingMessage, res: ServerResponse, id: string) => {
  try {
    const user = await User.getById(id);
    if (!user) {
      res.writeHead(404, DEF_HEADER);
      res.end(JSON.stringify({ statusCode: 404, message: 'User not found' }));
    } else {
      await User.remove(id);
      res.writeHead(204, DEF_HEADER);
      res.end();
    }
  } catch (err) {
    console.error(err);
    res.writeHead(500, DEF_HEADER);
    res.end(DEF_ERROR);
  }
};
