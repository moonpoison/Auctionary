// My Page Logic
class MyPage {
    constructor() {
        this.currentTab = 'overview';
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
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
    }
}

// Initialize my page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.myPage = new MyPage();
});