'use strict';

var TOTAL_ADS = 8;
var menu = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var adTemplate = document.querySelector('template').content.querySelector('.map__card');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var popupPhoto = document.querySelector('.popup__photo');
var offersOptions = {
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
var avatarsList = [];
var adsList = [];
var ad = adTemplate.cloneNode(true);

var getAvatars = function () {
  for (var i = 0; i < 8; i++) {
    avatarsList[i].src = 'img/avatars/user' + i + '.png';
  }
};

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var randomArrSort = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

var createFeaturesSort = function () {
  var featuresList = [];
  for (var i = 0; i < offersOptions.FEATURES.length; i++) {
    featuresList[i] = offersOptions.FEATURES[i];
  }
  return featuresList.sort(randomArrSort).splice(0, getRandom(0, offersOptions.FEATURES.length));
}

var createPhotosSort = function () {
  var photosList = [];
  for (var i = 0; i < offersOptions.PHOTOS.length; i++) {
    photosList[i] = offersOptions.PHOTOS[i];
  }
  return photosList.sort(randomArrSort).splice(0, getRandom(0, offersOptions.PHOTOS.length));
}

var getAdItem = function (i) {
  var adItem = {};
  getAvatars();
  adItem.author.avatar = avatarsList[i];
  adItem.offer.title = offersOptions.TITLES[i];
  adItem.offer.price = getRandom(offersOptions.PRICE.min, offersOptions.PRICE.max);
  adItem.offer.type = offersOptions.TYPES[i];
  adItem.offer.rooms = getRandom(offersOptions.ROOMS.min, offersOptions.ROOMS.max);
  adItem.offer.guests = getRandom(offersOptions.GUESTS.min, offersOptions.GUESTS.max);
  adItem.offer.checkin = offersOptions.CHECKINS[getRandom(0, offersOptions.CHECKINS.length)];
  adItem.offer.checkout = offersOptions.CHECKOUTS[getRandom(0, offersOptions.CHECKOUTS.length)];
  adItem.offer.features = createFeaturesSort();
  adItem.offer.description = '';
  adItem.offer.photos = createPhotosSort();
  adItem.location.x = getRandom(offersOptions.LOCATION.X.MIN, offersOptions.LOCATION.X.MAX);
  adItem.location.y = getRandom(offersOptions.LOCATION.Y.MIN, offersOptions.LOCATION.Y.MAX);
  adItem.offer.address = adItem[i].LOCATION.X + ', ' + adItem[i].LOCATION.Y;
  return adItem;
}

var getAdsList = function () {
  for (var i = 0; i < TOTAL_ADS; i++) {
    adsList[i] = getAdItem(i);
  }
};

menu.classList.remove('map--faded');

var createPin = function (i) {
  var pinItem = mapPinTemplate.cloneNode(true);
  getAdsList();
  pinItem.content.querySelector('img').src = adsList[i].author.avatar;
  pinItem.style.left = adsList[i].LOCATION.Y + 'px';
  pinItem.style.top = adsList[i].LOCATION.X + 'px';
  pinItem.content.querySelector('img').alt = adsList[i].offer.title;
  return pinItem;
};

var createPinsFragment = function () {
  var pinsFragment = document.createDocumentFragment();
  for (var i = 0; i < TOTAL_ADS; i++) {
    pinsFragment.appendChild(createPin(i));
  }
  return pinsFragment;
};

mapPins.appendChild(createPinsFragment());

var createPopupPhotos = function (i) {
  var popupPhotoFragment = document.createDocumentFragment();
  getAdsList();
  for (var i = 0; i < adsList[i].offer.PHOTOS.length; i++) {
    ad.appendChild(popupPhoto).src = adsList[i].offer.PHOTOS[i];
    popupPhotoFragment.appendChild(ad.appendChild(popupPhoto));
  }
  return popupPhotoFragment;
};

var createAd = function (i) {
  getAdsList();
  ad.querySelector('.map__card img').src.textContent = adsList[i].author.avatar;
  ad.querySelector('.popup__title').textContent = adsList[i].offer.title;
  ad.querySelector('.popup__text--PRICE').innerHTML = adsList[i].offer.PRICE + '&#x20bd;<span>/ночь</span>';
  ad.querySelector('.popup__type').textContent = adsList[i].offer.type;
  ad.querySelector('.popup__text--capacity').textContent = adsList[i].offer.ROOMS + ' комнаты для ' + adsList[i].offer.GUESTS + ' гостей';
  ad.querySelector('.popup__text--time').textContent = 'Заезд после ' + adsList[i].offer.checkin + ', выезд до ' + adsList[i].offer.checkout;
  ad.querySelector('.popup__features').innerHTML = '';
  // ad.querySelector('.popup__features').appendChild('li').className = '';
  ad.querySelector('.popup__description').textContent = adsList[i].offer.description;
  createPopupPhotos(i);
  return ad;
};

mapFiltersContainer.insertAdjacentHTML('afterbegin', createAd(0));
