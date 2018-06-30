'use strict';

(function () {
  var ESC_KEYCODE = 27;
  window.mapPinMain = document.querySelector('.map__pin--main');

  window.utils = {
    getRandomFromInterval: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    randomShuffleArr: function (arr) {
      var copyArr = arr.slice(0);
      for (var i = copyArr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = copyArr[i];
        copyArr[i] = copyArr[j];
        copyArr[j] = temp;
      }
      return copyArr;
    },
    randomCutArr: function (arr) {
      var copyArr = arr.slice(0);
      var length = window.utils.getRandomFromInterval(0, copyArr.length);
      copyArr.slice(0, length);
      return copyArr;
    },
    isEscKeyCode: function (evt) {
      return evt.keyCode === ESC_KEYCODE;
    },
    onEscDown: function (evt, popup) {
      if (evt.keyCode === ESC_KEYCODE) {
        popup.remove();
      }
    }
  };
})();

