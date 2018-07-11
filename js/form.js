'use strict';

(function () {
  var RoomsValues = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = document.querySelectorAll('.ad-form__element');
  var adFormHeader = document.querySelector('.ad-form-header');
  var addressInput = document.querySelector('#address');
  var success = document.querySelector('.success');
  var titleInput = document.querySelector('#title');
  var typeInput = document.querySelector('#type');
  var priceInput = document.querySelector('#price');
  var timeInInput = document.querySelector('#timein');
  var timeOutInput = document.querySelector('#timeout');
  var roomNumberSelect = document.querySelector('#room_number');
  var capacitySelect = document.querySelector('#capacity');
  var submitBtn = document.querySelector('.ad-form__submit');
  var resetBtn = document.querySelector('.ad-form__reset');
  var invalidElements = [];

  var setAddressCoords = function (coords) {
    addressInput.value = coords.x + ', ' + coords.y;
  };

  var activateForm = function () {
    adForm.classList.remove('ad-form--disabled');
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = false;
    }
    adFormHeader.disabled = false;
    window.loadImage.activate();
    adForm.addEventListener('invalid', onFormInvalid, true);
    priceInput.addEventListener('change', onElementCheckValidity);
    titleInput.addEventListener('change', onElementCheckValidity);
  };

  var deactivateForm = function () {
    adForm.reset();
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = true;
    }
    adFormHeader.disabled = true;
    var defaultCoords = window.map.getMainPinDefaultCoords();
    setAddressCoords(defaultCoords);
    adForm.classList.add('ad-form--disabled');
    window.loadImage.deactivate();
    window.loadImage.remove();
    adForm.removeEventListener('invalid', onFormInvalid, true);
  };

  deactivateForm();

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
    for (var i = 0; i < RoomsValues[inputValue].length; i++) {
      capacitySelect.querySelector('option' + '[value="' + RoomsValues[inputValue][i] + '"]').disabled = false;
      capacitySelect.value = RoomsValues[inputValue][i];
    }
  };

  roomNumberSelect.addEventListener('change', function () {
    disableСapacityOptions(roomNumberSelect.value);
  });

  var highlightInvalidElement = function (item) {
    invalidElements.push(item);
    item.classList.add('invalid-element');
  };

  var unhighlightInvalidElement = function (item) {
    invalidElements.splice(invalidElements.indexOf(item), 1);
    item.classList.remove('invalid-element');
  };

  var onFormInvalid = function (evt) {
    highlightInvalidElement(evt.target);
  };

  var onElementCheckValidity = function (evt) {
    if (!evt.target.checkValidity()) {
      highlightInvalidElement(evt.target);
    } else if (invalidElements.indexOf(evt.target) !== 1) {
      unhighlightInvalidElement(evt.target);
    }
  };

  var checkPlaceValidity = function () {
    var roomGuests = RoomsValues[roomNumberSelect.value];
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

  var onSubmitSuccess = function () {
    showSuccess();
    window.map.deactivate();
    window.form.deactivate();
    window.filter.deactivate();
  };

  var onSubmitError = function (errorMessage) {
    window.utils.renderErrorMessage(errorMessage);
  };

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(adForm);
    window.backend.upload(onSubmitSuccess, onSubmitError, formData);
  });

  resetBtn.addEventListener('click', function () {
    window.map.deactivate();
    window.form.deactivate();
    window.filter.deactivate();
    window.loadImage.remove();
  });

  window.form = {
    setAddress: setAddressCoords,
    activate: activateForm,
    deactivate: deactivateForm
  };
})();
