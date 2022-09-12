import { usersArr } from './data';
import { v4 as uuid } from 'uuid';
import { UserData } from './interfaces';

export const getAll = () => {
  return new Promise((resolve, reject) => {
    resolve(usersArr);
  });
};

export const getById = (id: string) => {
  return new Promise((resolve, reject) => {
    const user = usersArr.find(u => u.id === id);
    resolve(user);
  });
};

export const create = (user: UserData) => {
  return new Promise((resolve, reject) => {
    const newUser = { id: uuid(), ...user };
    usersArr.push(newUser);
    resolve(newUser);
  });
};

export const update = (id: string, user: UserData) => {
  return new Promise((resolve, reject) => {
    const uIndex = usersArr.findIndex(u => u.id === id);
    usersArr[uIndex] = { id, ...user };
    resolve(usersArr[uIndex]);
  });
};

export const remove = (id: string) => {
  return new Promise((resolve, reject) => {
    const uIndex = usersArr.findIndex(u => u.id === id);
    usersArr.splice(uIndex, 1);
    resolve(id);
  });
};
