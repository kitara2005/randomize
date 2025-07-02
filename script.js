class RandomParameterApp {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.currentTab = 'list';
        
        // Mặc định hiển thị tab list và kích hoạt ocean theme
        this.switchTab('list');
        document.body.classList.add('ocean-theme');
        this.activateOceanEffects();
    }

    initializeElements() {
        // Tab elements
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Numbers tab elements
        this.minValueInput = document.getElementById('minValue');
        this.maxValueInput = document.getElementById('maxValue');
        this.countInput = document.getElementById('count');
        this.decimalPlacesInput = document.getElementById('decimalPlaces');
        this.allowDuplicatesCheckbox = document.getElementById('allowDuplicates');
        this.sortResultsCheckbox = document.getElementById('sortResults');
        this.generateBtn = document.getElementById('generateBtn');
        this.resultDisplay = document.getElementById('result');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        
        // List tab elements
        this.listInput = document.getElementById('listInput');
        this.generateListBtn = document.getElementById('generateListBtn');
        this.listResultDisplay = document.getElementById('listResult');
        this.copyListBtn = document.getElementById('copyListBtn');
        this.clearListBtn = document.getElementById('clearListBtn');
        
        // Loading elements
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.loadingText = document.getElementById('loadingText');
    }

    bindEvents() {
        // Tab switching
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // Generate buttons
        this.generateBtn.addEventListener('click', () => {
            this.generateRandomNumbers();
        });

        this.generateListBtn.addEventListener('click', () => {
            this.generateRandomFromList();
        });

        // Copy buttons
        this.copyBtn.addEventListener('click', () => {
            this.copyResults(this.resultDisplay);
        });

        this.copyListBtn.addEventListener('click', () => {
            this.copyResults(this.listResultDisplay);
        });

        // Clear buttons
        this.clearBtn.addEventListener('click', () => {
            this.clearResults(this.resultDisplay, this.copyBtn, this.clearBtn);
        });

        this.clearListBtn.addEventListener('click', () => {
            this.clearResults(this.listResultDisplay, this.copyListBtn, this.clearListBtn);
        });

        // Validation on input change
        [this.minValueInput, this.maxValueInput, this.countInput, this.decimalPlacesInput].forEach(input => {
            input.addEventListener('input', () => this.validateInputs());
        });

        [this.listInput].forEach(input => {
            input.addEventListener('input', () => this.validateListInputs());
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab contents
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        // Luôn giữ ocean theme cho cả hai tab
        document.body.classList.add('ocean-theme');
        this.activateOceanEffects();
    }

    validateInputs() {
        const minValue = parseFloat(this.minValueInput.value);
        const maxValue = parseFloat(this.maxValueInput.value);
        const count = parseInt(this.countInput.value);
        const decimalPlaces = parseInt(this.decimalPlacesInput.value);

        let isValid = true;
        let errorMessage = '';

        // Validate min and max values
        if (minValue >= maxValue) {
            errorMessage = 'Giá trị tối thiểu phải nhỏ hơn giá trị tối đa';
            isValid = false;
        }

        // Validate count
        if (count < 1 || count > 100) {
            errorMessage = 'Số lượng kết quả phải từ 1 đến 100';
            isValid = false;
        }

        // Validate decimal places
        if (decimalPlaces < 0 || decimalPlaces > 10) {
            errorMessage = 'Số chữ số thập phân phải từ 0 đến 10';
            isValid = false;
        }

        // Check if we can generate unique numbers
        if (!this.allowDuplicatesCheckbox.checked) {
            const range = maxValue - minValue + 1;
            if (count > range) {
                errorMessage = `Không thể tạo ${count} số khác nhau trong khoảng từ ${minValue} đến ${maxValue}`;
                isValid = false;
            }
        }

        this.generateBtn.disabled = !isValid;
        
        if (!isValid) {
            this.showError(errorMessage, this.resultDisplay);
        } else {
            this.clearError(this.resultDisplay);
        }

        return isValid;
    }

    validateListInputs() {
        const listText = this.listInput.value.trim();

        let isValid = true;
        let errorMessage = '';

        // Validate list input
        if (!listText) {
            errorMessage = 'Vui lòng nhập danh sách';
            isValid = false;
        }

        // Chỉ cần kiểm tra danh sách có ít nhất 1 mục
        const items = this.parseList(listText);
        if (items.length < 1) {
            errorMessage = 'Danh sách phải có ít nhất 1 mục';
            isValid = false;
        }

        this.generateListBtn.disabled = !isValid;
        
        if (!isValid) {
            this.showError(errorMessage, this.listResultDisplay);
        } else {
            this.clearError(this.listResultDisplay);
        }

        return isValid;
    }

    parseList(text) {
        return text.split('\n')
            .map(item => item.trim())
            .filter(item => item.length > 0);
    }

    showError(message, displayElement) {
        displayElement.innerHTML = `<p class="error">❌ ${message}</p>`;
        displayElement.querySelector('.error').style.color = '#e53e3e';
        displayElement.querySelector('.error').style.fontWeight = '600';
    }

    clearError(displayElement) {
        if (displayElement.querySelector('.error')) {
            const placeholder = displayElement.id === 'listResult' 
                ? 'Nhấn nút "Random từ danh sách" để bắt đầu'
                : 'Nhấn nút "Tạo Random" để bắt đầu';
            displayElement.innerHTML = `<p class="placeholder">${placeholder}</p>`;
        }
    }

    async generateRandomNumbers() {
        if (!this.validateInputs()) return;

        // Show loading
        this.showLoading('Đang tạo số ngẫu nhiên...');
        this.generateBtn.classList.add('loading');
        this.generateBtn.disabled = true;

        try {
            // Simulate loading time - đủ để xem cá mập bơi qua
            await this.simulateLoading(1500);

            const min = parseFloat(this.minValueInput.value);
            const max = parseFloat(this.maxValueInput.value);
            const count = parseInt(this.countInput.value);
            const decimalPlaces = parseInt(this.decimalPlacesInput.value);
            const allowDuplicates = this.allowDuplicatesCheckbox.checked;
            const sortResults = this.sortResultsCheckbox.checked;

            const results = this.generateNumbers(min, max, count, decimalPlaces, allowDuplicates, sortResults);
            
            this.displayResults(results, this.resultDisplay);
            this.enableActionButtons(this.copyBtn, this.clearBtn);
            
            // Create confetti effect
            this.createConfetti();
            
        } catch (error) {
            console.error('Error generating numbers:', error);
        } finally {
            // Hide loading
            this.hideLoading();
            this.generateBtn.classList.remove('loading');
            this.generateBtn.disabled = false;
        }
    }

    async generateRandomFromList() {
        if (!this.validateListInputs()) return;

        // Show loading
        this.showLoading('Đang xáo trộn danh sách...');
        this.generateListBtn.classList.add('loading');
        this.generateListBtn.disabled = true;

        try {
            // Simulate loading time - đủ để xem cá mập bơi qua
            await this.simulateLoading(1500);

            const listText = this.listInput.value.trim();
            const items = this.parseList(listText);
            
            // Shuffle toàn bộ danh sách
            const shuffledResults = [...items].sort(() => Math.random() - 0.5);

            // Tạo hiệu ứng sóng biển tung bay
            this.createWaveEffect();

            this.displayListResults(shuffledResults, this.listResultDisplay);
            this.enableActionButtons(this.copyListBtn, this.clearListBtn);
            
        } catch (error) {
            console.error('Error generating from list:', error);
        } finally {
            // Hide loading
            this.hideLoading();
            this.generateListBtn.classList.remove('loading');
            this.generateListBtn.disabled = false;
        }
    }

    getRandomNumber(min, max, decimalPlaces) {
        const random = Math.random() * (max - min) + min;
        return parseFloat(random.toFixed(decimalPlaces));
    }

    displayResults(results, displayElement) {
        const numbersHtml = results.map(num => 
            `<span class="number-badge">${num}</span>`
        ).join('');

        displayElement.innerHTML = `
            <div class="result-numbers">
                ${numbersHtml}
            </div>
        `;
    }

    displayListResults(results, displayElement) {
        const itemsHtml = results.map((item, index) => 
            `<div class="list-item">${index + 1}. ${item}</div>`
        ).join('');

        displayElement.innerHTML = `
            <div class="result-list">
                ${itemsHtml}
            </div>
        `;
    }



    copyResults(displayElement) {
        let content = '';
        
        // Kiểm tra xem có phải là list hay numbers
        const listItems = displayElement.querySelectorAll('.list-item');
        const numberBadges = displayElement.querySelectorAll('.number-badge');
        
        if (listItems.length > 0) {
            // Đối với list, mỗi item trên một dòng riêng biệt
            content = Array.from(listItems)
                .map(item => item.textContent.replace(/^\d+\.\s*/, '')) // Loại bỏ số thứ tự và dấu chấm
                .join('\n'); // Mỗi kết quả trên một dòng
        } else if (numberBadges.length > 0) {
            // Đối với numbers, cũng mỗi số trên một dòng
            content = Array.from(numberBadges)
                .map(badge => badge.textContent)
                .join('\n'); // Mỗi số trên một dòng
        }

        if (content) {
            navigator.clipboard.writeText(content).then(() => {
                this.showCopySuccess(this.copyBtn);
            }).catch(() => {
                this.showCopyError(this.copyBtn);
            });
        }
    }

    showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = '✅ Đã sao chép!';
        button.style.background = '#48bb78';
        button.style.color = 'white';
        button.style.borderColor = '#48bb78';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
            button.style.borderColor = '';
        }, 2000);
    }

    showCopyError(button) {
        const originalText = button.textContent;
        button.textContent = '❌ Lỗi!';
        button.style.background = '#e53e3e';
        button.style.color = 'white';
        button.style.borderColor = '#e53e3e';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
            button.style.borderColor = '';
        }, 2000);
    }

    clearResults(displayElement, copyBtn, clearBtn) {
        displayElement.innerHTML = '<p class="placeholder">Nhấn nút "Tạo Random" để bắt đầu</p>';
        this.disableActionButtons(copyBtn, clearBtn);
    }

    enableActionButtons(copyBtn, clearBtn) {
        copyBtn.disabled = false;
        clearBtn.disabled = false;
    }

    disableActionButtons(copyBtn, clearBtn) {
        copyBtn.disabled = true;
        clearBtn.disabled = true;
    }

    activateOceanEffects() {
        // Activate ocean waves - đã ẩn hoàn toàn
        // const oceanWaves = document.getElementById('oceanWaves');
        // if (oceanWaves) {
        //     oceanWaves.classList.add('active');
        // }

        // Activate bubbles with different sizes and delays
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach((bubble, index) => {
            const size = Math.random() * 20 + 10; // 10-30px
            const delay = index * 1.5; // Staggered delay
            const left = Math.random() * 100; // Random horizontal position
            
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${left}%`;
            bubble.style.animationDelay = `${delay}s`;
            bubble.classList.add('active');
        });
    }

    deactivateOceanEffects() {
        // Deactivate ocean waves - đã ẩn hoàn toàn
        // const oceanWaves = document.getElementById('oceanWaves');
        // if (oceanWaves) {
        //     oceanWaves.classList.remove('active');
        // }

        // Deactivate bubbles
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(bubble => {
            bubble.classList.remove('active');
        });
    }

    createWaveEffect() {
        // Tạo thêm bong bóng khi random
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const bubble = document.createElement('div');
                bubble.className = 'bubble';
                bubble.style.position = 'fixed';
                bubble.style.left = Math.random() * 100 + '%';
                bubble.style.bottom = '-20px';
                bubble.style.width = Math.random() * 15 + 8 + 'px';
                bubble.style.height = bubble.style.width;
                bubble.style.background = 'rgba(255, 255, 255, 0.4)';
                bubble.style.borderRadius = '50%';
                bubble.style.zIndex = '-1';
                bubble.style.animation = 'float 4s ease-in-out forwards';
                
                document.body.appendChild(bubble);
                
                // Remove bubble after animation
                setTimeout(() => {
                    if (bubble.parentNode) {
                        bubble.parentNode.removeChild(bubble);
                    }
                }, 4000);
            }, i * 200);
        }

        // Tạo hiệu ứng sóng mạnh hơn - đã ẩn hoàn toàn
        // const oceanWaves = document.getElementById('oceanWaves');
        // if (oceanWaves) {
        //     oceanWaves.style.animationDuration = '1s';
        //     setTimeout(() => {
        //         oceanWaves.style.animationDuration = '3s';
        //     }, 1000);
        // }
    }

    showLoading(message = 'Đang tạo random...') {
        this.loadingText.textContent = message;
        this.loadingOverlay.classList.add('active');
        this.createLoadingParticles();
        this.createSharkBubbles();
    }

    hideLoading() {
        this.loadingOverlay.classList.remove('active');
        this.clearSharkBubbles();
    }

    createLoadingParticles() {
        // Tạo particles bay lên trong quá trình loading
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'loading-particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.bottom = '0';
                particle.style.width = Math.random() * 8 + 4 + 'px';
                particle.style.height = particle.style.width;
                
                document.body.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 2000);
            }, i * 100);
        }
    }

    createSharkBubbles() {
        const sharkBubbles = document.getElementById('sharkBubbles');
        if (!sharkBubbles) return;

        // Tạo bong bóng theo cá mập
        const createBubble = () => {
            const bubble = document.createElement('div');
            bubble.className = 'shark-bubble';
            bubble.style.left = Math.random() * 100 + '%';
            bubble.style.bottom = '0';
            bubble.style.animationDelay = Math.random() * 1 + 's';
            
            sharkBubbles.appendChild(bubble);
            
            // Remove bubble after animation
            setTimeout(() => {
                if (bubble.parentNode) {
                    bubble.parentNode.removeChild(bubble);
                }
            }, 1500);
        };

        // Tạo bong bóng liên tục - nhanh hơn
        this.bubbleInterval = setInterval(createBubble, 150);
    }

    clearSharkBubbles() {
        if (this.bubbleInterval) {
            clearInterval(this.bubbleInterval);
        }
        const sharkBubbles = document.getElementById('sharkBubbles');
        if (sharkBubbles) {
            sharkBubbles.innerHTML = '';
        }
    }

    async simulateLoading(duration = 1500) {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                document.body.removeChild(confetti);
            }, 5000);
        }
    }

    generateNumbers(min, max, count, decimalPlaces, allowDuplicates, sortResults) {
        let results = [];

        if (allowDuplicates) {
            // Generate with duplicates allowed
            for (let i = 0; i < count; i++) {
                const randomValue = this.getRandomNumber(min, max, decimalPlaces);
                results.push(randomValue);
            }
        } else {
            // Generate unique numbers
            const usedNumbers = new Set();
            while (results.length < count) {
                const randomValue = this.getRandomNumber(min, max, decimalPlaces);
                if (!usedNumbers.has(randomValue)) {
                    usedNumbers.add(randomValue);
                    results.push(randomValue);
                }
            }
        }

        // Sort if requested
        if (sortResults) {
            results.sort((a, b) => a - b);
        }

        return results;
    }


}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RandomParameterApp();
});

// Add some fun animations and effects
document.addEventListener('DOMContentLoaded', () => {
    // Add confetti effect on successful generation
    const generateBtns = document.querySelectorAll('.generate-btn');
    generateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(() => {
                if (document.querySelector('.number-badge')) {
                    createConfetti();
                }
            }, 500);
        });
    });
});

function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            document.body.removeChild(confetti);
        }, 5000);
    }
}

// Add CSS animation for confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    

`;
document.head.appendChild(style); 