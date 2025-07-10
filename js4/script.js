const API_URL = 'http://localhost:3002/cpu';
const INTERVAL = 5000;
const MAX_POINTS = 20;

const ctx = document.getElementById('cpuChart').getContext('2d');
const totalSpan = document.getElementById('total');
const errorsSpan = document.getElementById('errors');

let dataPoints = [];
let totalRequests = 0;
let errorCount = 0;

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Загрузка CPU, %',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.2,
            fill: true,
            spanGaps: true
        }]
    },
    options: {
        scales: {
            y: {
                min: 0,
                max: 100,
                title: { display: true, text: '%' }
            }
        }
    }
});

function updateStats() {
    totalSpan.textContent = totalRequests;
    errorsSpan.textContent = totalRequests ? Math.round((errorCount / totalRequests) * 100) : 0;
}

function addDataPoint(value) {
    const now = new Date();
    dataPoints.push({
        time: now.toLocaleTimeString(),
        value
    });
    if (dataPoints.length > MAX_POINTS) dataPoints.shift();
    chart.data.labels = dataPoints.map(p => p.time);
    chart.data.datasets[0].data = dataPoints.map(p => p.value);
    chart.update();
}

function fetchCpu() {
    fetch(API_URL)
        .then(res => res.json())
        .then(val => {
            totalRequests++;
            if (val === 0) errorCount++;
            addDataPoint(val);
            updateStats();
        })
        .catch(() => {
            totalRequests++;
            errorCount++;
            addDataPoint(0);
            updateStats();
        });
}

fetchCpu();
setInterval(fetchCpu, INTERVAL); 