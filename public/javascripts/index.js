(() => {
  const getToken = async (key, secret) => {
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

  const handleShow = (animal) => {
    let img;
    if (animal.photos[1]) {
      img = animal.photos[1].medium;
    } else {
      img = animal.photos[0].medium;
    }
    document.querySelector('.modal-header').textContent = `Meet ${animal.name}`;
    document.querySelector('.img-container').innerHTML = `<img src=${img} />`;
    document.querySelector(
      '.url-btn'
    ).innerHTML = `<a href=${animal.url} target="_blank" style="color: white">Meet on Petfinder</a> `;
    document.querySelector('.modal-desc').innerHTML = `
  
      <h3>Attributes</h3>
      <ul style="padding: 0; list-style-type: none">
        <li><strong>Breed:</strong><span> ${animal.breeds.primary}</span></li>
        <li><strong>Color:</strong><span> ${animal.colors.primary}</span></li>
        <li><strong>Gender:</strong><span> ${animal.gender}</span></li>
        <li><strong>Size:</strong><span> ${animal.size}</span></li>
        <li><strong>Declawed:</strong> <span>${
          animal.attributes.declawed ? 'Yes' : 'No'
        }</span></li>
        <li><strong>House Trained:</strong> <span>${
          animal.attributes.house_trained ? 'Yes' : 'No'
        }</span></li>
        <li><strong>Received Shots:</strong> <span>${
          animal.attributes.shots_current ? 'Yes' : 'No'
        }</span></li>
        <li><strong>Neutered:</strong> <span>${
          animal.attributes.spayed_neutered ? 'Yes' : 'No'
        }</span></li>
        <li><strong>Special Needs:</strong> <span>${
          animal.attributes.special_needs ? 'Yes' : 'No'
        }</span></li>
      </ul>
      `;
    $('#modal').modal('show');
    console.log(animal);
  };

  const setFilterButtonListeners = (btns, males, females, animals) => {
    Array.prototype.forEach.call(btns, (btn) => {
      btn.addEventListener('click', (evt) => {
        setActive(btns, btn);
        document.querySelector('#list').innerHTML = '';
        switch (evt.target.dataset.genderType) {
          case 'male':
            makeAnimalCards(males);
            break;
          case 'female':
            makeAnimalCards(females);
            break;
          default:
            makeAnimalCards(animals);
            break;
        }
      });
    });
  };

  const setActive = (collection, btn) => {
    Array.prototype.forEach.call(collection, (btn) => {
      btn.classList.remove('active');
    });
    btn.classList.add('active');
  };

  const makeAnimalCards = (animals) => {
    const app = document.querySelector('#list');
    const cardsContainer = document.createElement('div');
    cardsContainer.classList.add('ui', 'link', 'cards');
    app.append(cardsContainer);

    animals.map((animal) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.addEventListener('click', () => {
        handleShow(animal);
      });
      card.innerHTML = `
          <img src=${animal.photos[0].medium} height="260" style="background-size:contain">
          <div class="content">
            <div class="header">${animal.name}</div>
          </div>
          <div class="extra content">
          <span class="right floated star">
            <i class="star icon" onclick="handleFavorite(this)"></i>
            Favorite
          </span>`;
      cardsContainer.append(card);
    });
  };

  const createModal = () => {
    const modal = document.createElement('div');
    modal.classList.add('ui', 'modal', 'large');
    modal.id = 'modal';
    modal.innerHTML = `
      <i class="close icon"></i>
      <div class="header modal-header">
        Profile Picture
      </div>
      <div class="image content">
        <div class="ui medium image img-container"></div>
        <div class="description modal-desc"></div>
      </div>
      <div class="actions">
        <div class="ui violet button url-btn"></div>
      </div>`;
    document.querySelector('body').append(modal);
  };

  const stopSpinner = () => {
    document.getElementById('loader').classList.add('disabled');
    document.getElementById('dimmer').classList.remove('active');
  };
  const mainFunction = async () => {
    const key = '61kzMj4j2v9qbl0uKSVFhu5zDwo78gs7DpmzZim0bhS3VUGAI3';
    const secret = 'SxgikrMVJ7ROxf9KsnrJYmdpstlJZKkzSI9P52uh';

    let token = await getToken(key, secret);
    let response = await getAnimals(token.access_token);

    const animals = response.animals.filter(
      (animal) => animal.photos[0] != undefined
    );
    const males = animals.filter((animal) => animal.gender === 'Male');
    const females = animals.filter((animal) => animal.gender === 'Female');
    const btns = document.querySelectorAll('.ui.buttons > .ui.button');

    setFilterButtonListeners(btns, males, females, animals);
    makeAnimalCards(animals);
    createModal();
    stopSpinner();
  };

  mainFunction();
})();
