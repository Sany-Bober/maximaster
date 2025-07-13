from flask import Flask, request, jsonify, send_from_directory
import requests
import os
import json
from datetime import datetime
import urllib3

# Отключаем предупреждения о SSL
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = Flask(__name__)
CITIES_URL = 'https://exercise.develop.maximaster.ru/service/city/'
DELIVERY_URL = 'https://exercise.develop.maximaster.ru/service/delivery/'
CACHE_FILE = 'cities_cache.json'
AUTH = ('cli', '12344321')

# Кэширование списка городов на сутки
def get_cities():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, 'r', encoding='utf-8') as f:
            cache = json.load(f)
            if cache.get('date') == datetime.now().strftime('%Y-%m-%d'):
                return cache['cities']
    # Запрос к внешнему сервису
    try:
        print(f"Попытка получить города из {CITIES_URL}")
        resp = requests.get(CITIES_URL, timeout=10, auth=AUTH, verify=False)
        resp.raise_for_status()
        cities = resp.json()
        print(f"Получено городов: {len(cities)}")
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump({'date': datetime.now().strftime('%Y-%m-%d'), 'cities': cities}, f, ensure_ascii=False)
        return cities
    except Exception as e:
        print(f"Ошибка при получении городов: {e}")
        # Если не удалось получить города — пробуем из кэша
        if os.path.exists(CACHE_FILE):
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                cache = json.load(f)
                return cache.get('cities', [])
        return []

@app.route('/cities')
def cities():
    return jsonify(get_cities())

@app.route('/delivery', methods=['POST'])
def delivery():
    city = request.form.get('city', '').strip()
    weight = request.form.get('weight', '').strip()
    if not city or not weight or not weight.isdigit() or int(weight) <= 0:
        return jsonify({'status': 'error', 'message': 'Пожалуйста, выберите город и введите корректный вес.'})
    try:
        params = {'city': city, 'weight': int(weight)}
        resp = requests.get(DELIVERY_URL, params=params, timeout=10, auth=AUTH, verify=False)
        return jsonify(resp.json())
    except Exception as e:
        print(f"Ошибка при расчете доставки: {e}")
        return jsonify({'status': 'error', 'message': 'Ошибка соединения с сервисом расчёта.'})

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
