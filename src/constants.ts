export const DEF_HEADER = {
  'content-type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Max-Age': 2592000,
};

export const DEF_ERROR = JSON.stringify({ statusCode: 500, message: 'Server error' });

export const WINNERS_DB_KEY = 'sw_winners';
