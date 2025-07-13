const TABLE_KEY = 'editableTableData';
const ROWS_KEY = 'editableTableRows';
const COLS_KEY = 'editableTableCols';

const table = document.getElementById('editable-table');
const addRowBtn = document.getElementById('add-row');
const removeRowBtn = document.getElementById('remove-row');
const addColBtn = document.getElementById('add-col');
const removeColBtn = document.getElementById('remove-col');

function getTableData() {
    return JSON.parse(localStorage.getItem(TABLE_KEY) || '{}');
}
function setTableData(data) {
    localStorage.setItem(TABLE_KEY, JSON.stringify(data));
}
function getRows() {
    return parseInt(localStorage.getItem(ROWS_KEY) || '4', 10);
}
function setRows(rows) {
    localStorage.setItem(ROWS_KEY, rows);
}
function getCols() {
    return parseInt(localStorage.getItem(COLS_KEY) || '6', 10);
}
function setCols(cols) {
    localStorage.setItem(COLS_KEY, cols);
}

function renderTable() {
    const rows = getRows();
    const cols = getCols();
    const data = getTableData();
    table.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        const tr = document.createElement('tr');
        for (let c = 0; c < cols; c++) {
            const td = document.createElement('td');
            td.dataset.row = r;
            td.dataset.col = c;
            td.textContent = data[`${r},${c}`] || '';
            td.ondblclick = function () {
                editCell(td, r, c);
            };
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function editCell(td, r, c) {
    if (td.querySelector('input')) return;
    const oldValue = td.textContent;
    td.innerHTML = '';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldValue;
    input.autofocus = true;
    input.onblur = saveEdit;
    input.onkeydown = function (e) {
        if (e.key === 'Enter') input.blur();
        if (e.key === 'Escape') {
            td.textContent = oldValue;
        }
    };
    td.appendChild(input);
    input.focus();
    function saveEdit() {
        const value = input.value;
        td.textContent = value;
        const data = getTableData();
        if (value) {
            data[`${r},${c}`] = value;
        } else {
            delete data[`${r},${c}`];
        }
        setTableData(data);
    }
}

function hasDataInRow(row) {
    const cols = getCols();
    const data = getTableData();
    for (let c = 0; c < cols; c++) {
        if (data[`${row},${c}`]) return true;
    }
    return false;
}
function hasDataInCol(col) {
    const rows = getRows();
    const data = getTableData();
    for (let r = 0; r < rows; r++) {
        if (data[`${r},${col}`]) return true;
    }
    return false;
}

addRowBtn.onclick = function () {
    setRows(getRows() + 1);
    renderTable();
};
removeRowBtn.onclick = function () {
    const rows = getRows();
    if (rows <= 1) return;
    if (hasDataInRow(rows - 1)) {
        if (!confirm('В последней строке есть данные. Удалить строку?')) return;
    }
    // Удаляем данные из последней строки
    const data = getTableData();
    const cols = getCols();
    for (let c = 0; c < cols; c++) {
        delete data[`${rows - 1},${c}`];
    }
    setTableData(data);
    setRows(rows - 1);
    renderTable();
};
addColBtn.onclick = function () {
    setCols(getCols() + 1);
    renderTable();
};
removeColBtn.onclick = function () {
    const cols = getCols();
    if (cols <= 1) return;
    if (hasDataInCol(cols - 1)) {
        if (!confirm('В последнем столбце есть данные. Удалить столбец?')) return;
    }
    // Удаляем данные из последнего столбца
    const data = getTableData();
    const rows = getRows();
    for (let r = 0; r < rows; r++) {
        delete data[`${r},${cols - 1}`];
    }
    setTableData(data);
    setCols(cols - 1);
    renderTable();
};

window.addEventListener('DOMContentLoaded', renderTable); 