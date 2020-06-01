const key = '61kzMj4j2v9qbl0uKSVFhu5zDwo78gs7DpmzZim0bhS3VUGAI3';
const secret = 'SxgikrMVJ7ROxf9KsnrJYmdpstlJZKkzSI9P52uh';
let token;
let animals;
const getToken = async () => {
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

const getAnimals = async (token) => {
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

const handleFavorite = (icon) => {
  if (icon.classList.contains('active')) {
    icon.classList.remove('active');
  } else {
    icon.classList.add('active');
  }
};

// const mainFunction = async () => {
//   const result = await getToken();
//   return result;
// };

(async () => {
  token = await getToken();
  console.log(token);
  console.log('hello?');
  animals = await getAnimals(token.access_token);
  console.log('animals:', animals);
  var app = document.querySelector('#list');
  app.innerHTML =
    '<div class="ui link cards">' +
    animals.animals
      .filter((animal) => animal.photos[0] != undefined)
      .map(function (animal) {
        return ` <div class="card">
        <img src=${animal.photos[0].medium} height="260" style="background-size:contain">
        <div class="content">
          <div class="header">${animal.name}</div>
        </div>
        <div class="extra content">
          <span class="right floated star">
          <i class="star icon" onclick="handleFavorite(this)"></i>
            Favorite
          </span>
        </div>
      </div>
      `;
      })
      .join('') +
    '</div>';
})();
// token = mainFunction();
// console.log('token:', token);
// fetch('https://api.petfinder.com/v2/oauth2/token', {
//   method: 'POST',
//   body:
//     'grant_type=client_credentials&client_id=' +
//     key +
//     '&client_secret=' +
//     secret,
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//   },
// })
//   .then(function (resp) {
//     // Return the response as JSON
//     return resp.json();
//   })
//   .then(function (data) {
//     // Log the API data
//     token = data.access_token;
//   })
//   .catch(function (err) {
//     // Log any errors
//     console.log('something went wrong', err);
//   });

// console.log('token', token);

//  fetch('https://api.petfinder.com/v2/animals', {
//     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     mode: 'cors', // no-cors, *cors, same-origin
//     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     credentials: 'same-origin', // include, *same-origin, omit
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer '
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     redirect: 'follow', // manual, *follow, error
//     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//     body: JSON.stringify(data), // body data type must match "Content-Type" header
//   });
