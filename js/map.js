'use strict';

(function () {
  var PinSize = {
    WIDTH: 65,
    HEIGHT: 65,
  };
  var TAIL_HEIGHT = 16;
  var DEFAULT_MAIN_PIN_X = 601;
  var DEFAULT_MAIN_PIN_Y = 404;
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

  var template = document.querySelector('template');
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mapPinTemplate = template.content.querySelector('.map__pin');
  var adTemplate = template.content.querySelector('.map__card');
  var popupPhoto = template.content.querySelector('.popup__photo');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var mapCard = document.querySelector('.map__card');
  var mapPinMain = document.querySelector('.map__pin--main');
  var typesMap = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };
  var onMapPinMainMouseDown = function () {
    window.map.activate();
    window.form.activate();
    mapPinMain.removeEventListener('mousedown', onMapPinMainMouseDown);
  };

  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);

  var deactivateMap = function () {
    map.classList.add('map--faded');
    var mapPinsItems = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (mapCard) {
      mapCard.remove();
    }
    for (var j = 0; j < mapPinsItems.length; j++) {
      mapPinsItems[j].remove();
    }
    mapPinMain.style.top = DEFAULT_MAIN_PIN_Y - PinSize.HEIGHT / 2 + 'px';
    mapPinMain.style.left = DEFAULT_MAIN_PIN_X - PinSize.WIDTH / 2 + 'px';
    mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);
  };

  deactivateMap();

  var onLoadSuccess = function (adData) {
    renderPinsMarkup(adData);
  };

  var onLoadError = function (errorMessage) {
    window.utils.renderErrorMessage(errorMessage);
  };

  var activateMap = function () {
    window.backend.load(onLoadSuccess, onLoadError);
    map.classList.remove('map--faded');
  };

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

  mapPinMain.addEventListener('mousedown', function (evt) {
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
        x: mapPinMain.offsetLeft - shift.x,
        y: mapPinMain.offsetTop - shift.y
      };
      var Border = {
        TOP: DragLimit.Y.MIN - mapPinMain.offsetHeight - TAIL_HEIGHT,
        BOTTOM: DragLimit.Y.MAX - mapPinMain.offsetHeight - TAIL_HEIGHT,
        LEFT: DragLimit.X.MIN,
        RIGHT: DragLimit.X.MAX - mapPinMain.offsetWidth
      };
      if (mapPinMainPosition.x >= Border.LEFT && mapPinMainPosition.x <= Border.RIGHT) {
        mapPinMain.style.left = mapPinMainPosition.x + 'px';
      }
      if (mapPinMainPosition.y >= Border.TOP && mapPinMainPosition.y <= Border.BOTTOM) {
        mapPinMain.style.top = mapPinMainPosition.y + 'px';
      }
      var pinTailCoords = {
        x: mapPinMainPosition.x + Math.ceil(PinSize.WIDTH / 2),
        y: mapPinMainPosition.y + PinSize.HEIGHT + TAIL_HEIGHT
      };
      window.form.setAddress(pinTailCoords);
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
    getMainPinDefaultCoords: function () {
      return {
        x: DEFAULT_MAIN_PIN_X,
        y: DEFAULT_MAIN_PIN_Y
      };
    },
    activate: activateMap,
    deactivate: deactivateMap
  };
})();
