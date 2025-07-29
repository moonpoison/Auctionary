// Points Page Logic
class PointsManager {
    constructor() {
        this.currentFilter = 'all';
        this.originalHistory = null;
        this.init();
    }
    
    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadUserPoints();
        this.loadPointsHistory();
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
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            });
        });
        
        // Charge form
        const chargeForm = document.getElementById('chargeForm');
        if (chargeForm) {
            chargeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCharge(e);
            });
        }
        
        // Withdraw form
        const withdrawForm = document.getElementById('withdrawForm');
        if (withdrawForm) {
            withdrawForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleWithdraw(e);
            });
        }
    }
    
    // Set filter
    setFilter(filter) {
        this.currentFilter = filter;
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        // Reload points history with filter
        this.loadPointsHistory();
    }
    
    // Load user points
    loadUserPoints() {
        const currentPointsElement = document.getElementById('currentPoints');
        const serverFinalPoint = document.getElementById('serverFinalPoint');

        if (currentPointsElement && serverFinalPoint) {
            const points = serverFinalPoint.value;
            currentPointsElement.textContent = points.toLocaleString() + ' P';

            // Update header points
            const pointsTextElement = document.querySelector('.points-text');
            if (pointsTextElement) {
                pointsTextElement.textContent = points.toLocaleString() + ' P';
            }
        }
    }


    // Load points history
    loadPointsHistory() {
        const historyList = document.getElementById('pointsHistoryList');
        if (!this.originalHistory) {
            const serverHistory = document.getElementById('serverPointHistory');
            if (!serverHistory) return;
            this.originalHistory = JSON.parse(serverHistory.value);
        }

        if (!historyList) return;

        const user = authManager.getUser();
        if (!user) return;

        // Parse point history
        const history = this.originalHistory.map(item => ({
            type: item.actionType.toLowerCase(),
            amount: item.pointChange,
            description: item.note,
            date: new Date(item.changeDate)
        }));

        // Filter history based on current filter
        let filteredHistory = history;

        if (this.currentFilter !== 'all') {
            filteredHistory = history.filter(item => {
                switch (this.currentFilter) {
                    case 'charge':
                        return item.type === 'charge';
                    case 'withdraw':
                        return item.type === 'withdraw';
                    case 'bid':
                        return item.type === 'bid_place';
                    case 'purchase':
                        return item.type === 'purchase';
                    case 'sale':
                        return item.type === 'sale';
                    default:
                        return true;
                }
            });
        }

        if (filteredHistory.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">내역이 없습니다.</p>';
            return;
        }

        historyList.innerHTML = filteredHistory.map(item => {
            const typeClass = this.getTypeClass(item.type);
            const typeLabel = this.getTypeLabel(item.type);

            return `
            <div class="points-history-item">
                <div class="points-history-info">
                    <div class="points-history-description">${item.description}</div>
                    <div class="points-history-date">${this.formatTime(item.date)}</div>
                </div>
                <div class="points-history-amount ${item.amount > 0 ? 'positive' : 'negative'}">
                    ${item.amount > 0 ? '+' : ''}${formatPrice(item.amount)}
                    <span class="points-history-type ${typeClass}">${typeLabel}</span>
                </div>
            </div>
        `;
        }).join('');
    }

    getTypeClass(type) {
        switch (type) {
            case 'charge':
                return 'charge';
            case 'withdraw':
                return 'withdraw';
            case 'bid_place':
                return 'bid';
            case 'purchase':
                return 'purchase';
            case 'sale':
                return 'sale';
            default:
                return '';
        }
    }

    // Get type label
    getTypeLabel(type) {
        switch (type) {
            case 'charge':
                return '충전';
            case 'withdraw':
                return '출금';
            case 'bid_place':
                return '입찰';
            case 'purchase':
                return '구매';
            case 'sale':
                return '판매';
            default:
                return '';
        }
    }
    
    // Show charge modal
    showChargeModal() {
        const modal = document.getElementById('chargeModal');
        if (modal) {
            modal.classList.add('show');
        }
    }
    
    // Close charge modal
    closeChargeModal() {
        const modal = document.getElementById('chargeModal');
        if (modal) {
            modal.classList.remove('show');
            document.getElementById('chargeForm').reset();
        }
    }
    
    // Show withdraw modal
    showWithdrawModal() {
        const modal = document.getElementById('withdrawModal');
        if (modal) {
            modal.classList.add('show');
        }
    }
    
    // Close withdraw modal
    closeWithdrawModal() {
        const modal = document.getElementById('withdrawModal');
        if (modal) {
            modal.classList.remove('show');
            document.getElementById('withdrawForm').reset();
        }
    }
    
    // Handle charge form submission
    handleCharge(e) {
        const formData = new FormData(e.target);
        const amount = parseInt(formData.get('amount'));
        const method = formData.get('method');
        
        if (!amount || amount < 10000) {
            alert('최소 10,000원부터 충전 가능합니다.');
            return;
        }
        
        if (!method) {
            alert('결제 방법을 선택해주세요.');
            return;
        }
        
        // Simulate charge
        const user = authManager.getUser();
        user.points += amount;
        authManager.saveUser(user);
        
        // Add to history
        const historyItem = {
            type: 'charge',
            amount: amount,
            description: `${this.getMethodLabel(method)} 충전`,
            date: new Date()
        };
        
        this.closeChargeModal();
        this.loadUserPoints();
        this.loadPointsHistory();
        
        alert(`${formatPrice(amount)}이 충전되었습니다.`);
    }
    
    // Handle withdraw form submission
    handleWithdraw(e) {
        const formData = new FormData(e.target);
        const amount = parseInt(formData.get('amount'));
        const account = formData.get('account');
        
        if (!amount || amount < 10000) {
            alert('최소 10,000원부터 출금 가능합니다.');
            return;
        }
        
        if (!account) {
            alert('출금 계좌를 입력해주세요.');
            return;
        }
        
        const user = authManager.getUser();
        if (user.points < amount) {
            alert('포인트가 부족합니다.');
            return;
        }
        
        // Simulate withdraw
        user.points -= amount;
        authManager.saveUser(user);
        
        this.closeWithdrawModal();
        this.loadUserPoints();
        this.loadPointsHistory();
        
        alert(`${formatPrice(amount)}이 출금 신청되었습니다.`);
    }
    
    // Get method label
    getMethodLabel(method) {
        switch (method) {
            case 'card':
                return '신용카드';
            case 'bank':
                return '계좌이체';
            case 'phone':
                return '휴대폰 결제';
            default:
                return '기타';
        }
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

// Initialize points manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pointsManager = new PointsManager();
}); 