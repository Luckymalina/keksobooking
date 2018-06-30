'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = document.querySelectorAll('.ad-form__element');
  var adFormHeader = document.querySelector('.ad-form-header');
  var addressInput = document.querySelector('#address');
  var success = document.querySelector('.success');
  var typeInput = document.querySelector('#type');
  var priceInput = document.querySelector('#price');
  var timeInInput = document.querySelector('#timein');
  var timeOutInput = document.querySelector('#timeout');
  var roomNumberSelect = document.querySelector('#room_number');
  var capacitySelect = document.querySelector('#capacity');
  var submitBtn = document.querySelector('.ad-form__submit');
  var roomsValues = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  addressInput.value = Math.floor(window.mapPinMain.offsetLeft - window.mapPinMain.offsetWidth / 2) + ', ' + Math.floor(window.mapPinMain.offsetTop - window.mapPinMain.offsetHeight / 2);

  adFormHeader.disabled = true;

  for (var l = 0; l < adFormFieldsets.length; l++) {
    adFormFieldsets[l].disabled = true;
  }

  typeInput.addEventListener('change', function (evt) {
    switch (evt.target.value) {
      case 'bungalo':
        priceInput.min = 0;
        priceInput.placeholder = '0';
        break;
      case 'flat':
        priceInput.min = 1000;
        priceInput.placeholder = '1000';
        break;
      case 'house':
        priceInput.min = 5000;
        priceInput.placeholder = '5000';
        break;
      case 'palace':
        priceInput.min = 10000;
        priceInput.placeholder = '10000';
        break;
    }
  });

  timeInInput.addEventListener('change', function (evt) {
    timeOutInput.value = evt.target.value;
  });

  timeOutInput.addEventListener('change', function (evt) {
    timeInInput.value = evt.target.value;
  });

  var disableСapacityOptions = function (inputValue) {
    var capacityOptions = capacitySelect.querySelectorAll('option');
    for (var t = 0; t < capacityOptions.length; t++) {
      capacityOptions[t].disabled = true;
    }
    for (var i = 0; i < roomsValues[inputValue].length; i++) {
      capacitySelect.querySelector('option' + '[value="' + roomsValues[inputValue][i] + '"]').disabled = false;
      capacitySelect.value = roomsValues[inputValue][i];
    }
  };

  roomNumberSelect.addEventListener('change', function () {
    disableСapacityOptions(roomNumberSelect.value);
  });

  var checkPlaceValidity = function () {
    var roomGuests = roomsValues[roomNumberSelect.value];
    if (roomGuests.indexOf(+capacitySelect.value) === -1) {
      capacitySelect.setCustomValidity('Количество гостей не влезут в выбранную комнату');
    } else {
      capacitySelect.setCustomValidity('');
    }
  };

  roomNumberSelect.addEventListener('change', function (evt) {
    evt.target.setCustomValidity('');
  });

  capacitySelect.addEventListener('change', function (evt) {
    evt.target.setCustomValidity('');
  });

  submitBtn.addEventListener('click', function () {
    checkPlaceValidity();
  });

  var showSuccess = function () {
    success.classList.remove('hidden');
    success.addEventListener('keydown', function (evt) {
      if (window.utils.isEscKeyCode(evt)) {
        success.classList.add('hidden');
      }
    });
    document.addEventListener('click', function () {
      success.classList.add('hidden');
    });
  };

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    showSuccess();
    window.map.deactivation();
    window.form.deactivation();
  });

  window.form = {
    fillAddress: function () {
      var addressInputCoords = window.map.getMapPinMainCoords();
      addressInput.value = addressInputCoords.x + ', ' + addressInputCoords.y;
    },
    activation: function () {
      adForm.classList.remove('ad-form--disabled');
      for (var i = 0; i < adFormFieldsets.length; i++) {
        adFormFieldsets[i].removeAttribute('disabled', 'disabled');
      }
      adFormHeader.disabled = false;
      window.form.fillAddress();
    },
    deactivation: function () {
      adForm.reset();
      for (var i = 0; i < adFormFieldsets.length; i++) {
        adFormFieldsets[i].disabled = true;
      }
      adFormHeader.disabled = true;
      addressInput.value = Math.floor(window.mapPinMain.offsetLeft - window.mapPinMain.offsetWidth / 2) + ', ' + Math.floor(window.mapPinMain.offsetTop - window.mapPinMain.offsetHeight / 2);
      adForm.classList.add('ad-form--disabled');
    }
  };
})();
