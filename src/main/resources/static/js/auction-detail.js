class AuctionDetailManager {
    constructor() {
        this.currentItem = null;
        this.bidHistory = [];
        this.init();
    }

    async init() { // async 키워드 추가
        // Get auction ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const auctionId = urlParams.get('id');

        if (!auctionId) {
            this.showError('상품 ID가 없습니다.');
            return;
        }

        try {
            // 백엔드 API 호출하여 상품 정보 가져오기
            const response = await fetch(`/api/products/${auctionId}`);
            if (!response.ok) {
                throw new Error('상품 정보를 불러오는데 실패했습니다.');
            }
            this.currentItem = await response.json();

            if (!this.currentItem) {
                this.showError('상품을 찾을 수 없습니다.');
                return;
            }

            this.renderAuctionDetail();
            this.setupEventListeners();
            this.startCountdown();
        } catch (error) {
            console.error('상품 상세 정보 로드 중 오류 발생:', error);
            this.showError('상품을 찾을 수 없습니다.'); // 오류 발생 시 메시지 표시
        }
    }

    renderAuctionDetail() {
        const container = document.getElementById('auctionDetail');
        if (!container) return;

        const currentPrice = getCurrentPrice(this.currentItem);
        const timeLeft = formatTimeRemaining(this.currentItem.auctionEndDate); // auctionEndDate 사용
        const user = authManager.getUser();
        const isWishlisted = user && user.wishlist && user.wishlist.includes(this.currentItem.id);

        container.innerHTML = `
            <div class="auction-detail-container">
                <div class="auction-detail-images">
                    <div class="main-image">
                        <img src="/uploads/${this.currentItem.imagePath || 'placeholder.svg'}" alt="${this.currentItem.productName}" id="mainImage">
                    </div>
                    <div class="image-thumbnails">
                        ${this.currentItem.imagePath ? `
                            <div class="thumbnail active" onclick="auctionDetailManager.changeImage('/uploads/${this.currentItem.imagePath}', this)">
                                <img src="/uploads/${this.currentItem.imagePath}" alt="${this.currentItem.productName}">
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="auction-detail-info">
                    <div class="auction-detail-header">
                        <div class="auction-detail-tags">
                            <!-- 카테고리 정보가 있다면 여기에 표시 -->
                            ${this.currentItem.categoryId ? `<span class="tag">카테고리 ${this.currentItem.categoryId}</span>` : ''}
                        </div>
                        <h1 class="auction-detail-title">${this.currentItem.productName}</h1>
                        <div class="auction-detail-seller">
                            <span class="seller-name">${this.currentItem.userId || '알 수 없음'}</span>
                            <div class="seller-rating">
                                <span class="stars">★★★★★</span>
                                <span class="rating">4.8</span>
                            </div>
                        </div>
                    </div>

                    <div class="auction-detail-price">
                        <div class="current-price">
                            <span class="price-label">현재가</span>
                            <span class="price-value">${formatPrice(currentPrice)}</span>
                        </div>
                        <div class="original-price">
                            <span class="price-label">시작가</span>
                            <span class="price-value">${formatPrice(this.currentItem.startingPrice)}</span>
                        </div>
                    </div>

                    <div class="auction-detail-timer">
                        <div class="timer-label">남은 시간</div>
                        <div class="timer-value" id="countdown">
                            ${timeLeft.text}
                        </div>
                    </div>

                    <div class="auction-detail-actions">
                        <button class="btn btn-primary" onclick="auctionDetailManager.placeBid()">
                            입찰하기
                        </button>
                        <button class="btn btn-outline ${isWishlisted ? 'active' : ''}"
                                onclick="auctionDetailManager.toggleWishlist()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            찜하기
                        </button>
                        <button class="btn btn-outline" onclick="auctionDetailManager.openChat()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            채팅
                        </button>
                    </div>

                    <div class="auction-detail-description">
                        <h3>상품 설명</h3>
                        <p>${this.currentItem.description || '상품 설명이 없습니다.'}</p>
                    </div>
                </div>
            </div>

            <div class="auction-detail-tabs">
                <div class="tab-buttons">
                    <button class="tab-button active" onclick="auctionDetailManager.showTab('bids')">입찰 내역</button>
                    <button class="tab-button" onclick="auctionDetailManager.showTab('details')">상품 상세</button>
                    <button class="tab-button" onclick="auctionDetailManager.showTab('reviews')">판매자 리뷰</button>
                </div>

                <div class="tab-content">
                    <div id="bidsTab" class="tab-panel active">
                        <div class="bid-history">
                            <h3>입찰 내역</h3>
                            <div class="bid-list" id="bidList">
                                ${this.generateBidHistory()}
                            </div>
                        </div>
                    </div>

                    <div id="detailsTab" class="tab-panel">
                        <div class="product-details">
                            <h3>상품 상세 정보</h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span class="detail-label">카테고리</span>
                                    <span class="detail-value">${this.currentItem.categoryId || '기타'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">상태</span>
                                    <span class="detail-value">${this.currentItem.transactionStatus || '알 수 없음'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">배송</span>
                                    <span class="detail-value">무료배송</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="reviewsTab" class="tab-panel">
                        <div class="seller-reviews">
                            <h3>판매자 리뷰</h3>
                            <div class="review-list">
                                <div class="review-item">
                                    <div class="review-header">
                                        <span class="reviewer-name">구매자1</span>
                                        <span class="review-rating">★★★★★</span>
                                    </div>
                                    <p class="review-text">정말 좋은 판매자입니다. 상품도 만족스럽고 배송도 빠르네요!</p>
                                </div>
                                <div class="review-item">
                                    <div class="review-header">
                                        <span class="reviewer-name">구매자2</span>
                                        <span class="review-rating">★★★★☆</span>
                                    </div>
                                    <p class="review-text">상품 상태가 설명과 일치하고, 안전하게 받았습니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateBidHistory() {
        // 실제 입찰 내역 데이터가 없으므로 목 데이터 사용
        const bids = [
            { bidder: 'AuctionHero', amount: 850000, time: '2024-01-15 14:30' },
            { bidder: 'V-Tech', amount: 820000, time: '2024-01-15 14:25' },
            { bidder: 'TimeMaster', amount: 800000, time: '2024-01-15 14:20' },
            { bidder: 'Collector', amount: 780000, time: '2024-01-15 14:15' }
        ];

        return bids.map(bid => `
            <div class="bid-item">
                <div class="bid-info">
                    <span class="bidder">${bid.bidder}</span>
                    <span class="bid-amount">${formatPrice(bid.amount)}</span>
                </div>
                <span class="bid-time">${bid.time}</span>
            </div>
        `).join('');
    }

    changeImage(imageSrc, thumbnail) {
        document.getElementById('mainImage').src = imageSrc;

        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
        thumbnail.classList.add('active');
    }

    showTab(tabName) {
        // Hide all tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));

        // Show selected tab
        document.getElementById(tabName + 'Tab').classList.add('active');
        // event.target.classList.add('active'); // 이 부분은 호출하는 곳에서 event 객체가 없을 수 있으므로 주석 처리 또는 수정 필요
    }

    placeBid() {
        if (!authManager.isLoggedIn()) {
            alert('로그인이 필요합니다.');
            return;
        }

        const currentPrice = getCurrentPrice(this.currentItem);
        const minBid = currentPrice + 10000; // 최소 입찰가

        const bidAmount = prompt(`최소 입찰가: ${formatPrice(minBid)}\n입찰 금액을 입력하세요:`, minBid);

        if (bidAmount && !isNaN(bidAmount) && parseInt(bidAmount) >= minBid) {
            alert('입찰이 완료되었습니다!');
            // Here you would typically update the auction item with the new bid
            this.renderAuctionDetail(); // Refresh the display
        } else if (bidAmount !== null) {
            alert('올바른 입찰가를 입력해주세요.');
        }
    }

    toggleWishlist() {
        if (!authManager.isLoggedIn()) {
            alert('로그인이 필요합니다.');
            return;
        }

        const wasWishlisted = authManager.toggleWishlist(this.currentItem.id);
        const button = event.target.closest('button');

        if (wasWishlisted) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    }

    openChat() {
        if (!authManager.isLoggedIn()) {
            alert('로그인이 필요합니다.');
            return;
        }

        alert('채팅 기능은 준비 중입니다.');
    }

    startCountdown() {
        const countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;

        const updateCountdown = () => {
            const timeLeft = formatTimeRemaining(this.currentItem.auctionEndDate); // auctionEndDate 사용
            countdownElement.textContent = timeLeft.text;

            if (timeLeft.isOver) {
                countdownElement.textContent = '경매 종료';
                countdownElement.style.color = '#dc2626';
            }
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    setupEventListeners() {
        // Add any additional event listeners here
    }

    showError(message) {
        const container = document.getElementById('auctionDetail');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>오류</h2>
                    <p>${message}</p>
                    <a href="../index" class="btn btn-primary">메인으로 돌아가기</a>
                </div>
            `;
        }
    }
}

// Initialize auction detail manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.auctionDetailManager = new AuctionDetailManager();
}); 