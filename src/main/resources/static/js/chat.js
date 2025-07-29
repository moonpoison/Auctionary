// Chat Management
class ChatManager {
    constructor() {
        this.currentChat = null;
        this.chatList = [];
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadChatList();
    }
    
    setupEventListeners() {
        // 채팅 버튼 클릭 이벤트
        const chatBtn = document.getElementById('chatBtn');
        if (chatBtn) {
            chatBtn.addEventListener('click', () => {
                this.openChatModal();
            });
        }
        
        // 채팅 모달 닫기 버튼
        const closeChatBtn = document.getElementById('closeChatBtn');
        if (closeChatBtn) {
            closeChatBtn.addEventListener('click', () => {
                this.closeChatModal();
            });
        }
        
        // 채팅 모달 외부 클릭 시 닫기
        const chatModal = document.getElementById('chatModal');
        if (chatModal) {
            chatModal.addEventListener('click', (e) => {
                if (e.target === chatModal) {
                    this.closeChatModal();
                }
            });
        }
    }
    
    // 채팅 모달 열기
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
    
    // 채팅 모달 닫기
    closeChatModal() {
        const modal = document.getElementById('chatModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
    
    // 채팅 목록 로드
    async loadChatList() {
        const chatList = document.getElementById('chatList');
        if (!chatList) return;
        
        const user = authManager.getUser();
        if (!user) return;
        
        try {
            const response = await fetch(`/api/chat/conversations?userId=${user.userId}`);
            if (!response.ok) {
                throw new Error('Failed to load conversations');
            }
            
            const conversations = await response.json();
            
            if (conversations.length === 0) {
                chatList.innerHTML = `
                    <div class="chat-empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        <p>채팅 내역이 없습니다.</p>
                        <small>경매에 참여하면 채팅이 활성화됩니다.</small>
                    </div>
                `;
                return;
            }
            
            chatList.innerHTML = conversations.map(conv => {
                const unreadCount = conv.unreadCount || 0;
                const lastMessage = conv.lastMessage || '메시지 없음';
                const lastMessageTime = conv.lastMessageTime ? this.formatTime(conv.lastMessageTime) : '';
                
                return `
                    <div class="chat-item" onclick="chatManager.openChat(${conv.chatId})">
                        <div class="chat-item-image">
                            <img src="images/placeholder.svg" alt="상품 이미지">
                        </div>
                        <div class="chat-item-content">
                            <div class="chat-item-header">
                                <h4>상품 #${conv.productId}</h4>
                                ${unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : ''}
                            </div>
                            <p class="chat-participant">상대방</p>
                            <p class="chat-last-message">${lastMessage}</p>
                            <small class="chat-time">${lastMessageTime}</small>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Error loading conversations:', error);
            chatList.innerHTML = `
                <div class="chat-empty">
                    <p>채팅 목록을 불러오는데 실패했습니다.</p>
                </div>
            `;
        }
    }
    
    // 특정 채팅 열기
    async openChat(chatId) {
        try {
            const response = await fetch(`/api/chat/conversations/${chatId}/messages`);
            if (!response.ok) {
                throw new Error('Failed to load messages');
            }
            
            const messages = await response.json();
            this.currentChat = { chatId, messages };
            this.showChatWindow(chatId, messages);
        } catch (error) {
            console.error('Error loading chat:', error);
            alert('채팅을 불러오는데 실패했습니다.');
        }
    }
    
    // 채팅 창 표시
    showChatWindow(chatId, messages) {
        const chatList = document.getElementById('chatList');
        if (!chatList) return;
        
        const user = authManager.getUser();
        
        chatList.innerHTML = `
            <div class="chat-window">
                <div class="chat-window-header">
                    <button class="back-btn" onclick="chatManager.loadChatList()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    <div class="chat-header-info">
                        <h4>채팅방 #${chatId}</h4>
                        <p>상대방</p>
                    </div>
                </div>
                <div class="chat-messages" id="chatMessages">
                    ${messages.map(message => this.renderMessage(message, user)).join('')}
                </div>
                <div class="chat-input">
                    <input type="text" id="messageInput" placeholder="메시지를 입력하세요..." onkeypress="chatManager.handleMessageKeyPress(event)">
                    <button onclick="chatManager.sendMessage()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        this.scrollToBottom();
    }
    
    // 메시지 렌더링
    renderMessage(message, currentUser) {
        const isOwnMessage = message.senderId === currentUser.userId;
        return `
            <div class="message ${isOwnMessage ? 'own' : 'other'}">
                <div class="message-content">
                    <p>${message.content}</p>
                    <small>${this.formatTime(message.sendDate)}</small>
                </div>
            </div>
        `;
    }
    
    // 메시지 전송
    async sendMessage() {
        const input = document.getElementById('messageInput');
        if (!input || !input.value.trim() || !this.currentChat) return;
        
        const user = authManager.getUser();
        const messageText = input.value.trim();
        input.value = '';
        
        try {
            // 현재 채팅방의 상대방 ID와 상품 ID를 가져오기
            const chatId = this.currentChat.chatId;
            const receiverId = await this.getReceiverId(chatId, user.userId);
            const productId = await this.getProductId(chatId);
            
            const response = await fetch('/api/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderId: user.userId,
                    receiverId: receiverId,
                    productId: productId,
                    content: messageText
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            
            const newMessage = await response.json();
            
            // 메시지 추가
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                const messageElement = document.createElement('div');
                messageElement.innerHTML = this.renderMessage(newMessage, user);
                chatMessages.appendChild(messageElement.firstElementChild);
                this.scrollToBottom();
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('메시지 전송에 실패했습니다.');
        }
    }
    
    // 채팅방에서 상대방 ID 가져오기
    async getReceiverId(chatId, currentUserId) {
        try {
            const response = await fetch(`/api/chat/conversations/${chatId}/info`);
            if (!response.ok) {
                throw new Error('Failed to get chat info');
            }
            
            const chatInfo = await response.json();
            return chatInfo.senderId === currentUserId ? chatInfo.receiverId : chatInfo.senderId;
        } catch (error) {
            console.error('Error getting receiver ID:', error);
            return 'seller-id'; // fallback
        }
    }
    
    // 채팅방에서 상품 ID 가져오기
    async getProductId(chatId) {
        try {
            const response = await fetch(`/api/chat/conversations/${chatId}/info`);
            if (!response.ok) {
                throw new Error('Failed to get chat info');
            }
            
            const chatInfo = await response.json();
            return chatInfo.productId;
        } catch (error) {
            console.error('Error getting product ID:', error);
            return 1; // fallback
        }
    }
    
    // 엔터키로 메시지 전송
    handleMessageKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }
    
    // 채팅창 맨 아래로 스크롤
    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // 시간 포맷팅
    formatTime(timestamp) {
        if (!timestamp) return '';
        
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // 1분 미만
            return '방금 전';
        } else if (diff < 3600000) { // 1시간 미만
            return `${Math.floor(diff / 60000)}분 전`;
        } else if (diff < 86400000) { // 1일 미만
            return `${Math.floor(diff / 3600000)}시간 전`;
        } else {
            return date.toLocaleDateString();
        }
    }
}

// 전역 채팅 매니저 인스턴스
const chatManager = new ChatManager(); 