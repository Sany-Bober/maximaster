// Валидация формы и логика карты
const form = document.getElementById('orderForm');
const fio = document.getElementById('fio');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const comment = document.getElementById('comment');
const formMessage = document.getElementById('formMessage');
let map, placemark, coords;

// Ограничение на ввод только чисел в телефон
phone.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
});

// Инициализация Яндекс.Карты
function initMap() {
    map = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 10
    });
    map.events.add('click', function (e) {
        coords = e.get('coords');
        if (placemark) {
            placemark.geometry.setCoordinates(coords);
        } else {
            placemark = new ymaps.Placemark(coords, {}, {draggable: false});
            map.geoObjects.add(placemark);
        }
        placemark.properties.set('balloonContent', `Координаты: ${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`);
        placemark.balloon.open();
    });
}

ymaps.ready(initMap);

form.addEventListener('submit', function(e) {
    e.preventDefault();
    formMessage.textContent = '';
    formMessage.className = '';
    let errors = [];

    // Проверка ФИО
    if (!fio.value.trim()) {
        errors.push('Не заполнено поле ФИО');
    }
    // Проверка телефона
    if (!phone.value.trim()) {
        errors.push('Не заполнено поле Телефон');
    } else if (!/^\d+$/.test(phone.value)) {
        errors.push('Телефон должен содержать только числа');
    }
    // Проверка email
    if (email.value && !email.value.includes('@')) {
        errors.push('Email должен содержать символ @');
    }
    // Проверка карты
    if (!placemark) {
        errors.push('Не отмечен адрес доставки на карте');
    }
    // Проверка комментария
    if (comment.value.length > 500) {
        errors.push('Комментарий не должен превышать 500 символов');
    }

    if (errors.length > 0) {
        formMessage.textContent = errors.join('\n');
        formMessage.className = 'error';
    } else {
        formMessage.textContent = 'Заказ оформлен!';
        formMessage.className = 'success';
        form.reset();
        if (placemark) {
            map.geoObjects.remove(placemark);
            placemark = null;
        }
        coords = null;
    }
}); 