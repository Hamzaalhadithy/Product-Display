from flask import Flask, jsonify, render_template, request
import json
import requests
from datetime import datetime

app = Flask(__name__)

# Cache for gold price
price_cache = {
    'price': 106.32,           # fallback price (USD/gram)
    'timestamp': None,
    'cache_duration' : 500
}

def get_gold_price():
    now = datetime.now()

    if price_cache['timestamp'] and (now - price_cache['timestamp']).seconds < price_cache['cache_duration']:
        return price_cache['price']

    try:
        url = "https://api.gold-api.com/price/XAU"
        response = requests.get(url, timeout=10)
        data = response.json()

        price_per_ounce = data["price"]
        if not price_per_ounce:
            raise ValueError("No price in response")
        price_per_gram = round(price_per_ounce / 31.1035, 2)

        price_cache['price'] = price_per_gram
        price_cache['timestamp'] = now

        print(f"[Live] Gold price: ${price_per_gram}/g")
        return price_per_gram

    except Exception as e:
        print("Error fetching gold price:", e)
        return price_cache['price']

def load_products():
    with open('products.json', 'r') as f:
        return json.load(f)
    

def calculate_price(popularity_score, weight, gold_price):
    return round((popularity_score + 1) * weight * gold_price, 2)

@app.route('/api/products')
def api_products():
    min_price = float(request.args.get('min_price', 0))
    max_price = float(request.args.get('max_price', 1e6))
    min_pop = float(request.args.get('min_popularity', 0))
    max_pop = float(request.args.get('max_popularity', 5))

    gold_price = get_gold_price()
    products = load_products()
    enriched = []

    for p in products:
        price = calculate_price(p['popularityScore'], p['weight'], gold_price)
        pop_score_5 = round(p['popularityScore'] * 5, 1)

        if (min_price <= price <= max_price) and (min_pop <= pop_score_5 <= max_pop):
            enriched.append({
                "name": p['name'],
                "weight": p['weight'],
                "popularityScore": pop_score_5,
                "images": p['images'],
                "price": price,
                "goldPricePerGram": gold_price
            })

    return jsonify(enriched)


@app.route('/')
def home():
    return render_template('products.html')


def startup():
    get_gold_price()

if __name__ == '__main__':
    startup()
    app.run(debug=True)
