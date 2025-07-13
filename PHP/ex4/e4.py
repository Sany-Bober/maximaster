from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///products.db'
db = SQLAlchemy(app)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description
        }

@app.cli.command('init-db')
def init_db():
    db.create_all()
    print('База данных инициализирована.')

# ... далее будут реализованы маршруты API ...

@app.route('/api/products/', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products]), 200

@app.route('/api/products/<int:product_id>/', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Товар не найден'}), 404
    return jsonify(product.to_dict()), 200

@app.route('/api/products/', methods=['POST'])
def add_product():
    data = request.get_json()
    if not data or 'name' not in data or 'price' not in data:
        return jsonify({'error': 'Некорректные данные'}), 400
    product = Product(
        name=data['name'],
        price=data['price'],
        description=data.get('description')
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201

@app.route('/api/products/<int:product_id>/', methods=['PUT'])
def update_product(product_id):
    print('RAW DATA:', request.data)
    print('JSON:', request.get_json())
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Товар не найден'}), 404
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Нет данных для обновления'}), 400
    product.name = data.get('name', product.name)
    product.price = data.get('price', product.price)
    product.description = data.get('description', product.description)
    db.session.commit()
    return jsonify(product.to_dict()), 200

@app.route('/api/products/<int:product_id>/', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Товар не найден'}), 404
    db.session.delete(product)
    db.session.commit()
    return jsonify({'result': 'Товар удалён'}), 200

# ... конец маршрутов ...

if __name__ == '__main__':
    app.run(debug=True)
