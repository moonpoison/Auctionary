// Main Application Logic
class AuctionApp {
    constructor() {
        this.currentSort = 'closing';
        this.products = []; // ✅ 실제 상품 데이터 저장
        this.init();
    }

    async init() {
        this.setupEventListeners();

        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                this.products = await res.json();
            } else {
                console.error('상품 목록 요청 실패:', res.statusText);
            }
        } catch (err) {
            console.error('상품 목록 요청 중 오류:', err);
        }

        this.renderAuctionGrid();
        this.startTimer();
    }

    // Setup event listeners
    setupEventListeners() {
        // Sort buttons
        const sortButtons = document.querySelectorAll('.sort-btn');
        sortButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const sortType = e.target.dataset.sort;
                this.setSortType(sortType);
            });
        });

        // Chat modal
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

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));
        }
    }

    setSortType(sortType) {
        this.currentSort = sortType;

        // UI 업데이트
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-sort="${sortType}"]`).classList.add('active');

        this.renderAuctionGrid();
    }

    async renderAuctionGrid() {
        const grid = document.getElementById('auctionGrid');
        if (!grid) return;

        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('상품 목록 요청 실패');

            const products = await response.json();

            if (!products || products.length === 0) {
                grid.innerHTML = '<p>등록된 상품이 없습니다.</p>';
                return;
            }

            // 데이터 변환: 서버 응답 데이터를 카드 렌더링에 맞게 매핑
            const items = products.map(p => ({
                id: p.productId,
                name: p.productName,
                description: p.description,
                tags: [p.categoryName || '기타'],
                images: [p.imagePath],
                seller: { name: '등록자' }, // 백엔드 연동 시 사용자명으로 대체 가능
                startingPrice: p.startingPrice,
                highestBid: p.highestBid,
                endDate: p.auctionEndDate,
                wishlistedCount: 0,
                status: 'active'
            }));

            // 현재 정렬 타입에 따라 상품 정렬
            const sortedItems = sortAuctionItems(items, this.currentSort);

            auctionCardManager.renderCards(sortedItems, grid);
        } catch (error) {
            console.error('상품 목록을 불러오는 중 오류 발생:', error);
            grid.innerHTML = '<p>상품 목록을 불러오는 중 오류가 발생했습니다.</p>';
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.renderAuctionGrid();
            return;
        }

        const filteredItems = this.products.filter(item =>
            item.productName.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );

        const grid = document.getElementById('auctionGrid');
        if (grid) {
            auctionCardManager.renderCards(filteredItems, grid);
        }
    }

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

    closeChatModal() {
        const modal = document.getElementById('chatModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

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
            const otherParticipant = conv.participants.find(p => p.id !== user.id);
            const lastMessage = conv.messages[conv.messages.length - 1];

            return `
                <div class="chat-item" onclick="auctionApp.openChat('${conv.id}')">
                    <div class="chat-item-image">
                        <img src="${conv.itemImage}" alt="${conv.itemName}">
                    </div>
                    <div class="chat-item-content">
                        <h4>${conv.itemName}</h4>
                        <p>${otherParticipant ? otherParticipant.name : 'Unknown'}</p>
                        <small>${lastMessage ? lastMessage.text : '메시지 없음'}</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    openChat(conversationId) {
        console.log('Opening chat:', conversationId);
        this.closeChatModal();
    }

    startTimer() {
        setInterval(() => {
            auctionCardManager.updateTimers(this.products);
        }, 1000);
    }
}



// 유틸 함수들
function formatPrice(price) {
    return price.toLocaleString('ko-KR');
}

function getTimeRemaining(endTime) {
    const total = Date.parse(endTime) - Date.parse(new Date());
    if (total < 0) return '경매 종료';

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
}

// 정렬 함수
function sortAuctionItems(items, sortType) {
    const sorted = [...items];
    switch (sortType) {
        case 'closing':
            return sorted.sort((a, b) => {
                const now = new Date();
                const aEnded = new Date(a.endDate) < now;
                const bEnded = new Date(b.endDate) < now;

                console.log(`Comparing ${a.name} (ended: ${aEnded}, endDate: ${a.endDate}, parsedEndDate: ${new Date(a.endDate)}, now: ${now}) with ${b.name} (ended: ${bEnded}, endDate: ${b.endDate}, parsedEndDate: ${new Date(b.endDate)}, now: ${now})`);

                if (aEnded && !bEnded) {
                    return 1; // a (ended) comes after b (not ended)
                }
                if (!aEnded && bEnded) {
                    return -1; // a (not ended) comes before b (ended)
                }
                // If both are ended or both are not ended, sort by end date
                return new Date(a.endDate) - new Date(b.endDate);
            });
        case 'popular':
            return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        case 'newest':
            return sorted.sort((a, b) => new Date(b.auctionStartDate) - new Date(a.auctionStartDate));
        case 'highPrice':
            return sorted.sort((a, b) => b.startingPrice - a.startingPrice);
        case 'lowPrice':
            return sorted.sort((a, b) => a.startingPrice - b.startingPrice);
        default:
            return items;
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', async () => {
    if (authManager) {
        await authManager.init();
    }

    window.auctionApp = new AuctionApp();
});
