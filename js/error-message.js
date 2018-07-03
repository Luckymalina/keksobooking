'use strict';

(function () {
  var renderErrorMessage = function (errorMessage) {
    var message = document.createElement('div');
    message.style = 'color: #fff; z-index: 100; margin: 0 auto; text-align: center; vertical-align: middle; background-color: rgba(0,0,0,0.8);';
    message.style.position = 'fixed';
    message.style.left = 0;
    message.style.right = 0;
    message.style.width = '40%';
    message.style.fontSize = '30px';
    message.style.borderRadius = '5px';
    message.style.fontWeight = 700;
    message.style.marginTop = '200px';
    message.style.paddingTop = '50px';
    message.style.paddingBottom = '50px';
    message.style.paddingLeft = '20px';
    message.style.paddingRight = '20px';
    message.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', message);
  };

  window.renderErrorMessage = renderErrorMessage;
})();
