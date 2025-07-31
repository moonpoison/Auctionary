// Auction Card Component
class AuctionCard {
    constructor(item) {
        this.item = item;
    }

    // Create auction card HTML
    createCard() {
        const currentPrice = getCurrentPrice(this.item);
        const timeLeft = formatTimeRemaining(this.item.endDate);
        const user = authManager.getUser();
        const isWishlisted = user && user.wishlist && user.wishlist.includes(this.item.id);

        const card = document.createElement('div');
        card.className = 'auction-card';
        card.innerHTML = `
            <a href="auction-detail?id=${this.item.id}" class="auction-card-link">
                <div class="auction-card-image">
                    <img src="${this.item.images && this.item.images[0] ? '/images/' + this.item.images[0] : '/images/placeholder.svg'}" alt="${this.item.name}" loading="lazy">
                    <div class="auction-card-badge ${timeLeft.isOver || (timeLeft.days === 0 && timeLeft.hours < 1) ? 'urgent' : ''}">
                        ${timeLeft.text}
                    </div>
                    <button class="auction-card-wishlist ${isWishlisted ? 'active' : ''}" 
                            onclick="event.preventDefault(); event.stopPropagation(); auctionCardManager.toggleWishlist('${this.item.id}', this)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
                </div>
                <div class="auction-card-content">
                    <div class="auction-card-tags">
                        <span class="auction-card-tag">${this.item.tags[0]}</span>
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

    createCard(item) {
        const auctionCard = new AuctionCard(item);
        const cardElement = auctionCard.createCard();
        this.cards.set(item.id, cardElement);
        return cardElement;
    }

    renderCards(items, container) {
        if (!container) {
            console.error('🛑 Container is null');
            return;
        }

        container.innerHTML = '';

        if (!items || items.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 20px; color: #6b7280;">표시할 상품이 없습니다.</div>';
            return;
        }

        items.forEach(item => {
            const card = this.createCard(item);
            container.appendChild(card);
        });
    }

    toggleWishlist(itemId, button) {
        const wasWishlisted = authManager.toggleWishlist(itemId);
        if (wasWishlisted) {
            button.classList.remove('active');
        } else {
            button.classList.add('active');
        }
        // TODO: 백엔드에 위시리스트 상태 반영 추가 가능
    }

    updateTimers(items) {
        this.cards.forEach((card, itemId) => {
            const item = items.find(i => i.id === itemId);
            if (item && item.status === 'active') {
                const badge = card.querySelector('.auction-card-badge');
                if (badge) {
                    const timeLeft = formatTimeRemaining(item.endDate);
                    badge.textContent = timeLeft.text;

                    if (timeLeft.isOver || (timeLeft.days === 0 && timeLeft.hours < 1)) {
                        badge.classList.add('urgent');
                    } else {
                        badge.classList.remove('urgent');
                    }
                }
            }
        });
    }
}

// 전역 등록
const auctionCardManager = new AuctionCardManager();
window.auctionCardManager = auctionCardManager;
