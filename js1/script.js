// Получаем элементы
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const colorBtn = document.getElementById('colorBtn');
const square = document.getElementById('square');

// Функция для обновления размеров квадрата
function updateSquareSize() {
    const w = parseInt(widthInput.value) || 100;
    const h = parseInt(heightInput.value) || 100;
    square.style.width = w + 'px';
    square.style.height = h + 'px';
}

// Функция для генерации случайного цвета
function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

// Обработчики событий
widthInput.addEventListener('input', updateSquareSize);
heightInput.addEventListener('input', updateSquareSize);
colorBtn.addEventListener('click', function() {
    square.style.background = getRandomColor();
});

// Инициализация
updateSquareSize();
 