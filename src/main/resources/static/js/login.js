// Login Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Simple validation
    if (!email || !password) {
        showMessage('이메일과 비밀번호를 입력해주세요.', 'error');
        return;
    }
    
    // Try to login
    const success = authManager.login({ email, password });
    
    if (success) {
        showMessage('로그인 성공! 메인 페이지로 이동합니다.', 'success');
        setTimeout(() => {
            window.location.href = '../index';
        }, 1000);
    } else {
        showMessage('이메일 또는 비밀번호가 올바르지 않습니다.', 'error');
    }
}

// Login with demo account
function loginWithDemo(email) {
    const success = authManager.login({ email, password: 'demo' });
    
    if (success) {
        showMessage('데모 계정으로 로그인 성공! 메인 페이지로 이동합니다.', 'success');
        setTimeout(() => {
            window.location.href = '../index';
        }, 1000);
    } else {
        showMessage('데모 계정 로그인에 실패했습니다.', 'error');
    }
}

// Show message
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.error-message, .success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `${type}-message`;
    messageElement.textContent = message;
    
    // Insert after form
    const form = document.getElementById('loginForm');
    if (form) {
        form.parentNode.insertBefore(messageElement, form.nextSibling);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
} 