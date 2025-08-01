// Auction Card Component
class AuctionCard {
    constructor(item) {
        this.item = item;
    }

    // Create auction card HTML
    createCard() {
        const currentPrice = this.getCurrentPrice(this.item);
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

    // 현재가 계산 (highestBid 또는 startingPrice 중 높은 값)
    getCurrentPrice(item) {
        return item.highestBid || item.startingPrice;
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

    async toggleWishlist(itemId, button) {
        // 로그인 상태 확인
        const savedUser = localStorage.getItem('currentUser');
        if (!savedUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await fetch(`/api/wishlist/${itemId}`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                console.log('찜 처리 결과:', result);
                
                // 서버 응답에 따라 버튼 상태 업데이트
                if (result.action === 'added') {
                    button.classList.add('active');
                } else if (result.action === 'removed') {
                    button.classList.remove('active');
                }
                
                // 메인페이지의 찜 개수 업데이트
                if (window.auctionApp && window.auctionApp.updateWishlistCount) {
                    await window.auctionApp.updateWishlistCount();
                }
                
                // 상품카드의 찜 개수 업데이트
                if (window.auctionApp && window.auctionApp.updateProductWishlistCounts) {
                    await window.auctionApp.updateProductWishlistCounts();
                    window.auctionApp.renderAuctionGrid();
                }
            } else {
                alert('찜 처리 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('찜 처리 중 오류:', error);
            alert('찜 처리 중 오류가 발생했습니다.');
        }
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
