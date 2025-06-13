from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app.config['SECRET_KEY'] = os.urandom(24)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory.db'
app.config['UPLOAD_FOLDER'] = 'uploads'

# Create uploads folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)

def format_price(price):
    """Format price to always show two decimal places"""
    return f"${price:.2f}"

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    size = db.Column(db.String(20), nullable=False)
    condition = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)
    image_url = db.Column(db.String(200))
    image_file = db.Column(db.String(200))  # For uploaded images

def init_db():
    with app.app_context():
        db.create_all()
        # Check if we already have items
        if Item.query.count() == 0:
            # Add sample items with uniform pricing
            sample_items = [
                Item(
                    name="Vintage Denim Jacket",
                    category="Jackets",
                    size="M",
                    condition="Good",
                    price=99.00,
                    quantity=1,
                    notes="Classic 90s denim jacket in excellent condition"
                ),
                Item(
                    name="Retro T-Shirt",
                    category="Tops",
                    size="L",
                    condition="Excellent",
                    price=49.00,
                    quantity=2,
                    notes="Vintage band t-shirt from the 80s"
                ),
                Item(
                    name="Leather Boots",
                    category="Footwear",
                    size="42",
                    condition="Good",
                    price=199.00,
                    quantity=1,
                    notes="Vintage leather boots, barely worn"
                ),
                Item(
                    name="Vintage Sweater",
                    category="Tops",
                    size="S",
                    condition="Excellent",
                    price=79.00,
                    quantity=1,
                    notes="Hand-knitted wool sweater from the 70s"
                ),
                Item(
                    name="Denim Jeans",
                    category="Bottoms",
                    size="32",
                    condition="Good",
                    price=89.00,
                    quantity=2,
                    notes="Classic 90s high-waisted jeans"
                )
            ]
            for item in sample_items:
                db.session.add(item)
            db.session.commit()
            logger.info("Sample items added to database")

# Initialize the database with sample data
init_db()

@app.route('/')
def index():
    logger.info("Accessing index route")
    return render_template('home.html')

@app.route('/catalog')
def catalog():
    logger.info("Accessing catalog route")
    try:
        # Get filter parameters
        category = request.args.get('category', '')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        sort_by = request.args.get('sort_by', 'date_added')
        sort_order = request.args.get('sort_order', 'desc')
        search_query = request.args.get('q', '').strip()
        
        # Base query
        query = Item.query
        
        # Apply search
        if search_query:
            logger.info(f"Applying search filter: {search_query}")
            search_terms = search_query.split()
            for term in search_terms:
                query = query.filter(
                    (Item.name.ilike(f'%{term}%')) |
                    (Item.category.ilike(f'%{term}%')) |
                    (Item.size.ilike(f'%{term}%')) |
                    (Item.condition.ilike(f'%{term}%')) |
                    (Item.notes.ilike(f'%{term}%'))
                )
        
        # Apply filters
        if category:
            logger.info(f"Applying category filter: {category}")
            query = query.filter(Item.category == category)
        if min_price is not None:
            logger.info(f"Applying min price filter: {min_price}")
            query = query.filter(Item.price >= min_price)
        if max_price is not None:
            logger.info(f"Applying max price filter: {max_price}")
            query = query.filter(Item.price <= max_price)
        
        # Apply sorting
        if sort_by == 'price':
            query = query.order_by(Item.price.desc() if sort_order == 'desc' else Item.price.asc())
        elif sort_by == 'name':
            query = query.order_by(Item.name.asc() if sort_order == 'asc' else Item.name.desc())
        else:  # date_added
            query = query.order_by(Item.date_added.desc() if sort_order == 'desc' else Item.date_added.asc())
        
        items = query.all()
        logger.info(f"Found {len(items)} items in catalog")
        
        # Get unique categories for filter dropdown
        categories = db.session.query(Item.category.distinct()).all()
        categories = [cat[0] for cat in categories]
        logger.info(f"Found {len(categories)} unique categories")
        
        return render_template('shop.html', 
                             items=items, 
                             categories=categories,
                             selected_category=category,
                             min_price=min_price,
                             max_price=max_price,
                             sort_by=sort_by,
                             sort_order=sort_order,
                             search_query=search_query,
                             format_price=format_price)
    except Exception as e:
        logger.error(f"Error in catalog route: {str(e)}")
        return render_template('shop.html', items=[], categories=[])

@app.route('/product/<int:id>')
def product_detail(id):
    logger.info(f"Accessing product detail for ID: {id}")
    try:
        item = Item.query.get_or_404(id)
        return render_template('product.html', item=item, format_price=format_price)
    except Exception as e:
        logger.error(f"Error accessing product {id}: {str(e)}")
        return redirect(url_for('catalog'))

@app.route('/access-denied')
def access_denied():
    logger.info("Accessing access denied page")
    return render_template('access_denied.html')

@app.route('/run-tests')
def run_tests():
    # Add your test logic here
    return jsonify({'message': 'Tests completed successfully!'})

@app.route('/landing')
def landing():
    return render_template('landing.html')

if __name__ == '__main__':
    logger.info("Starting Flask application")
    app.run(debug=True) 