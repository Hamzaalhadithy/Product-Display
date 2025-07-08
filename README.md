# 💍 Flask Product Listing App

A web application built with Flask that displays engagement rings from a JSON file. The app calculates real-time product prices based on the current gold price (fetched from Yahoo Finance or a fallback) and displays them in a styled carousel frontend.

Can be accessed at this URL:  https://product-display-wi0m.onrender.com/
---

## 🚀 Features

- RESTful API to serve product data
- Live gold price fetched and cached
- Price calculation: price = (popularityScore + 1) * weight * gold_price_per_gram

- Frontend displays:
- Product name
- Price (USD)
- Popularity rating (out of 5)
- Color selector (yellow, white, rose)
- Product carousel (horizontal scroll)

---

## 📁 Project Structure
/project-root
├── app.py # Flask app
├── products.json # Sample product data
├── requirements.txt # Python dependencies
├── Procfile # Render deployment config
├── templates/
│ └── products.html # Frontend template
└── static/ 

