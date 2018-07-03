'use strict';

(function () {
  var ServerUrl = {
    LOAD: 'https://js.dump.academy/keksobooking/data',
    UPLOAD: 'https://js.dump.academy/keksobooking'
  };
  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Произошла неизвестная ошибка. Пожалуйста, обновите страницу.');
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения. Пожалуйста, обновите страницу.');
    });
    xhr.addEventListener('timeout', function () {
      onError('Сервер долго не отвечает. Пожалуйста, обновите страницу.');
    });
    xhr.open('GET', ServerUrl.LOAD);
    xhr.send();
  };
  var upload = function (onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Произошла неизвестная ошибка. Пожалуйста, обновите страницу.');
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения. Пожалуйста, обновите страницу.');
    });
    xhr.addEventListener('timeout', function () {
      onError('Сервер долго не отвечает. Пожалуйста, обновите страницу.');
    });
    xhr.open('GET', ServerUrl.UPLOAD);
    xhr.send(data);
  };
  window.backend = {
    load: load,
    upload: upload
  };
})();

