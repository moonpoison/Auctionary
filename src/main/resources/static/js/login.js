// Login Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;

    const success = await authManager.login({ userId, password });
    if (success) {
        setTimeout(() => {
            window.location.href = '/';
        }, 300); // updatePoints 완료 시간 확보
    } else {
        alert('로그인 실패');
    }
});


// Login with demo account
async function loginWithDemo(userId) {
    try {
        const success = await authManager.login({
            userId: userId,
            password: 'demo'
        });
        
        if (success) {
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