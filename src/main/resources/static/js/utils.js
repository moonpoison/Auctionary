// Utility Functions

// Format time remaining for auction
function formatTimeRemaining(endDate) {
    const now = new Date();
    const timeLeft = endDate.getTime() - now.getTime();
    
    if (timeLeft <= 0) {
        return { isOver: true, text: "경매 종료" };
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    if (days > 0) {
        return { isOver: false, text: `${days}일 남음`, days, hours, minutes, seconds };
    } else if (hours > 0) {
        return { isOver: false, text: `${hours}시간 남음`, days, hours, minutes, seconds };
    } else {
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(seconds).padStart(2, '0');
        return { isOver: false, text: `${minutesStr}:${secondsStr}`, days, hours, minutes, seconds };
    }
}

// Format price with Korean currency
function formatPrice(price) {
    return price.toLocaleString() + '원';
}

// Get current price of auction item
function getCurrentPrice(item) {
    if (item.bids.length === 0) {
        return item.startPrice;
    }
    return Math.max(...item.bids.map(bid => bid.amount));
}

// Check if user has wishlisted an item
function isWishlisted(user, itemId) {
    return user && user.wishlist && user.wishlist.includes(itemId);
}

// Toggle wishlist for an item
function toggleWishlist(user, itemId) {
    if (!user) {
        alert("로그인이 필요합니다.");
        return false;
    }
    
    if (!user.wishlist) {
        user.wishlist = [];
    }
    
    const index = user.wishlist.indexOf(itemId);
    if (index > -1) {
        user.wishlist.splice(index, 1);
        return false; // removed from wishlist
    } else {
        user.wishlist.push(itemId);
        return true; // added to wishlist
    }
}

// Sort auction items
function sortAuctionItems(items, sortType) {
    const activeItems = items.filter(item => item.status === "active");
    
    switch (sortType) {
        case "closing":
            return [...activeItems].sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
        case "popular":
            return [...activeItems].sort((a, b) => b.wishlistedCount - a.wishlistedCount);
        case "newest":
            return [...activeItems].sort((a, b) => b.endDate.getTime() - a.endDate.getTime());
        case "highPrice":
            return [...activeItems].sort((a, b) => {
                const priceA = getCurrentPrice(a);
                const priceB = getCurrentPrice(b);
                return priceB - priceA;
            });
        case "lowPrice":
            return [...activeItems].sort((a, b) => {
                const priceA = getCurrentPrice(a);
                const priceB = getCurrentPrice(b);
                return priceA - priceB;
            });
        default:
            return activeItems;
    }
}

// Create countdown timer
function createCountdownTimer(element, endDate, onUpdate) {
    function updateTimer() {
        const timeLeft = formatTimeRemaining(endDate);
        element.textContent = timeLeft.text;
        
        if (timeLeft.isOver) {
            element.classList.add('urgent');
        } else if (timeLeft.days === 0 && timeLeft.hours < 1) {
            element.classList.add('urgent');
        } else {
            element.classList.remove('urgent');
        }
        
        if (onUpdate) {
            onUpdate(timeLeft);
        }
        
        if (!timeLeft.isOver) {
            setTimeout(updateTimer, 1000);
        }
    }
    
    updateTimer();
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Local storage utilities
const Storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
}; 