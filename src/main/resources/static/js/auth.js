// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.initialized = false;
        // 비동기 초기화는 별도로 호출
    }
    
    async init() {
        console.log('=== authManager.init() called ===');
        console.log('Current initialized state:', this.initialized);
        
        if (this.initialized) {
            console.log('Already initialized, returning');
            return;
        }
        const savedUser = Storage.get('currentUser');
        if (savedUser) {
            this.currentUser = savedUser; // ✅ localStorage 값 우선
        }
        console.log('Starting initialization...');
        console.log('Calling checkServerSession...');
        
        await this.checkServerSession();
        
        console.log('checkServerSession completed');
        console.log('Current user after session check:', this.currentUser);
        
        console.log('Calling updateUI...');
        this.updateUI();
        
        this.initialized = true;
        console.log('Initialization completed. initialized =', this.initialized);
    }
    
    // Check server session status
    async checkServerSession() {
        try {
            console.log('=== checkServerSession called ===');
            
            const response = await fetch('/auth/current-user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // 쿠키 포함
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            const result = await response.json();
            console.log('Server session check result:', result);
            
            if (result.success && result.user) {
                console.log('User found in server session, updating currentUser');
                this.currentUser = result.user;
                console.log('Current user after server update:', this.currentUser);
            } else {
                // 서버에서 사용자 정보를 가져오지 못했을 때 현재 사용자 정보 유지
                console.log('No user in server session, but keeping current user if exists');
                console.log('Current user before check:', this.currentUser);
                
                // 현재 사용자가 있으면 유지, 없으면 localStorage에서 복원 시도
                if (!this.currentUser) {
                    console.log('No current user, trying to restore from localStorage');
                    const savedUser = Storage.get('currentUser');
                    if (savedUser) {
                        this.currentUser = savedUser;
                        console.log('Restored user from localStorage:', this.currentUser);
                    } else {
                        console.log('No user found in localStorage either');
                    }
                } else {
                    console.log('Keeping existing current user:', this.currentUser);
                }
            }
        } catch (error) {
            console.error('Session check error:', error);
            // 서버 체크 실패 시 로컬 스토리지에서 복원 시도
            console.log('Server check failed, trying to restore from localStorage');
            const savedUser = Storage.get('currentUser');
            if (savedUser) {
                this.currentUser = savedUser;
                console.log('Restored user from localStorage after error:', this.currentUser);
            } else {
                this.currentUser = null;
                console.log('No user found in localStorage after error');
            }
        }
    }
    
    // Load user from localStorage (fallback)
    loadUser() {
        const savedUser = Storage.get('currentUser');
        if (savedUser) {
            this.currentUser = savedUser;
        }
    }

    updatePoints(points) {
        if (this.isLoggedIn() && this.currentUser) {
            this.currentUser.points = points;
            Storage.set('currentUser', this.currentUser);
            this.updateUI();
            console.log(`✅ User points updated: ${points}`);
        }
    }


    // Save user to localStorage
    saveUser(user) {
        console.log('=== saveUser called ===');
        console.log('Previous currentUser:', this.currentUser);
        console.log('New user data:', user);
        
        // 사용자 정보를 확실하게 저장
        this.currentUser = {
            userId: user.userId,
            name: user.name,
            email: user.email,
            points: user.points || 0,
            role: user.role
        };
        
        console.log('Current user after save:', this.currentUser);
        console.log('User ID:', this.currentUser ? this.currentUser.userId : 'null');
        console.log('User points:', this.currentUser ? this.currentUser.points : 'null');
        
        // 로컬 스토리지에도 저장 (백업용)
        Storage.set('currentUser', this.currentUser);
        console.log('User saved to client and localStorage:', this.currentUser);
    }
    
    // Login user
    async login(userData) {
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (result.success && result.user) {
                this.saveUser(result.user); // 초기 저장

                try {
                    const pointRes = await fetch('/points/current', { credentials: 'include' });
                    const pointData = await pointRes.json();
                    if (pointData.success) {
                        this.updatePoints(pointData.points); // 최신 포인트 반영
                    }
                } catch (error) {
                    console.error('포인트 갱신 실패:', error);
                }

                this.updateUI();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }
    
    // Logout user
    async logout() {
        try {
            await fetch('/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // 쿠키 포함
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        
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
        const loggedIn = this.currentUser !== null;
        console.log('=== isLoggedIn called ===');
        console.log('Current user:', this.currentUser);
        console.log('Is logged in:', loggedIn);
        return loggedIn;
    }
    
    // Update UI based on authentication state
    updateUI() {
        console.log('=== updateUI called ===');
        console.log('Current user:', this.currentUser);
        console.log('User logged in:', this.isLoggedIn());
        
        // localStorage에서 사용자 정보 확인
        const savedUser = Storage.get('currentUser');
        console.log('Saved user from localStorage:', savedUser);
        
        // auth-buttons 요소 찾기
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) {
            console.warn("auth-buttons element not found. Skipping update.");
            return;
        }
        
        // points 버튼 찾기
        const pointsBtn = document.getElementById('pointsBtn');
        const chatBtn = document.getElementById('chatBtn');
        
        console.log('Found elements - authButtons:', authButtons, 'pointsBtn:', pointsBtn, 'chatBtn:', chatBtn);
        
        // 로그인 상태 결정 (currentUser 또는 localStorage에서)
        const isLoggedIn = this.currentUser !== null || savedUser !== null;
        console.log('Final login state:', isLoggedIn);
        
        if (isLoggedIn) {
            console.log('User is logged in, updating UI...');
            
            // 사용자 정보가 없으면 localStorage에서 복원
            if (!this.currentUser && savedUser) {
                console.log('Restoring user from localStorage for UI update');
                this.currentUser = savedUser;
            }
            
            console.log('User details for UI update:', this.currentUser);
            
            // auth-buttons 내용을 안전하게 교체
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
            
            // 포인트 표시 업데이트
            if (pointsBtn) {
                const pointsText = pointsBtn.querySelector('.points-text');
                console.log('Points text element:', pointsText);
                console.log('User points:', this.currentUser ? this.currentUser.points : 'null');

                if (pointsText && this.currentUser) {
                    const pointsValue = (typeof this.currentUser.points === 'number') ? this.currentUser.points : 0;
                    pointsText.textContent = pointsValue.toLocaleString() + ' P';
                    console.log('Points updated to:', pointsValue.toLocaleString() + ' P');
                } else if (pointsText) {
                    pointsText.textContent = '0 P';
                    console.log('Points set to 0 P');
                }
            }
            
            // 채팅 버튼 표시
            if (chatBtn) {
                chatBtn.style.display = 'flex';
                console.log('Chat button shown');
            }
            
            console.log('UI updated for logged in user');
        } else {
            console.log('User is not logged in, updating UI...');
            
            // auth-buttons 내용을 안전하게 교체
            authButtons.innerHTML = `
                <a href="/login" class="btn btn-ghost">로그인</a>
                <a href="/signup" class="btn btn-primary">회원가입</a>
            `;
            
            // 포인트 숨기기
            if (pointsBtn) {
                const pointsText = pointsBtn.querySelector('.points-text');
                if (pointsText) {
                    pointsText.textContent = '0 P';
                }
            }
            
            // 채팅 버튼 숨기기
            if (chatBtn) {
                chatBtn.style.display = 'none';
            }
            
            console.log('UI updated for logged out user');
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

// 페이지 로드 시 즉시 사용자 정보 복원
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOMContentLoaded - authManager initialization ===');
    const savedUser = Storage.get('currentUser');
    if (savedUser) {
        console.log('Restoring user from localStorage on page load:', savedUser);
        authManager.currentUser = savedUser;
        authManager.initialized = true;
        console.log('User restored, initialized =', authManager.initialized);
        
        // 즉시 UI 업데이트
        console.log('Forcing immediate UI update after user restoration');
        authManager.updateUI();
    } else {
        console.log('No saved user found in localStorage');
    }
}); 