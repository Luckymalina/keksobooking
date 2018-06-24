'use strict';

var TOTAL_ADS = 8;
var OffersOptions = {
  TITLES: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  TYPES: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],
  CHECKINS: [
    '12:00',
    '13:00',
    '14:00'
  ],
  CHECKOUTS: [
    '12:00',
    '13:00',
    '14:00'
  ],
  FEATURES: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],
  PHOTOS: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ],
  GUESTS: {
    MIN: 1,
    MAX: 15
  },
  ROOMS: {
    MIN: 1,
    MAX: 5
  },
  PRICE: {
    MIN: 1000,
    MAX: 1000000
  },
  LOCATION: {
    X: {
      MIN: 300,
      MAX: 900
    },
    Y: {
      MIN: 130,
      MAX: 630
    }
  }
};
var PIN_SIZE = {
  WIDTH: 50,
  HEIGHT: 70
};
var ESC_KEYCODE = 27;

var adsArr = [];
var template = document.querySelector('template');
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapPinTemplate = template.content.querySelector('.map__pin');
var adTemplate = template.content.querySelector('.map__card');
var popupPhoto = template.content.querySelector('.popup__photo');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var mapPinMain = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = document.querySelectorAll('.ad-form__element');
var adFormHeader = document.querySelector('.ad-form-header');
var addressInput = document.querySelector('#address');
var adFormInputs = document.querySelectorAll('input');
var success = document.querySelector('.success');
var housingTypeInput = document.querySelector('#housing-type');
var priceInput = document.querySelector('#price');
var timeInInput = document.querySelector('#timein');
var timeOutInput = document.querySelector('#timeout');
var mapPinsItems = document.querySelectorAll('.map__pin');
var mapCard = document.querySelector('.map__card');
var roomNumberInput = document.querySelector('#room_number');
var capacityInput = document.querySelector('#capacity');
var isActivate = false;
var typesMap = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

addressInput.value = (mapPinMain.offsetTop - mapPinMain.offsetHeight / 2) + ', ' + (mapPinMain.offsetLeft - mapPinMain.offsetWidth / 2);

adFormHeader.disabled = true;

for (var l = 0; l < adFormFieldsets.length; l++) {
  adFormFieldsets[l].disabled = true;
}

var getRandomFromInterval = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var randomShuffleArr = function (arr) {
  var copyArr = arr.slice(0);
  for (var i = copyArr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = copyArr[i];
    copyArr[i] = copyArr[j];
    copyArr[j] = temp;
  }
  return copyArr;
};

var randomCutArr = function (arr) {
  var copyArr = arr.slice(0);
  var length = getRandomFromInterval(0, copyArr.length);
  copyArr.slice(0, length);
  return copyArr;
};

var onEscDown = function (evt, popup) {
  if (evt.keyCode === ESC_KEYCODE) {
    popup.remove();
  }
};

var createAdObj = function (i) {
  var adObj = {
    author: {
      avatar: 'img/avatars/user' + (i < 10 ? '0' : '') + (i + 1) + '.png'
    },
    offer: {
      title: OffersOptions.TITLES[i],
      price: getRandomFromInterval(OffersOptions.PRICE.MIN, OffersOptions.PRICE.MAX),
      type: OffersOptions.TYPES[getRandomFromInterval(0, OffersOptions.TYPES.length - 1)],
      rooms: getRandomFromInterval(OffersOptions.ROOMS.MIN, OffersOptions.ROOMS.MAX),
      guests: getRandomFromInterval(OffersOptions.GUESTS.MIN, OffersOptions.GUESTS.MAX),
      checkin: OffersOptions.CHECKINS[getRandomFromInterval(0, OffersOptions.CHECKINS.length - 1)],
      checkout: OffersOptions.CHECKOUTS[getRandomFromInterval(0, OffersOptions.CHECKOUTS.length - 1)],
      features: randomCutArr(randomShuffleArr(OffersOptions.FEATURES)),
      description: '',
      photos: randomShuffleArr(OffersOptions.PHOTOS)
    },
    location: {
      x: getRandomFromInterval(OffersOptions.LOCATION.X.MIN, OffersOptions.LOCATION.X.MAX) - PIN_SIZE.WIDTH / 2,
      y: getRandomFromInterval(OffersOptions.LOCATION.Y.MIN, OffersOptions.LOCATION.Y.MAX) - PIN_SIZE.HEIGHT
    }
  };
  adObj.offer.address = adObj.location.x + ', ' + adObj.location.y;
  return adObj;
};

for (var k = 0; k < TOTAL_ADS; k++) {
  adsArr[k] = createAdObj(k);
}

var createPinMarkup = function (pinData) {
  var pinItem = mapPinTemplate.cloneNode(true);
  pinItem.querySelector('img').src = pinData.author.avatar;
  pinItem.style.left = pinData.location.x + 'px';
  pinItem.style.top = pinData.location.y + 'px';
  pinItem.querySelector('img').alt = pinData.offer.title;
  pinItem.addEventListener('click', function () {
    var mapCardRemovable = map.querySelector('.map__card');
    if (mapCardRemovable) {
      mapCardRemovable.remove();
    }
    createAd(pinData);
    document.addEventListener('keydown', onEscDown);
  });
  return pinItem;
};

var renderPinsMarkup = function (pinsData) {
  var mapPinsFragment = document.createDocumentFragment();
  for (var j = 0; j < pinsData.length; j++) {
    mapPinsFragment.appendChild(createPinMarkup(pinsData[j]));
  }
  mapPins.appendChild(mapPinsFragment);
};

var createFeatureFragment = function (adData) {
  var featureFragment = document.createDocumentFragment();
  for (var j = 0; j < adData.offer.features.length; j++) {
    var featureItem = document.createElement('li');
    featureItem.className = 'popup__feature popup__feature--' + adData.offer.features[j];
    featureFragment.appendChild(featureItem);
  }
  return featureFragment;
};

var createPhotosFragment = function (adData) {
  var photosFragment = document.createDocumentFragment();
  for (var t = 0; t < adData.offer.photos.length; t++) {
    var popupPhotoItem = popupPhoto.cloneNode(true);
    popupPhotoItem.src = adData.offer.photos[t];
    photosFragment.appendChild(popupPhotoItem);
  }
  return photosFragment;
};

var createAd = function (adData) {
  var ad = adTemplate.cloneNode(true);
  ad.querySelector('.map__card img').src = adData.author.avatar;
  ad.querySelector('.popup__title').textContent = adData.offer.title;
  ad.querySelector('.popup__text--price').textContent = adData.offer.price + ' ₽/ночь';
  ad.querySelector('.popup__type').textContent = typesMap[adData.offer.type];
  ad.querySelector('.popup__text--capacity').textContent = adData.offer.rooms + ' комнаты для ' + adData.offer.guests + ' гостей';
  ad.querySelector('.popup__text--time').textContent = 'Заезд после ' + adData.offer.checkin + ', выезд до ' + adData.offer.checkout;
  ad.querySelector('.popup__features').innerHTML = '';
  ad.querySelector('.popup__features').appendChild(createFeatureFragment(adData));
  ad.querySelector('.popup__description').textContent = adData.offer.description;
  ad.querySelector('.popup__photos').removeChild(ad.querySelector('.popup__photo'));
  ad.querySelector('.popup__photos').appendChild(createPhotosFragment(adData));
  mapFiltersContainer.insertAdjacentElement('beforebegin', ad);
  var closeAd = ad.querySelector('.popup__close');
  closeAd.addEventListener('click', function () {
    ad.remove();
    document.removeEventListener('click', onEscDown);
  });
  return ad;
};

var activationForm = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].removeAttribute('disabled', 'disabled');
  }
  adFormHeader.disabled = false;
};

var deactivationForm = function () {
  success.classList.remove('hidden');
  success.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      success.classList.add('hidden');
    }
  });
  document.addEventListener('click', function () {
    success.classList.add('hidden');
  });
  for (var t = 0; t < adFormInputs.length; t++) {
    adFormInputs[t].value = null;
  }
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].disabled = true;
  }
  adFormHeader.disabled = true;
  for (var j = 0; j < mapPinsItems.length; j++) {
    mapPinsItems[j].remove();
  }
  mapCard.remove();
  mapPinMain.offsetTop = '375px';
  mapPinMain.offsetLeft = '570px';
  addressInput.value = (mapPinMain.offsetTop - mapPinMain.offsetHeight / 2) + ', ' + (mapPinMain.offsetLeft - mapPinMain.offsetWidth / 2);
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
};

var fillAddress = function () {
  addressInput.value = (mapPinMain.offsetTop + PIN_SIZE.HEIGHT) + ', ' + (mapPinMain.offsetLeft + PIN_SIZE.WIDTH / 2);
};

mapPinMain.addEventListener('mouseup', function () {
  if (!isActivate) {
    activationForm();
    renderPinsMarkup(adsArr);
  }
  fillAddress();
});

adForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
  deactivationForm();
});

housingTypeInput.addEventListener('change', function () {
  switch (housingTypeInput.value) {
    case typesMap.flat:
      priceInput.min = 1000;
      priceInput.placeholder = '1000';
      break;
    case typesMap.house:
      priceInput.min = 5000;
      priceInput.placeholder = '5000';
      break;
    case typesMap.palace:
      priceInput.min = 10000;
      priceInput.placeholder = '10000';
      break;
    default:
      priceInput.min = 0;
      priceInput.placeholder = '5000';
  }
});

timeInInput.addEventListener('change', function () {
  switch (timeInInput.value) {
    case '12:00':
      timeOutInput.value = '12:00';
      break;
    case '13:00':
      timeOutInput.value = '13:00';
      break;
    case '14:00':
      timeOutInput.value = '14:00';
      break;
  }
});

timeOutInput.addEventListener('change', function () {
  switch (timeOutInput.value) {
    case '12:00':
      timeInInput.value = '12:00';
      break;
    case '13:00':
      timeInInput.value = '13:00';
      break;
    case '14:00':
      timeInInput.value = '14:00';
      break;
  }
});

var roomsValues = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0]
};

var disableСapacityOptions = function (inputValue) {
  var capacityOptions = capacityInput.querySelectorAll('option');
  for (var t = 0; t < capacityOptions.length; t++) {
    capacityOptions[t].disabled = true;
  }
  for (var i = 0; i < roomsValues[inputValue].length; i++) {
    capacityInput.querySelector('option' + '[value="' + roomsValues[inputValue][i] + '"]').disabled = false;
    capacityInput.value = roomsValues[inputValue][i];
  }
};

roomNumberInput.addEventListener('change', function () {
  disableСapacityOptions(roomNumberInput.value);
});
