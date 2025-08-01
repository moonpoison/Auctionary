class AuctionDetailManager {
    constructor() {
        this.currentItem = null;
        this.init();
    }

    async init() {
        console.log('AuctionDetailManager 초기화 시작');
        
        this.loadAuctionDetail();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 입찰 버튼 이벤트
        const bidButton = document.getElementById('bidButton');
        if (bidButton) {
            bidButton.addEventListener('click', () => this.placeBid());
        }

        // 찜 버튼 이벤트
        const wishlistButton = document.getElementById('wishlistButton');
        if (wishlistButton) {
            wishlistButton.addEventListener('click', () => this.toggleWishlist());
        }

        // 탭 전환 이벤트
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.showTab(e.target.dataset.tab);
            });
        });
    }

    async loadAuctionDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) {
            console.error('상품 ID가 없습니다.');
            return;
        }

        try {
            const response = await fetch(`/api/products/${productId}`);
            if (!response.ok) {
                throw new Error('상품 정보를 불러올 수 없습니다.');
            }
            
            this.currentItem = await response.json();
            await this.renderAuctionDetail();
            this.loadBidHistory();
            this.checkWishlistStatus();
            
        } catch (error) {
            console.error('상품 정보 로딩 오류:', error);
            this.showError('상품 정보를 불러올 수 없습니다.');
        }
    }

    async renderAuctionDetail() {
        if (!this.currentItem) return;

        const container = document.getElementById('auctionDetail');
        if (!container) return;

        const currentPrice = await this.getCurrentPrice(this.currentItem);
        const timeLeft = this.calculateTimeLeft(this.currentItem.auctionEndDate);
        
        // 이미지 경로 처리
        let imagePath = this.currentItem.imagePath || '/images/placeholder.svg';
        if (imagePath && !imagePath.startsWith('/images/') && !imagePath.startsWith('http')) {
            imagePath = '/images/' + imagePath;
        }

        container.innerHTML = `
            <div class="auction-header">
                <h1>${this.currentItem.productName}</h1>
                <div class="auction-status ${this.currentItem.transactionStatus.toLowerCase()}">
                    ${this.getStatusText(this.currentItem.transactionStatus)}
                </div>
            </div>
            
            <div class="auction-image">
                <img src="${imagePath}" alt="${this.currentItem.productName}" onerror="this.src='/images/placeholder.svg'">
            </div>
            
            <div class="auction-info">
                <div class="price-section">
                    <div class="current-price">
                        <span class="label">현재가</span>
                        <span class="amount" id="currentPriceDisplay">${this.formatPrice(currentPrice)}</span>
                    </div>
                    <div class="starting-price">
                        <span class="label">시작가</span>
                        <span class="amount">${this.formatPrice(this.currentItem.startingPrice)}</span>
                    </div>
                    <div class="bid-unit">
                        <span class="label">입찰 단위</span>
                        <span class="amount">${this.formatPrice(this.currentItem.bidUnit)}</span>
                    </div>
                </div>
                
                <div class="time-section">
                    <div class="time-left">
                        <span class="label">남은 시간</span>
                        <span class="amount ${timeLeft.isExpired ? 'expired' : ''}">${timeLeft.text}</span>
                    </div>
                    <div class="auction-dates">
                        <div>시작: ${this.formatDate(this.currentItem.auctionStartDate)}</div>
                        <div>종료: ${this.formatDate(this.currentItem.auctionEndDate)}</div>
                    </div>
                </div>
                
                <div class="action-section">
                    <button id="bidButton" class="bid-button" ${this.canBid() ? '' : 'disabled'}>
                        입찰하기
                    </button>
                    <button id="wishlistButton" class="wishlist-button">
                        <span class="wishlist-icon">♡</span>
                        <span class="wishlist-text">찜하기</span>
                    </button>
                </div>
            </div>
            
            <div class="auction-description">
                <h3>상품 설명</h3>
                <p>${this.currentItem.description}</p>
            </div>
        `;

        this.setupEventListeners();
    }

    async placeBid() {
        console.log('입찰 시도');
        
        // 로그인 상태 확인
        const isLoggedIn = await this.isUserLoggedIn();
        console.log('로그인 상태:', isLoggedIn);
        
        if (!isLoggedIn) {
            console.log('로그인 필요 - 로그인 페이지로 이동');
            window.location.href = '/login';
            return;
        }

        const currentPrice = this.getCurrentPrice(this.currentItem);
        const minBid = currentPrice + this.currentItem.bidUnit;

        const bidAmountStr = prompt(
            `💰 현재가: ${this.formatPrice(currentPrice)}\n📈 최소 입찰가: ${this.formatPrice(minBid)}\n\n입찰 금액을 입력하세요:`,
            minBid
        );

        if (bidAmountStr === null) return;

        const bidAmount = parseInt(bidAmountStr);
        if (isNaN(bidAmount) || bidAmount < minBid) {
            alert('올바른 입찰가를 입력해주세요.');
            return;
        }

        const bidData = {
            productId: this.currentItem.productId,
            bidPrice: bidAmount
        };

        try {
            const response = await fetch('/api/bids', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bidData),
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message || '입찰이 완료되었습니다!');
                
                // 입찰 후 현재가 업데이트
                await this.updateCurrentPrice();
                await this.renderAuctionDetail();
                this.loadBidHistory();
            } else {
                const errorText = await response.text();
                if (errorText.includes("포인트가 부족합니다")) {
                    alert('포인트가 부족합니다. 포인트를 충전해주세요.');
                } else {
                    alert('입찰 실패: ' + errorText);
                }
            }
        } catch (error) {
            console.error('입찰 중 오류 발생:', error);
            alert('입찰 처리 중 오류가 발생했습니다.');
        }
    }

    async toggleWishlist() {
        console.log('찜하기 시도');
        
        // 로그인 상태 확인
        const isLoggedIn = await this.isUserLoggedIn();
        console.log('로그인 상태:', isLoggedIn);
        
        if (!isLoggedIn) {
            console.log('로그인 필요 - 로그인 페이지로 이동');
            window.location.href = '/login';
            return;
        }

        const wishlistButton = document.getElementById('wishlistButton');
        const isWishlisted = wishlistButton.classList.contains('wishlisted');

        try {
            const response = await fetch(`/api/wishlist/${this.currentItem.productId}`, {
                method: isWishlisted ? 'DELETE' : 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                if (isWishlisted) {
                    wishlistButton.classList.remove('wishlisted');
                    wishlistButton.querySelector('.wishlist-icon').textContent = '♡';
                    wishlistButton.querySelector('.wishlist-text').textContent = '찜하기';
                } else {
                    wishlistButton.classList.add('wishlisted');
                    wishlistButton.querySelector('.wishlist-icon').textContent = '♥';
                    wishlistButton.querySelector('.wishlist-text').textContent = '찜됨';
                }
            } else {
                alert('찜 처리 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('찜 처리 중 오류:', error);
            alert('찜 처리 중 오류가 발생했습니다.');
        }
    }

    // 로그인 상태 확인 (localStorage 우선)
    async isUserLoggedIn() {
        console.log('로그인 상태 확인 시작');
        
        // 1. localStorage 확인 (가장 우선)
        const savedUser = localStorage.getItem('currentUser');
        console.log('localStorage currentUser:', savedUser);
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                console.log('localStorage 파싱된 사용자:', user);
                if (user && user.userId) {
                    console.log('localStorage로 로그인 확인됨');
                    return true;
                }
            } catch (e) {
                console.error('localStorage 파싱 오류:', e);
            }
        }
        
        // 2. 세션 스토리지 확인
        const sessionUser = sessionStorage.getItem('currentUser');
        console.log('sessionStorage currentUser:', sessionUser);
        if (sessionUser) {
            try {
                const user = JSON.parse(sessionUser);
                console.log('sessionStorage 파싱된 사용자:', user);
                if (user && user.userId) {
                    console.log('sessionStorage로 로그인 확인됨');
                    return true;
                }
            } catch (e) {
                console.error('sessionStorage 파싱 오류:', e);
            }
        }
        
        // 3. authManager 확인 (선택적)
        if (window.authManager && window.authManager.isLoggedIn) {
            console.log('authManager 존재함');
            const authLoggedIn = window.authManager.isLoggedIn();
            console.log('authManager.isLoggedIn():', authLoggedIn);
            if (authLoggedIn) {
                console.log('authManager로 로그인 확인됨');
                return true;
            }
        } else {
            console.log('authManager 없음 또는 isLoggedIn 메서드 없음');
        }
        
        console.log('모든 방법으로 로그인 확인 실패');
        return false;
    }

    async checkWishlistStatus() {
        if (!await this.isUserLoggedIn()) {
            console.log('찜 상태 확인 건너뜀 - 로그인 안됨');
            return;
        }

        try {
            const response = await fetch(`/api/wishlist/check/${this.currentItem.productId}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                const wishlistButton = document.getElementById('wishlistButton');
                
                if (data.isWishlisted) {
                    wishlistButton.classList.add('wishlisted');
                    wishlistButton.querySelector('.wishlist-icon').textContent = '♥';
                    wishlistButton.querySelector('.wishlist-text').textContent = '찜됨';
                }
            }
        } catch (error) {
            console.error('찜 상태 확인 중 오류:', error);
        }
    }

    async loadBidHistory() {
        try {
            const response = await fetch(`/api/bids/product/${this.currentItem.productId}`);
            if (response.ok) {
                const bids = await response.json();
                this.renderBidHistory(bids);
            }
        } catch (error) {
            console.error('입찰 내역 로딩 오류:', error);
        }
    }

    renderBidHistory(bids) {
        const container = document.getElementById('bidHistory');
        if (!container) return;

        if (bids.length === 0) {
            container.innerHTML = '<p class="no-bids">아직 입찰이 없습니다.</p>';
            return;
        }

        container.innerHTML = bids.map(bid => `
            <div class="bid-item">
                <div class="bid-user">${this.maskUserId(bid.bidUserId)}</div>
                <div class="bid-price">${this.formatPrice(bid.bidPrice)}</div>
                <div class="bid-time">${this.formatTime(bid.bidDate)}</div>
            </div>
        `).join('');
    }

    // 현재가 계산 (서버에서 최고가 가져오기)
    async getCurrentPrice(item) {
        try {
            const response = await fetch(`/api/bids/product/${item.productId}/max`);
            if (response.ok) {
                const data = await response.json();
                const maxBid = data.maxBid;
                return maxBid > 0 ? maxBid : item.startingPrice;
            }
        } catch (error) {
            console.error('최고가 조회 오류:', error);
        }
        
        // 오류 시 시작가 반환
        return item.startingPrice;
    }

    // 현재가 업데이트
    async updateCurrentPrice() {
        try {
            const response = await fetch(`/api/bids/product/${this.currentItem.productId}/max`);
            if (response.ok) {
                const data = await response.json();
                const maxBid = data.maxBid;
                
                // 현재가 표시 업데이트
                const currentPriceDisplay = document.getElementById('currentPriceDisplay');
                if (currentPriceDisplay) {
                    const displayPrice = maxBid > 0 ? maxBid : this.currentItem.startingPrice;
                    currentPriceDisplay.textContent = this.formatPrice(displayPrice);
                }
            }
        } catch (error) {
            console.error('현재가 업데이트 오류:', error);
        }
    }

    calculateTimeLeft(endDate) {
        const now = new Date();
        const end = new Date(endDate);
        const diff = end - now;

        if (diff <= 0) {
            return { text: '경매 종료', isExpired: true };
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return { text: `${days}일 ${hours}시간`, isExpired: false };
        } else if (hours > 0) {
            return { text: `${hours}시간 ${minutes}분`, isExpired: false };
        } else {
            return { text: `${minutes}분`, isExpired: false };
        }
    }

    canBid() {
        if (!this.currentItem) return false;
        
        const timeLeft = this.calculateTimeLeft(this.currentItem.auctionEndDate);
        return !timeLeft.isExpired && this.currentItem.transactionStatus === 'AUCTIONING';
    }

    getStatusText(status) {
        switch (status) {
            case 'AUCTIONING': return '경매중';
            case 'ENDED': return '경매종료';
            case 'SOLD': return '낙찰완료';
            default: return status;
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('ko-KR').format(price) + '원';
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleString('ko-KR');
    }

    formatTime(dateString) {
        return new Date(dateString).toLocaleString('ko-KR');
    }

    maskUserId(userId) {
        if (userId.length <= 2) return userId;
        return userId.substring(0, 2) + '*'.repeat(userId.length - 2);
    }

    showTab(tabName) {
        const tabs = document.querySelectorAll('.tab-content');
        const buttons = document.querySelectorAll('.tab-button');

        tabs.forEach(tab => tab.classList.remove('active'));
        buttons.forEach(btn => btn.classList.remove('active'));

        document.getElementById(tabName + 'Tab').classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    showError(message) {
        const container = document.getElementById('auctionDetail');
        if (container) {
            container.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('AuctionDetailManager DOMContentLoaded');
    new AuctionDetailManager();
}); 