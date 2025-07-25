// My Page Logic
class MyPage {
    constructor() {
        this.currentTab = 'overview';
        this.init();
    }
    
    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadUserProfile();
        this.loadTabContent();
    }
    
    // Check if user is logged in
    checkAuth() {
        if (!authManager.isLoggedIn()) {
            window.location.href = 'login';
            return;
        }
    }
    
    // Setup event listeners
    setupEventListeners() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }
    
    // Switch tab
    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Show active tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
        
        // Load tab content
        this.loadTabContent();
    }
    
    // Load user profile
    loadUserProfile() {
        const user = authManager.getUser();
        if (!user) return;
        
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userPoints').textContent = user.points.toLocaleString();
        document.getElementById('wishlistCount').textContent = user.wishlist ? user.wishlist.length : 0;
    }
    
    // Load tab content
    loadTabContent() {
        switch (this.currentTab) {
            case 'overview':
                this.loadOverview();
                break;
            case 'bidding':
                this.loadBidding();
                break;
            case 'selling':
                this.loadSelling();
                break;
            case 'purchased':
                this.loadPurchased();
                break;
            case 'wishlist':
                this.loadWishlist();
                break;
            case 'reviews':
                this.loadReviews();
                break;
        }
    }
    
    // Load overview content
    loadOverview() {
        const user = authManager.getUser();
        if (!user) return;
        
        // Load recent activity
        this.loadRecentActivity();
        
        // Load points history
        this.loadPointsHistory();
    }
    
    // Load recent activity
    loadRecentActivity() {
        const activityList = document.getElementById('recentActivity');
        if (!activityList) return;
        
        const user = authManager.getUser();
        const userBids = MOCK_AUCTION_ITEMS.filter(item => 
            item.bids.some(bid => bid.userId === user.id)
        ).slice(0, 5);
        
        if (userBids.length === 0) {
            activityList.innerHTML = '<p style="text-align: center; color: #6b7280;">최근 활동이 없습니다.</p>';
            return;
        }
        
        activityList.innerHTML = userBids.map(item => {
            const lastBid = item.bids.find(bid => bid.userId === user.id);
            return `
                <div class="activity-item">
                    <div class="activity-icon">💰</div>
                    <div class="activity-content">
                        <div class="activity-title">${item.name} 입찰</div>
                        <div class="activity-time">${formatPrice(lastBid.amount)} • ${this.formatTime(lastBid.time)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Load points history
    loadPointsHistory() {
        const pointsHistory = document.getElementById('pointsHistory');
        if (!pointsHistory) return;
        
        // Mock points history
        const history = [
            { type: 'charge', amount: 10000000, description: '계좌이체 충전', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
            { type: 'purchase', amount: -8600000, description: "'빈티지 롤렉스' 낙찰", date: new Date(Date.now() - 10 * 60 * 1000) },
            { type: 'bid_place', amount: -1600000, description: "'사이버펑크 그래픽카드' 입찰", date: new Date(Date.now() - 3 * 60 * 60 * 1000) },
            { type: 'sale', amount: 250000, description: "'슈퍼 패미컴' 판매 완료", date: new Date(Date.now() - 1 * 60 * 60 * 1000) }
        ];
        
        pointsHistory.innerHTML = history.map(item => `
            <div class="points-item">
                <div class="points-info">
                    <div class="points-description">${item.description}</div>
                    <div class="points-date">${this.formatTime(item.date)}</div>
                </div>
                <div class="points-amount ${item.amount > 0 ? 'positive' : 'negative'}">
                    ${item.amount > 0 ? '+' : ''}${formatPrice(item.amount)}
                </div>
            </div>
        `).join('');
    }
    
    // Load bidding history
    loadBidding() {
        const biddingList = document.getElementById('biddingList');
        if (!biddingList) return;
        
        const user = authManager.getUser();
        const userBids = MOCK_AUCTION_ITEMS.filter(item => 
            item.bids.some(bid => bid.userId === user.id)
        );
        
        if (userBids.length === 0) {
            biddingList.innerHTML = '<p style="text-align: center; color: #6b7280;">입찰 내역이 없습니다.</p>';
            return;
        }
        
        biddingList.innerHTML = userBids.map(item => {
            const userBid = item.bids.find(bid => bid.userId === user.id);
            const currentPrice = getCurrentPrice(item);
            const isWinner = item.winnerId === user.id;
            
            return `
                <div class="list-item">
                    <img src="${item.images[0]}" alt="${item.name}" class="list-item-image">
                    <div class="list-item-content">
                        <div class="list-item-title">${item.name}</div>
                        <div class="list-item-price">${formatPrice(currentPrice)}</div>
                        <span class="list-item-status ${item.status === 'active' ? 'active' : item.status === 'sold' ? 'sold' : 'ended'}">
                            ${item.status === 'active' ? '진행중' : item.status === 'sold' ? (isWinner ? '낙찰' : '낙찰실패') : '종료'}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Load selling history
    loadSelling() {
        const sellingList = document.getElementById('sellingList');
        if (!sellingList) return;
        
        const user = authManager.getUser();
        const userItems = MOCK_AUCTION_ITEMS.filter(item => item.sellerId === user.id);
        
        if (userItems.length === 0) {
            sellingList.innerHTML = '<p style="text-align: center; color: #6b7280;">판매 내역이 없습니다.</p>';
            return;
        }
        
        sellingList.innerHTML = userItems.map(item => {
            const currentPrice = getCurrentPrice(item);
            
            return `
                <div class="list-item">
                    <img src="${item.images[0]}" alt="${item.name}" class="list-item-image">
                    <div class="list-item-content">
                        <div class="list-item-title">${item.name}</div>
                        <div class="list-item-price">${formatPrice(currentPrice)}</div>
                        <span class="list-item-status ${item.status === 'active' ? 'active' : item.status === 'sold' ? 'sold' : 'ended'}">
                            ${item.status === 'active' ? '진행중' : item.status === 'sold' ? '판매완료' : '종료'}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Load purchased items
    loadPurchased() {
        const purchasedList = document.getElementById('purchasedList');
        if (!purchasedList) return;
        
        const user = authManager.getUser();
        const purchasedItems = MOCK_AUCTION_ITEMS.filter(item => 
            item.status === 'sold' && item.winnerId === user.id
        );
        
        if (purchasedItems.length === 0) {
            purchasedList.innerHTML = '<p style="text-align: center; color: #6b7280;">구매 내역이 없습니다.</p>';
            return;
        }
        
        purchasedList.innerHTML = purchasedItems.map(item => {
            const winningBid = item.bids.find(bid => bid.userId === user.id);
            
            return `
                <div class="list-item">
                    <img src="${item.images[0]}" alt="${item.name}" class="list-item-image">
                    <div class="list-item-content">
                        <div class="list-item-title">${item.name}</div>
                        <div class="list-item-price">${formatPrice(winningBid.amount)}</div>
                        <span class="list-item-status sold">구매완료</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Load wishlist
    loadWishlist() {
        const wishlistGrid = document.getElementById('wishlistGrid');
        if (!wishlistGrid) return;
        
        const user = authManager.getUser();
        const wishlistItems = MOCK_AUCTION_ITEMS.filter(item => 
            user.wishlist && user.wishlist.includes(item.id)
        );
        
        if (wishlistItems.length === 0) {
            wishlistGrid.innerHTML = '<p style="text-align: center; color: #6b7280;">찜한 상품이 없습니다.</p>';
            return;
        }
        
        auctionCardManager.renderCards(wishlistItems, wishlistGrid);
    }
    
    // Load reviews
    loadReviews() {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;
        
        const user = authManager.getUser();
        const userReviews = user.reviews || [];
        
        if (userReviews.length === 0) {
            reviewsList.innerHTML = '<p style="text-align: center; color: #6b7280;">받은 리뷰가 없습니다.</p>';
            return;
        }
        
        reviewsList.innerHTML = userReviews.map(review => {
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            
            return `
                <div class="review-item">
                    <div class="review-header">
                        <div class="reviewer-name">${review.reviewerName}</div>
                        <div class="review-rating">${stars}</div>
                    </div>
                    <div class="review-item-title">${review.itemTitle}</div>
                    <div class="review-comment">${review.comment}</div>
                    <div class="review-date">${this.formatTime(review.createdAt)}</div>
                </div>
            `;
        }).join('');
    }
    
    // Format time
    formatTime(date) {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (minutes < 1) return '방금 전';
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        if (days < 7) return `${days}일 전`;
        
        return date.toLocaleDateString('ko-KR');
    }
}

// Initialize my page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.myPage = new MyPage();
}); 