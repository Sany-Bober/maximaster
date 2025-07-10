const API_URL = 'http://localhost:3001/products';
const tableContainer = document.getElementById('tableContainer');
const priceFrom = document.getElementById('priceFrom');
const priceTo = document.getElementById('priceTo');
const refreshBtn = document.getElementById('refreshBtn');

let products = [];

function renderTable(data) {
    if (!data.length) {
        tableContainer.innerHTML = '<div class="no-data">Нет данных, попадающих под условие фильтра</div>';
        return;
    }
    let html = '<table><thead><tr>' +
        '<th>ID</th><th>Название</th><th>Количество</th><th>Цена за единицу</th><th>Сумма</th>' +
        '</tr></thead><tbody>';
    data.forEach((item, idx) => {
        const sum = (typeof item.quantity === 'number' && typeof item.price === 'number') ? item.quantity * item.price : '-';
        html += `<tr><td>${idx + 1}</td><td>${item.name}</td><td>${item.quantity}</td><td>${item.price}</td><td>${sum}</td></tr>`;
    });
    html += '</tbody></table>';
    tableContainer.innerHTML = html;
}

function filterAndRender() {
    let from = parseInt(priceFrom.value) || 0;
    let to = parseInt(priceTo.value) || 0;
    if (from < 0 || to < 0) {
        tableContainer.innerHTML = '<div class="no-data">Ошибка: значения фильтра не могут быть отрицательными</div>';
        return;
    }
    let filtered = products;
    if (!(from === 0 && to === 0)) {
        filtered = products.filter(item => {
            return item.price >= from && (to === 0 || item.price <= to);
        });
    }
    renderTable(filtered);
}

function fetchData() {
    tableContainer.innerHTML = 'Загрузка...';
    fetch(API_URL)
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(data => {
            products = data;
            filterAndRender();
        })
        .catch(() => {
            tableContainer.innerHTML = '<div class="no-data">Ошибка загрузки данных</div>';
        });
}

refreshBtn.addEventListener('click', filterAndRender);

// Обновлять таблицу при изменении фильтров (по Enter)
priceFrom.addEventListener('keydown', e => { if (e.key === 'Enter') filterAndRender(); });
priceTo.addEventListener('keydown', e => { if (e.key === 'Enter') filterAndRender(); });

fetchData(); 