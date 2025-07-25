// Auction Card Component
class AuctionCard {
    constructor(item) {
        this.item = item;
    }
    
    // Create auction card HTML
    createCard() {
        const currentPrice = getCurrentPrice(this.item);
        const timeLeft = formatTimeRemaining(this.item.endDate);
        const isItemWishlisted = isWishlisted(authManager.getUser(), this.item.id);
        
        const card = document.createElement('div');
        card.className = 'auction-card';
        card.innerHTML = `
            <a href="pages/auction/${this.item.id}" class="auction-card-link">
                <div class="auction-card-image">
                    <img src="${this.item.images[0] || 'images/placeholder.svg'}" alt="${this.item.name}" loading="lazy">
                    <div class="auction-card-badge ${timeLeft.isOver || (timeLeft.days === 0 && timeLeft.hours < 1) ? 'urgent' : ''}">
                        ${timeLeft.text}
                    </div>
                    <button class="auction-card-wishlist ${isItemWishlisted ? 'active' : ''}" 
                            onclick="event.preventDefault(); event.stopPropagation(); auctionCardManager.toggleWishlist('${this.item.id}', this)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                </div>
                <div class="auction-card-content">
                    <div class="auction-card-tags">
                        ${this.item.tags.slice(0, 2).map(tag => `<span class="auction-card-tag">${tag}</span>`).join('')}
                    </div>
                    <h3 class="auction-card-title">${this.item.name}</h3>
                    <div class="auction-card-seller">
                        <span class="auction-card-seller-name">${this.item.seller.name}</span>
                        <div class="auction-card-wishlist-count">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            <span>${this.item.wishlistedCount}</span>
                        </div>
                    </div>
                </div>
                <div class="auction-card-footer">
                    <div class="auction-card-price">
                        <p class="auction-card-price-label">현재가</p>
                        <p class="auction-card-price-value">${formatPrice(currentPrice)}</p>
                    </div>
                </div>
            </a>
        `;
        
        return card;
    }
}

// Auction Card Manager
class AuctionCardManager {
    constructor() {
        this.cards = new Map();
    }
    
    // Create and render auction card
    createCard(item) {
        const auctionCard = new AuctionCard(item);
        const cardElement = auctionCard.createCard();
        this.cards.set(item.id, cardElement);
        return cardElement;
    }
    
    // Render all auction cards
    renderCards(items, container) {
        container.innerHTML = '';
        items.forEach(item => {
            const card = this.createCard(item);
            container.appendChild(card);
        });
    }
    
    // Toggle wishlist for an item
    toggleWishlist(itemId, button) {
        const wasWishlisted = authManager.toggleWishlist(itemId);
        
        if (wasWishlisted) {
            button.classList.remove('active');
        } else {
            button.classList.add('active');
        }
        
        // Update wishlist count
        const card = this.cards.get(itemId);
        if (card) {
            const wishlistCount = card.querySelector('.auction-card-wishlist-count span');
            const item = MOCK_AUCTION_ITEMS.find(i => i.id === itemId);
            if (wishlistCount && item) {
                wishlistCount.textContent = item.wishlistedCount;
            }
        }
    }
    
    // Update countdown timers
    updateTimers() {
        this.cards.forEach((card, itemId) => {
            const item = MOCK_AUCTION_ITEMS.find(i => i.id === itemId);
            if (item && item.status === 'active') {
                const badge = card.querySelector('.auction-card-badge');
                if (badge) {
                    const timeLeft = formatTimeRemaining(item.endDate);
                    badge.textContent = timeLeft.text;
                    
                    if (timeLeft.isOver) {
                        badge.classList.add('urgent');
                    } else if (timeLeft.days === 0 && timeLeft.hours < 1) {
                        badge.classList.add('urgent');
                    } else {
                        badge.classList.remove('urgent');
                    }
                }
            }
        });
    }
}

// Initialize auction card manager
const auctionCardManager = new AuctionCardManager(); 