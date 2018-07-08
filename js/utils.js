'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 300;

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
    var length = window.utils.getRandomFromInterval(0, copyArr.length);
    copyArr.slice(0, length);
    return copyArr;
  };

  var isEscKeyCode = function (evt) {
    return evt.keyCode === ESC_KEYCODE;
  };

  var onEscDown = function (evt, popup) {
    if (evt.keyCode === ESC_KEYCODE) {
      popup.remove();
    }
  };

  var renderErrorMessage = function (errorMessage) {
    var message = document.createElement('div');
    message.classList.add('error-message');
    message.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', message);
  };

  var debounce = function (fun) {
    var lastTimeout = null;
    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fun.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.utils = {
    getRandomFromInterval: getRandomFromInterval,
    randomShuffleArr: randomShuffleArr,
    randomCutArr: randomCutArr,
    isEscKeyCode: isEscKeyCode,
    onEscDown: onEscDown,
    renderErrorMessage: renderErrorMessage,
    debounce: debounce
  };
})();

