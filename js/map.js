'use strict';

(function () {
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
  var DragLimit = {
    X: {
      MIN: 0,
      MAX: 1200
    },
    Y: {
      MIN: 130,
      MAX: 630
    }
  };

  var adsArr = [];
  var template = document.querySelector('template');
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mapPinTemplate = template.content.querySelector('.map__pin');
  var adTemplate = template.content.querySelector('.map__card');
  var popupPhoto = template.content.querySelector('.popup__photo');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapCard = document.querySelector('.map__card');
  var typesMap = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };
  var isActivate = false;

  var createAdObj = function (i) {
    var adObj = {
      author: {
        avatar: 'img/avatars/user' + (i < 10 ? '0' : '') + (i + 1) + '.png'
      },
      offer: {
        title: OffersOptions.TITLES[i],
        price: window.utils.getRandomFromInterval(OffersOptions.PRICE.MIN, OffersOptions.PRICE.MAX),
        type: OffersOptions.TYPES[window.utils.getRandomFromInterval(0, OffersOptions.TYPES.length - 1)],
        rooms: window.utils.getRandomFromInterval(OffersOptions.ROOMS.MIN, OffersOptions.ROOMS.MAX),
        guests: window.utils.getRandomFromInterval(OffersOptions.GUESTS.MIN, OffersOptions.GUESTS.MAX),
        checkin: OffersOptions.CHECKINS[window.utils.getRandomFromInterval(0, OffersOptions.CHECKINS.length - 1)],
        checkout: OffersOptions.CHECKOUTS[window.utils.getRandomFromInterval(0, OffersOptions.CHECKOUTS.length - 1)],
        features: window.utils.randomCutArr(window.utils.randomShuffleArr(OffersOptions.FEATURES)),
        description: '',
        photos: window.utils.randomShuffleArr(OffersOptions.PHOTOS)
      },
      location: {
        x: window.utils.getRandomFromInterval(OffersOptions.LOCATION.X.MIN, OffersOptions.LOCATION.X.MAX) - PIN_SIZE.WIDTH / 2,
        y: window.utils.getRandomFromInterval(OffersOptions.LOCATION.Y.MIN, OffersOptions.LOCATION.Y.MAX) - PIN_SIZE.HEIGHT
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
      document.addEventListener('keydown', window.utils.onEscDown);
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
      document.removeEventListener('click', window.utils.onEscDown);
    });
    return ad;
  };

  window.mapPinMain.addEventListener('mouseup', function () {
    if (!isActivate) {
      window.map.activation();
      window.form.activation();
      renderPinsMarkup(adsArr);
    }
    window.form.fillAddress();
  });

  window.mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      var mapPinMainPosition = {
        x: window.mapPinMain.offsetLeft - shift.x,
        y: window.mapPinMain.offsetTop - shift.y
      };
      var Border = {
        TOP: DragLimit.Y.MIN - window.mapPinMain.offsetHeight,
        BOTTOM: DragLimit.Y.MAX - window.mapPinMain.offsetHeight,
        LEFT: DragLimit.X.MIN,
        RIGHT: DragLimit.X.MAX - window.mapPinMain.offsetWidth
      };
      if (mapPinMainPosition.x >= Border.LEFT && mapPinMainPosition.x <= Border.RIGHT) {
        window.mapPinMain.style.left = mapPinMainPosition.x + 'px';
      }
      if (mapPinMainPosition.y >= Border.TOP && mapPinMainPosition.y <= Border.BOTTOM) {
        window.mapPinMain.style.top = mapPinMainPosition.y + 'px';
      }
      window.form.fillAddress();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.map = {
    getMapPinMainCoords: function () {
      var mapPinMainPosition = {
        x: window.mapPinMain.offsetLeft + Math.floor(window.mapPinMain.offsetWidth / 2),
        y: window.mapPinMain.offsetTop + window.mapPinMain.offsetHeight
      };
      return mapPinMainPosition;
    },
    activation: function () {
      map.classList.remove('map--faded');
    },
    deactivation: function () {
      var mapPinsItems = document.querySelectorAll('.map__pin:not(.map__pin--main)');
      if (mapCard) {
        mapCard.remove();
      }
      for (var j = 0; j < mapPinsItems.length; j++) {
        mapPinsItems[j].remove();
      }
      window.mapPinMain.top = '375px';
      window.mapPinMain.left = '570px';
      map.classList.add('map--faded');
    }
  };
})();
