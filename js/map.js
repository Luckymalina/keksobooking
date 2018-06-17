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

var adsArr = [];
var template = document.querySelector('template');
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapPinTemplate = template.content.querySelector('.map__pin');
var mapPinsFragment = document.createDocumentFragment();
var adTemplate = template.content.querySelector('.map__card');
var popupPhoto = template.content.querySelector('.popup__photo');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var typesMap = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

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

var createAdObj = function (i) {
  var adObj = {
    author: {
      avatar: (i < 10) ? 'img/avatars/user0' + (i + 1) + '.png' : 'img/avatars/user' + (i + 1) + '.png'
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

for (var l = 0; l < TOTAL_ADS; l++) {
  adsArr[l] = createAdObj(l);
}

map.classList.remove('map--faded');

var createPinItem = function (i) {
  var pinItem = mapPinTemplate.cloneNode(true);
  pinItem.querySelector('img').src = adsArr[i].author.avatar;
  pinItem.style.left = adsArr[i].location.x + 'px';
  pinItem.style.top = adsArr[i].location.y + 'px';
  pinItem.querySelector('img').alt = adsArr[i].offer.title;
  return pinItem;
};

for (var j = 0; j < TOTAL_ADS; j++) {
  mapPinsFragment.appendChild(createPinItem(j));
}

mapPins.appendChild(mapPinsFragment);

var createFeatureFragment = function (i) {
  var featureFragment = document.createDocumentFragment();
  for (var k = 0; k < adsArr[i].offer.features.length; k++) {
    var featureItem = document.createElement('li');
    featureItem.className = 'popup__feature popup__feature--' + adsArr[i].offer.features[k];
    featureFragment.appendChild(featureItem);
  }
  return featureFragment;
};

var createPhotosFragment = function (i) {
  var photosFragment = document.createDocumentFragment();
  for (var t = 0; t < adsArr[i].offer.photos.length; t++) {
    var popupPhotoItem = popupPhoto.cloneNode(true);
    popupPhotoItem.src = adsArr[i].offer.photos[t];
    photosFragment.appendChild(popupPhotoItem);
  }
  return photosFragment;
};

var createAd = function (i) {
  var ad = adTemplate.cloneNode(true);
  ad.querySelector('.map__card img').src = adsArr[i].author.avatar;
  ad.querySelector('.popup__title').textContent = adsArr[i].offer.title;
  ad.querySelector('.popup__text--price').textContent = adsArr[i].offer.price + ' ₽/ночь';
  ad.querySelector('.popup__type').textContent = typesMap[adsArr[i].offer.type];
  ad.querySelector('.popup__text--capacity').textContent = adsArr[i].offer.rooms + ' комнаты для ' + adsArr[i].offer.guests + ' гостей';
  ad.querySelector('.popup__text--time').textContent = 'Заезд после ' + adsArr[i].offer.checkin + ', выезд до ' + adsArr[i].offer.checkout;
  ad.querySelector('.popup__features').innerHTML = '';
  ad.querySelector('.popup__features').appendChild(createFeatureFragment(i));
  ad.querySelector('.popup__description').textContent = adsArr[i].offer.description;
  ad.querySelector('.popup__photos').removeChild(ad.querySelector('.popup__photo'));
  ad.querySelector('.popup__photos').appendChild(createPhotosFragment(i));
  return ad;
};

mapFiltersContainer.insertAdjacentElement('beforebegin', createAd(0));
