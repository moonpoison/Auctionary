// Main Application Logic
class AuctionApp {
    constructor() {
        this.currentSort = 'closing';
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
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
    
    // Set sort type and update UI
    setSortType(sortType) {
        this.currentSort = sortType;
        
        // Update active button
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-sort="${sortType}"]`).classList.add('active');
        
        // Re-render grid
        this.renderAuctionGrid();
    }
    
    // Render auction grid
    renderAuctionGrid() {
        const grid = document.getElementById('auctionGrid');
        if (!grid) return;
        
        const sortedItems = sortAuctionItems(MOCK_AUCTION_ITEMS, this.currentSort);
        auctionCardManager.renderCards(sortedItems, grid);
    }
    
    // Handle search
    handleSearch(query) {
        if (!query.trim()) {
            this.renderAuctionGrid();
            return;
        }
        
        const filteredItems = MOCK_AUCTION_ITEMS.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
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
    
    // Load chat list
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
    
    // Open specific chat
    openChat(conversationId) {
        // This would open a specific chat conversation
        console.log('Opening chat:', conversationId);
        this.closeChatModal();
    }
    
    // Start timer for countdown updates
    startTimer() {
        setInterval(() => {
            auctionCardManager.updateTimers();
        }, 1000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('=== main.js DOMContentLoaded ===');
    
    // AuthManager 초기화
    if (authManager) {
        console.log('Initializing authManager...');
        await authManager.init();
        console.log('authManager initialized');
        
        // UI 업데이트 강제 호출
        console.log('Forcing UI update...');
        authManager.updateUI();
        console.log('UI update completed');
    }
    
    // AuctionApp 초기화
    window.auctionApp = new AuctionApp();
    
    // authManager 초기화 후 상품들을 다시 렌더링
    if (window.auctionApp) {
        window.auctionApp.renderAuctionGrid();
    }
});

// Global functions for onclick handlers
window.authManager = authManager;
window.auctionCardManager = auctionCardManager; 