from flask import Flask
from datetime import datetime
import os

app = Flask(__name__)
COUNTER_FILE = 'counter.txt'

def get_counter():
    if not os.path.exists(COUNTER_FILE):
        with open(COUNTER_FILE, 'w') as f:
            f.write('0')
        return 0
    with open(COUNTER_FILE, 'r') as f:
        return int(f.read().strip() or 0)

def increment_counter():
    count = get_counter() + 1
    with open(COUNTER_FILE, 'w') as f:
        f.write(str(count))
    return count

@app.route('/')
def index():
    count = increment_counter()
    now = datetime.now().strftime('%H:%M')
    return f'''
    <div style="font-size:1.2em;margin:30px;">
        <blockquote>Страница была загружена {count} раз. Текущее время <b>{now}</b>.</blockquote>
    </div>
    '''

if __name__ == '__main__':
    app.run(debug=True)
