// Signup Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

// Handle signup form submission
function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
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
    
    // Check if email already exists
    const existingUser = MOCK_USERS.find(user => user.email === email);
    if (existingUser) {
        showMessage('이미 사용 중인 이메일입니다.', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: `user-${Date.now()}`,
        name: name,
        email: email,
        phone: phone,
        points: 1000000, // Starting points
        avatar: '../images/placeholder.svg',
        wishlist: [],
        reviews: []
    };
    
    // Add to mock users (in real app, this would be saved to database)
    MOCK_USERS.push(newUser);
    
    // Auto login
    authManager.saveUser(newUser);
    
    showMessage('회원가입 성공! 메인 페이지로 이동합니다.', 'success');
    setTimeout(() => {
        window.location.href = '../index';
    }, 1000);
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