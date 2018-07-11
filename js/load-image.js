'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var DEFAULT_AVATAR = 'img/muffin-grey.svg';

  var ImageParams = {
    WIDTH: '70px',
    HEIGHT: '70px',
    BORDER_RADIUS: '5px'
  };

  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var imageWrap = document.querySelector('.ad-form__photo');
  var imagesContainer = document.querySelector('.ad-form__photo-container');
  var avatarChooser = document.querySelector('#avatar');
  var imageChooser = document.querySelector('#images');

  var filtrationByCorrectType = function (file) {
    return FILE_TYPES.some(function (it) {
      return file.name.toLowerCase().endsWith(it);
    });
  };

  var changeAvatar = function (src) {
    avatarPreview.src = src;
  };

  var addImages = function (src) {
    var newImageWrap = document.createElement('div');
    var image = document.createElement('img');
    newImageWrap.classList.add('ad-form__photo');
    newImageWrap.classList.add('ad-form__photo--added');
    image.src = src;
    image.style.width = ImageParams.WIDTH;
    image.style.height = ImageParams.HEIGHT;
    image.style.borderRadius = ImageParams.BORDER_RADIUS;
    newImageWrap.appendChild(image);
    imagesContainer.insertBefore(newImageWrap, imageWrap);
  };

  var loadFile = function (chooser, func) {
    var files = Array.from(chooser.files).filter(filtrationByCorrectType);
    if (files) {
      files.forEach(function (item) {
        var reader = new FileReader();
        reader.addEventListener('load', function (evt) {
          func(evt.target.result);
        });
        reader.readAsDataURL(item);
      });
    }
  };

  var removeImages = function () {
    avatarPreview.src = DEFAULT_AVATAR;
    var addedImages = document.querySelectorAll('.ad-form__photo--added');
    if (addedImages) {
      addedImages.forEach(function (it) {
        it.remove();
      });
    }
  };

  var onAvatarChange = function (evt) {
    loadFile(evt.target, changeAvatar);
  };

  var onPhotoChange = function (evt) {
    loadFile(evt.target, addImages);
  };

  var activate = function () {
    avatarChooser.addEventListener('change', onAvatarChange);
    imageChooser.addEventListener('change', onPhotoChange);
  };

  var deactivate = function () {
    avatarChooser.removeEventListener('change', onAvatarChange);
    imageChooser.removeEventListener('change', onPhotoChange);
  };

  window.loadImage = {
    activate: activate,
    deactivate: deactivate,
    remove: removeImages
  };
})();
