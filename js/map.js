'use strict';

var totalAds = 8;
var menu = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var adTemplate = document.querySelector('template').content.querySelector('.map__card');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var popupPhoto = document.querySelector('.popup__photo');
var offersOptions = {
  titles: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
  types: ['palace', 'flat', 'house', 'bungalo'],
  checkins: ['12:00', '13:00', '14:00'],
  checkouts: ['12:00', '13:00', '14:00'],
  features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  photos: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
  guests: {
    min: 1,
    max: 15
  },
  rooms: {
    min: 1,
    max: 5
  },
  price: {
    min: 1000,
    max: 1000000
  },
  location: {
    x: {
      min: 300,
      max: 900
    },
    y: {
      min: 130,
      max: 630
    }
  }
};

var getAvatars = function () {
  var avatarsList = [];
  for (var i = 0; i < 8; i++) {
    avatarsList[i] = 'img/avatars/user' + i + '.png';
  }
  return avatarsList;
};

getAvatars();

var getRandomMax = function (max) {
  return Math.floor(Math.random() * Math.floor(max));
};

var getRandomMinMax = function (min, max) {
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

var getAdsList = function () {
  var adsList = [];
  for (var adsItemNum = 0; adsItemNum < totalAds; adsItemNum++) {
    adsList[adsItemNum].author.avatar = avatarsList[adsItemNum];
    adsList[adsItemNum].offer.title = offersOptions.titles[adsItemNum];
    adsList[adsItemNum].offer.price = getRandomMinMax(offersOptions.price.min, offersOptions.price.max);
    adsList[adsItemNum].offer.type = offersOptions.types[adsItemNum];
    adsList[adsItemNum].offer.rooms = getRandomMinMax(offersOptions.rooms.min, offersOptions.rooms.max);
    adsList[adsItemNum].offer.guests = getRandomMinMax(offersOptions.guests.min, offersOptions.guests.max);
    adsList[adsItemNum].offer.checkin = offersOptions.checkins[getRandomMax(offersOptions.checkins.length)];
    adsList[adsItemNum].offer.checkout = offersOptions.checkouts[getRandomMax(offersOptions.checkouts.length)];
    adsList[adsItemNum].offer.features = offersOptions.features.sort(randomArrSort).splice(0, getRandomMax(offersOptions.features.length));
    adsList[adsItemNum].offer.description = '';
    adsList[adsItemNum].offer.photos = offersOptions.photos.sort(randomArrSort).splice(0, getRandomMax(offersOptions.photos.length));
    adsList[adsItemNum].location.x = getRandomMinMax(location.x.min, location.x.max);
    adsList[adsItemNum].location.y = getRandomMinMax(location.y.min, location.y.max);
  }
  return adsList;
};

getAdsList();

menu.classList.remove('map--faded');

var createPin = function (i) {
  var pinItem = mapPinTemplate.cloneNode(true);
  pinItem.content.querySelector('img').src.textcontent = adsList[i].author.avatar;
  pinItem.style.textcontent = 'left: ' + adsList[i].location.y + 'px; top: ' + adsList[i].location.x + 'px;';
  pinItem.content.querySelector('img').alt.textcontent = adsList[i].offer.title;
  return pinItem;
};

var createPinList = function (totalPins) {
  var pinsFragment = document.createDocumentFragment();
  for (var pinNum = 0; pinNum < totalPins; pinNum++) {
    pinsFragment.appendChild(createPin(pinNum));
  }
  return pinsFragment;
};

mapPins.appendChild(createPinList(totalAds));

var createFeatures = function () {
  ad.content.querySelector('.popup__features').removeChild();
  var featuresFragment = document.createDocumentFragment();
  for (var featuresNum = 0; featuresNum < totalAds; featuresNum++) {
    ad.content.querySelector('.popup__features').content.querySelector('li').className = 'popup__feature ' + 'popup__feature--' + adsList[adsItemNum].offer.features[i];
    featuresFragment.appendChild(ad.content.querySelector('.popup__features').content.querySelector('li'));
  }
};

var createAd = function (i) {
  var ad = adTemplate.cloneNode(true);
  ad.content.querySelector('.map__card img').src.textContent = adsList[i].author.avatar;
  ad.content.querySelector('.popup__title').textContent = adsList[i].offer.title;
  ad.content.querySelector('.popup__text--price').innerHTML = adsList[i].offer.price + '&#x20bd;<span>/ночь</span>';
  ad.content.querySelector('.popup__type').textContent = adsList[i].offer.type;
  ad.content.querySelector('.popup__text--capacity').textContent = adsList[i].offer.rooms + ' комнаты для ' + adsList[i].offer.guests + ' гостей';
  ad.content.querySelector('.popup__text--time').textContent = 'Заезд после ' + adsList[i].offer.checkin + ', выезд до ' + adsList[i].offer.checkout;
  ad.content.querySelector('.popup__features').removeChild();
  ad.content.querySelector('.popup__features').appendChild(featuresFragment);
  ad.content.querySelector('.popup__description').textContent = adsList[i].offer.description;
  createPopupPhoto(i);
  return ad;
};

var createPopupPhoto = function (i) {
  var popupPhotoFragment = document.createDocumentFragment();
  for (var popupPhotoNum = 0; popupPhotoNum < adsList[i].offer.photos.length; popupPhotoNum++) {
    ad.appendChild(popupPhoto).src = adsList[i].offer.photos[popupPhotoNum];
    popupPhotoFragment.appendChild(ad.appendChild(popupPhoto));
  }
  return popupPhotoFragment;
};

mapFiltersContainer.insertAdjacentHTML('afterbegin', createAd(0));

// var createAds = function () {
//   var adsFragment = document.createDocumentFragment();
//   for (var createAdsItem = 0; createAdsItem < totalPins; createAdsItem++) {
//     adsFragment.appendChild(createAd(createAdsItem));
//   }
// }
