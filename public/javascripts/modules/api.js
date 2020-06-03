import { key, secret } from './credentials.js';

export const getToken = async (key, secret) => {
  const response = await fetch('https://api.petfinder.com/v2/oauth2/token', {
    method: 'POST',
    body:
      'grant_type=client_credentials&client_id=' +
      key +
      '&client_secret=' +
      secret,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.json();
};

const fetchAnimals = async (token) => {
  const listUrl = new URL('https://api.petfinder.com/v2/animals');
  const listParams = {
    type: 'cat',
    color: 'black',
    location: 'Los Angeles, CA',
  };

  listUrl.search = new URLSearchParams(listParams).toString();
  const response = await fetch(listUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const getAnimals = async () => {
  const token = await getToken(key, secret);
  const response = await fetchAnimals(token.access_token);

  return response.animals.filter((animal) => animal.photos[0] != undefined);
};
