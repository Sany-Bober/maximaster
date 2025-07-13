from flask import Flask, render_template_string, request, redirect, url_for
from datetime import datetime
import sqlite3
import os

app = Flask(__name__)
DB_FILE = 'guestbook.db'

# Создание таблицы, если не существует
if not os.path.exists(DB_FILE):
    with sqlite3.connect(DB_FILE) as conn:
        conn.execute('''CREATE TABLE messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            text TEXT NOT NULL,
            date TEXT NOT NULL
        )''')

template = '''
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Гостевая книга</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 30px; }
        .msg { border: 1px solid #444; padding: 8px 12px; margin-bottom: 10px; width: 400px; background: #fafafa; }
        .msg .meta { display: flex; justify-content: space-between; font-size: 0.95em; color: #444; margin-bottom: 3px; }
        form { margin-top: 20px; width: 400px; }
        input[type=text], textarea { width: 100%; margin-bottom: 8px; padding: 5px; font-size: 1em; }
        textarea { height: 60px; resize: vertical; }
        button { padding: 6px 18px; font-size: 1em; border-radius: 4px; border: 1px solid #888; background: #eee; cursor: pointer; }
        button:hover { background: #ddd; }
        .error { color: #b00; margin-bottom: 10px; }
    </style>
</head>
<body>
    <h2>Гостевая книга</h2>
    {% for m in messages %}
    <div class="msg">
        <div class="meta">
            <span>{{ m['date'] }}</span>
            <b>{{ m['name'] }}</b>
        </div>
        <div>{{ m['text'] }}</div>
    </div>
    {% endfor %}
    <form method="post">
        {% if error %}<div class="error">{{ error }}</div>{% endif %}
        <input type="text" name="name" placeholder="Имя" value="{{ request.form.name }}">
        <textarea name="text" placeholder="Ваше сообщение">{{ request.form.text }}</textarea>
        <button type="submit">Отправить</button>
    </form>
</body>
</html>
'''

@app.route('/', methods=['GET', 'POST'])
def index():
    error = None
    if request.method == 'POST':
        name = request.form.get('name', '').strip() or 'Анонимно'
        text = request.form.get('text', '').strip()
        if not text:
            error = 'Сообщение не может быть пустым.'
        else:
            date = datetime.now().strftime('%d.%m.%Y %H:%M')
            with sqlite3.connect(DB_FILE) as conn:
                conn.execute('INSERT INTO messages (name, text, date) VALUES (?, ?, ?)', (name, text, date))
            return redirect(url_for('index'))
    with sqlite3.connect(DB_FILE) as conn:
        conn.row_factory = sqlite3.Row
        messages = conn.execute('SELECT * FROM messages ORDER BY id DESC').fetchall()
    return render_template_string(template, messages=messages, error=error, request=request)

if __name__ == '__main__':
    app.run(debug=True)
