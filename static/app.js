 // This will be populated by the API call
    let products = [];

    function createStars(rating) {
      const stars = [];
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 !== 0;
      
      for (let i = 0; i < 5; i++) {
        const isFilled = i < fullStars;
        stars.push(`
          <svg class="star ${isFilled ? '' : 'empty'}" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        `);
      }
      
      return stars.join('');
    }

    function changeImage(productIndex, color, images) {
      const img = document.getElementById(`img-${productIndex}`);
      const colorLabel = document.getElementById(`color-label-${productIndex}`);
      const dots = document.querySelectorAll(`#product-${productIndex} .color-dot`);
      
      if (img && images[color]) {
        img.src = images[color];
        
        const colorNames = {
          yellow: 'Yellow Gold',
          white: 'White Gold',
          rose: 'Rose Gold'
        };
        colorLabel.textContent = colorNames[color] || 'Color';
        
        dots.forEach(dot => dot.classList.remove('active'));
        document.querySelector(`#product-${productIndex} .dot-${color}`).classList.add('active');
      }
    }

    function scrollCarousel(direction) {
      const container = document.getElementById('carousel');
      const scrollAmount = container.clientWidth / 4;
      container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
      updateScrollProgress();
    }

    function updateScrollProgress() {
      const container = document.getElementById('carousel');
      const progress = document.getElementById('scrollProgress');
      const maxScroll = container.scrollWidth - container.clientWidth;
      const currentScroll = container.scrollLeft;
      const percentage = maxScroll > 0 ? (currentScroll / maxScroll) * 100 : 0;
      progress.style.width = Math.min(percentage + 25, 100) + '%';
    }

    function loadProducts() {
      const container = document.getElementById('carousel');
      
      // Show loading state
      container.innerHTML = '<div style="text-align: center; padding: 50px; color: #666; font-size: 14px;">Loading products...</div>';
      
      // Fetch products from API
      fetch('/api/products')
        .then(response => {
          if (!response.ok) {   
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(fetchedProducts => {
          products = fetchedProducts;
          container.innerHTML = '';
          
          products.forEach((product, i) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.id = `product-${i}`;

            card.innerHTML = `
              <img src="${product.images.yellow}" class="product-image" id="img-${i}" alt="${product.name}">
              <div class="product-title">${product.name}</div>
              <div class="price">${product.price.toFixed(2)} USD</div>
              <div class="color-dots">
                <div class="color-dot dot-yellow active" onclick="changeImage(${i}, 'yellow', ${JSON.stringify(product.images).replace(/"/g, '&quot;')})"></div>
                <div class="color-dot dot-white" onclick="changeImage(${i}, 'white', ${JSON.stringify(product.images).replace(/"/g, '&quot;')})"></div>
                <div class="color-dot dot-rose" onclick="changeImage(${i}, 'rose', ${JSON.stringify(product.images).replace(/"/g, '&quot;')})"></div>
              </div>
              <div class="color-label" id="color-label-${i}">Yellow Gold</div>
              <div class="rating">
                <div class="stars">
                  ${createStars(product.popularityScore)}
                </div>
                <span>${product.popularityScore}/5</span>
              </div>
            `;

            container.appendChild(card);
          });
          
          updateScrollProgress();
        })
        .catch(error => {
          console.error('Error fetching products:', error);
          container.innerHTML = '<div style="text-align: center; padding: 50px; color: #999; font-size: 14px;">Failed to load products. Please try again later.</div>';
        });
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', loadProducts);
    
    // Update scroll progress on scroll
    document.getElementById('carousel').addEventListener('scroll', updateScrollProgress);