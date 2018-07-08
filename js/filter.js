'use strict';

(function () {
  var PINS_LIMIT = 5;

  var PriceRange = {
    low: {
      MIN: 0,
      MAX: 10000
    },
    middle: {
      MIN: 10000,
      MAX: 50000
    },
    high: {
      MIN: 50000,
      MAX: Infinity
    }
  };

  var filter = document.querySelector('.map__filters');
  var filterItems = filter.querySelectorAll('select, input');
  var typeSelect = filter.querySelector('#housing-type');
  var priceSelect = filter.querySelector('#housing-price');
  var roomsSelect = filter.querySelector('#housing-rooms');
  var guestsSelect = filter.querySelector('#housing-guests');
  var featuresFieldset = filter.querySelector('#housing-features');
  var data = [];
  var filteredData = [];

  var filtrationItem = function (it, item, key) {
    return it.value === 'any' ? true : it.value === item[key].toString();
  };

  var filtrationByType = function (item) {
    return filtrationItem(typeSelect, item.offer, 'type');
  };

  var filtrationByPrice = function (item) {
    var filteringPrice = PriceRange[priceSelect.value];
    return filteringPrice ? item.offer.price >= filteringPrice.MIN && item.offer.price <= filteringPrice.MAX : true;
  };

  var filtrationByRooms = function (item) {
    return filtrationItem(roomsSelect, item.offer, 'rooms');
  };

  var filtrationByGuests = function (item) {
    return filtrationItem(guestsSelect, item.offer, 'guests');
  };

  var filtrationByFeatures = function (item) {
    var checkedFeaturesItems = featuresFieldset.querySelectorAll('input:checked');
    return Array.from(checkedFeaturesItems).every(function (element) {
      return item.offer.features.includes(element.value);
    });
  };

  var onFilterChange = window.utils.debounce(function () {
    filteredData = data.slice();
    filteredData = filteredData.filter(filtrationByType);
    filteredData = filteredData.filter(filtrationByPrice);
    filteredData = filteredData.filter(filtrationByRooms);
    filteredData = filteredData.filter(filtrationByGuests);
    filteredData = filteredData.filter(filtrationByFeatures);
    window.map.removePins();
    window.map.removeMapCard();
    window.map.renderPinsMarkup(filteredData.slice(0, PINS_LIMIT));
  });

  var activateFilter = function () {
    filterItems.forEach(function (it) {
      it.disabled = false;
    });
    filter.addEventListener('change', onFilterChange);
  };

  var deactivateFilter = function () {
    filterItems.forEach(function (it) {
      it.disabled = true;
    });
    filter.removeEventListener('change', onFilterChange);
  };

  var activateFiltration = function (adData) {
    data = adData.slice();
    activateFilter();
    return adData.slice(0, PINS_LIMIT);
  };

  var deactivateFiltration = function () {
    deactivateFilter();
    filter.reset();
  };

  window.filter = {
    activate: activateFiltration,
    deactivate: deactivateFiltration
  };
})();
