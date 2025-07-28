// Login Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userId = formData.get('userId');
    const password = formData.get('password');
    
    // Simple validation
    if (!userId || !password) {
        showMessage('아이디와 비밀번호를 입력해주세요.', 'error');
        return;
    }
    
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                password: password
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('로그인 중 오류가 발생했습니다.', 'error');
        console.error('Login error:', error);
    }
}

// Login with demo account
async function loginWithDemo(userId) {
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                password: 'demo'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('데모 계정으로 로그인 성공! 메인 페이지로 이동합니다.', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            showMessage('데모 계정 로그인에 실패했습니다.', 'error');
        }
    } catch (error) {
        showMessage('데모 계정 로그인 중 오류가 발생했습니다.', 'error');
        console.error('Demo login error:', error);
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