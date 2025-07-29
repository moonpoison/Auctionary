// Signup Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

// Handle signup form submission
async function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userId = formData.get('userId');
    const name = formData.get('name');
    const birthDate = formData.get('birthDate');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validation
    if (!userId || !name || !birthDate || !email || !phone || !password || !confirmPassword) {
        showMessage('모든 필드를 입력해주세요.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('비밀번호가 일치하지 않습니다.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('비밀번호는 최소 6자 이상이어야 합니다.', 'error');
        return;
    }
    
    try {
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                name: name,
                birthDate: birthDate,
                email: email,
                phoneNumber: phone,
                password: password
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // 회원가입 성공 후 자동 로그인 처리
            if (result.user && window.authManager) {
                window.authManager.saveUser(result.user);
                window.authManager.updateUI();
            }
            
            showMessage(result.message, 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('회원가입 중 오류가 발생했습니다.', 'error');
        console.error('Signup error:', error);
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
    const form = document.getElementById('signupForm');
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