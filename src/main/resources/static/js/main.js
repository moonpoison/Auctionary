// Main Application Logic
class AuctionApp {
    constructor() {
        this.products = []; // 상품 데이터를 저장할 배열
        this.currentSort = 'closing';
    }

    async init() {
        await this.fetchProducts(); // 상품 목록을 먼저 가져옴
        this.setupEventListeners();
        this.startTimer();
        this.updateWishlistCount(); // 찜 개수 업데이트
    }

    // Fetch products from the server
    async fetchProducts() {
        console.log('Fetching products from /api/products...');
        try {
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error('상품 목록을 불러오는 데 실패했습니다.');
            }

            const rawProducts = await response.json();

            // ✅ 데이터 가공
            this.products = rawProducts.map(item => ({
                id: item.productId,
                name: item.productName,
                images: item.imagePath ? [item.imagePath] : [],
                description: item.description ?? '',
                endDate: item.auctionEndDate,
                startDate: item.auctionStartDate ?? new Date().toISOString(),
                startingPrice: item.startingPrice ?? 0,
                highestBid: item.highestBid ?? item.startingPrice ?? 0,
                seller: {
                    name: item.registerUserName ?? '알 수 없음'
                },
                wishlistedCount: 0,
                tags: ['일반']
            }));

            // 각 상품의 최고가를 서버에서 가져와서 업데이트
            await this.updateProductPrices();
            await this.updateProductWishlistCounts(); // 찜 개수 업데이트

            console.log('Products fetched:', this.products);
        } catch (error) {
            console.error('Error fetching products:', error);
            this.products = [];
        }
    }

    // 각 상품의 최고가를 서버에서 가져와서 업데이트
    async updateProductPrices() {
        const pricePromises = this.products.map(async (product) => {
            try {
                const response = await fetch(`/api/bids/product/${product.id}/max`);
                if (response.ok) {
                    const data = await response.json();
                    const maxBid = data.maxBid;
                    product.highestBid = maxBid > 0 ? maxBid : product.startingPrice;
                }
            } catch (error) {
                console.error(`상품 ${product.id} 최고가 조회 오류:`, error);
                // 오류 시 시작가 유지
                product.highestBid = product.startingPrice;
            }
        });

        await Promise.all(pricePromises);
    }

    // 각 상품의 찜 개수를 서버에서 가져와서 업데이트
    async updateProductWishlistCounts() {
        const wishlistPromises = this.products.map(async (product) => {
            try {
                const response = await fetch(`/api/wishlist/product/${product.id}/count`);
                if (response.ok) {
                    const data = await response.json();
                    product.wishlistedCount = data.count || 0;
                }
            } catch (error) {
                console.error(`상품 ${product.id} 찜 개수 조회 오류:`, error);
                // 오류 시 0으로 설정
                product.wishlistedCount = 0;
            }
        });

        await Promise.all(wishlistPromises);
    }

    // Setup event listeners
    setupEventListeners() {
        const sortButtons = document.querySelectorAll('.sort-btn');
        sortButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const sortType = e.target.dataset.sort;
                this.setSortType(sortType);
            });
        });

        const chatBtn = document.getElementById('chatBtn');
        const chatModal = document.getElementById('chatModal');
        const closeChatBtn = document.getElementById('closeChatBtn');

        if (chatBtn) {
            chatBtn.addEventListener('click', () => {
                this.openChatModal();
            });
        }

        if (closeChatBtn) {
            closeChatBtn.addEventListener('click', () => {
                this.closeChatModal();
            });
        }

        if (chatModal) {
            chatModal.addEventListener('click', (e) => {
                if (e.target === chatModal) {
                    this.closeChatModal();
                }
            });
        }

        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));
        }
    }

    // Set sort type and update UI
    setSortType(sortType) {
        this.currentSort = sortType;

        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-sort="${sortType}"]`)?.classList.add('active');

        this.renderAuctionGrid();
    }

    // Render auction grid
    renderAuctionGrid() {
        const grid = document.getElementById('auctionGrid');
        if (!grid) return;

        const sortedItems = sortAuctionItems(this.products, this.currentSort);
        auctionCardManager.renderCards(sortedItems, grid);
    }

    // Handle search
    handleSearch(query) {
        if (!query.trim()) {
            this.renderAuctionGrid();
            return;
        }

        const filteredItems = this.products.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
        );

        const grid = document.getElementById('auctionGrid');
        if (grid) {
            auctionCardManager.renderCards(filteredItems, grid);
        }
    }

    // Open chat modal
    openChatModal() {
        if (!authManager.isLoggedIn()) {
            alert("로그인이 필요합니다.");
            return;
        }

        const modal = document.getElementById('chatModal');
        if (modal) {
            modal.classList.add('show');
            this.loadChatList();
        }
    }

    // Close chat modal
    closeChatModal() {
        const modal = document.getElementById('chatModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // Load chat list (MOCK only)
    loadChatList() {
        const chatList = document.getElementById('chatList');
        if (!chatList) return;

        const user = authManager.getUser();
        if (!user) return;

        const userConversations = MOCK_CONVERSATIONS.filter(conv =>
            conv.participants.some(p => p.id === user.id)
        );

        if (userConversations.length === 0) {
            chatList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">채팅 내역이 없습니다.</p>';
            return;
        }

        chatList.innerHTML = userConversations.map(conv => {
            const other = conv.participants.find(p => p.id !== user.id);
            const lastMsg = conv.messages[conv.messages.length - 1];

            return `
                <div class="chat-item" onclick="auctionApp.openChat('${conv.id}')">
                    <div class="chat-item-image">
                        <img src="${conv.itemImage}" alt="${conv.itemName}">
                    </div>
                    <div class="chat-item-content">
                        <h4>${conv.itemName}</h4>
                        <p>${other ? other.name : 'Unknown'}</p>
                        <small>${lastMsg ? lastMsg.text : '메시지 없음'}</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Open specific chat
    openChat(conversationId) {
        console.log('Opening chat:', conversationId);
        this.closeChatModal();
    }

    // Start countdown timer
    startTimer() {
        setInterval(() => {
            auctionCardManager.updateTimers(this.products);
        }, 1000);
        
        // 가격 업데이트 타이머 (30초마다)
        setInterval(async () => {
            await this.updateProductPrices();
            await this.updateProductWishlistCounts(); // 찜 개수 업데이트
            this.renderAuctionGrid();
        }, 30000);
    }

    // 찜 개수 업데이트
    async updateWishlistCount() {
        try {
            // 로그인 상태 확인
            const savedUser = localStorage.getItem('currentUser');
            if (!savedUser) {
                this.setWishlistCount(0);
                return;
            }

            const response = await fetch('/api/wishlist', {
                credentials: 'include'
            });

            if (response.ok) {
                const wishlist = await response.json();
                this.setWishlistCount(wishlist.length);
            } else {
                this.setWishlistCount(0);
            }
        } catch (error) {
            console.error('찜 개수 업데이트 오류:', error);
            this.setWishlistCount(0);
        }
    }

    // 찜 개수 표시
    setWishlistCount(count) {
        const wishlistCountElement = document.querySelector('.wishlist-count');
        if (wishlistCountElement) {
            wishlistCountElement.textContent = count;
            
            // 찜 개수가 0이면 숨기기, 있으면 보이기
            if (count > 0) {
                wishlistCountElement.style.display = 'inline';
            } else {
                wishlistCountElement.style.display = 'none';
            }
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('=== main.js DOMContentLoaded ===');

    if (authManager) {
        console.log('Initializing authManager...');
        await authManager.init();
        console.log('authManager initialized');
        console.log('Forcing UI update...');
        authManager.updateUI();
        console.log('UI update completed');
    }

    window.auctionApp = new AuctionApp();
    await window.auctionApp.init();
    window.auctionApp.renderAuctionGrid();
});

// Global registration
window.authManager = authManager;
window.auctionCardManager = auctionCardManager;
