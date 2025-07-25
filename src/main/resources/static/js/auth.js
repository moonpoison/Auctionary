// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.loadUser();
        this.updateUI();
    }
    
    // Load user from localStorage
    loadUser() {
        const savedUser = Storage.get('currentUser');
        if (savedUser) {
            this.currentUser = savedUser;
        }
    }
    
    // Save user to localStorage
    saveUser(user) {
        this.currentUser = user;
        Storage.set('currentUser', user);
    }
    
    // Login user
    login(userData) {
        const user = MOCK_USERS.find(u => u.email === userData.email);
        if (user) {
            this.saveUser(user);
            this.updateUI();
            return true;
        }
        return false;
    }
    
    // Logout user
    logout() {
        this.currentUser = null;
        Storage.remove('currentUser');
        this.updateUI();
    }
    
    // Get current user
    getUser() {
        return this.currentUser;
    }
    
    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    // Update UI based on authentication state
    updateUI() {
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) {
            console.warn("auth-buttons element not found. Skipping update.");
            return; // login.jsp에서는 그냥 UI 업데이트 안 함
        }
        const pointsBtn = document.getElementById('pointsBtn');
        const chatBtn = document.getElementById('chatBtn');
        
        if (this.isLoggedIn()) {
            // Hide login/signup buttons
            authButtons.innerHTML = `
                <button class="btn btn-ghost" onclick="authManager.logout()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16,17 21,12 16,7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span>로그아웃</span>
                </button>
            `;
            
            // Show points
            if (pointsBtn) {
                const pointsText = pointsBtn.querySelector('.points-text');
                if (pointsText) {
                    pointsText.textContent = this.currentUser.points.toLocaleString() + ' P';
                }
            }
            
            // Show chat button
            if (chatBtn) {
                chatBtn.style.display = 'flex';
            }
        } else {
            // Show login/signup buttons
            authButtons.innerHTML = `
                <a href="/login" class="btn btn-ghost">로그인</a>
                <a href="/signup" class="btn btn-primary">회원가입</a>
            `;
            
            // Hide points
            if (pointsBtn) {
                const pointsText = pointsBtn.querySelector('.points-text');
                if (pointsText) {
                    pointsText.textContent = '0 P';
                }
            }
            
            // Hide chat button
            if (chatBtn) {
                chatBtn.style.display = 'none';
            }
        }
    }
    
    // Toggle wishlist for an item
    toggleWishlist(itemId) {
        if (!this.isLoggedIn()) {
            alert("로그인이 필요합니다.");
            return false;
        }
        
        const wasWishlisted = toggleWishlist(this.currentUser, itemId);
        this.saveUser(this.currentUser);
        
        // Update wishlist count on the item
        const item = MOCK_AUCTION_ITEMS.find(i => i.id === itemId);
        if (item) {
            if (wasWishlisted) {
                item.wishlistedCount--;
            } else {
                item.wishlistedCount++;
            }
        }
        
        return wasWishlisted;
    }
}

// Initialize auth manager
const authManager = new AuthManager(); 