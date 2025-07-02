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
        
        // Fish race elements
        this.fishInput = document.getElementById('fishInput');
        this.raceSpeed = document.getElementById('raceSpeed');
        this.startRaceBtn = document.getElementById('startRaceBtn');
        this.raceTrack = document.getElementById('raceTrack');
        this.raceResults = document.getElementById('raceResults');
        this.fullResults = document.getElementById('fullResults');
        
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

        // Fish race buttons
        this.startRaceBtn.addEventListener('click', () => {
            this.startFishRace();
        });



        // Fish input validation
        [this.fishInput].forEach(input => {
            input.addEventListener('input', () => this.validateFishInputs());
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

    // Fish Race Methods
    validateFishInputs() {
        const fishText = this.fishInput.value.trim();

        let isValid = true;
        let errorMessage = '';

        if (!fishText) {
            errorMessage = 'Vui lòng nhập tên cá';
            isValid = false;
        } else {
            const fishes = this.parseFishList(fishText);
            if (fishes.length < 2) {
                errorMessage = 'Cần ít nhất 2 con cá để đua';
                isValid = false;
            } else if (fishes.length > 8) {
                errorMessage = 'Tối đa 8 con cá có thể tham gia đua';
                isValid = false;
            }
        }

        this.startRaceBtn.disabled = !isValid;
        
        if (!isValid && fishText) {
            this.showFishError(errorMessage);
        } else {
            this.clearFishError();
        }

        return isValid;
    }

    parseFishList(text) {
        return text.split('\n')
            .map(item => item.trim())
            .filter(item => item.length > 0);
    }

    showFishError(message) {
        const existingError = this.raceTrack.querySelector('.error');
        if (existingError) {
            existingError.remove();
        }
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.style.textAlign = 'center';
        errorElement.style.marginTop = '20px';
        errorElement.innerHTML = `❌ ${message}`;
        this.raceTrack.appendChild(errorElement);
    }

    clearFishError() {
        const existingError = this.raceTrack.querySelector('.error');
        if (existingError) {
            existingError.remove();
        }
    }

    async startFishRace() {
        if (!this.validateFishInputs()) return;

        const fishNames = this.parseFishList(this.fishInput.value.trim());
        
        // Show loading
        this.showLoading('Chuẩn bị đường đua...');
        this.startRaceBtn.disabled = true;

        try {
            // Simulate preparation time
            await this.simulateLoading(1000);

            this.setupRaceTrack(fishNames);
            
            // Auto scroll to race track
            this.scrollToRaceTrack();
            
            await this.animateRace(fishNames);
            
        } catch (error) {
            console.error('Error in fish race:', error);
        } finally {
            this.hideLoading();
            this.startRaceBtn.disabled = false;
        }
    }

    setupRaceTrack(fishNames) {
        // Clear track
        this.raceTrack.innerHTML = '';
        this.raceResults.style.display = 'none';
        
        // Add finish line
        const finishLine = document.createElement('div');
        finishLine.className = 'finish-line';
        this.raceTrack.appendChild(finishLine);

        // Create lanes
        fishNames.forEach((name, index) => {
            const lane = document.createElement('div');
            lane.className = 'race-lane';
            lane.id = `lane-${index}`;
            
            // Lane number
            const laneNumber = document.createElement('div');
            laneNumber.className = 'lane-number';
            laneNumber.textContent = index + 1;
            lane.appendChild(laneNumber);

            // Fish
            const fish = document.createElement('div');
            fish.className = 'fish';
            fish.id = `fish-${index}`;
            
            const fishSvg = this.createFishSVG(index, name);
            fish.appendChild(fishSvg);
            lane.appendChild(fish);

            this.raceTrack.appendChild(lane);
        });

        // Add water bubbles
        this.createWaterBubbles();
    }

    scrollToRaceTrack() {
        // Smooth scroll to race track
        this.raceTrack.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    }

    createFishSVG(index, fishName) {
        const fishTypes = [
            {
                name: 'Goldfish',
                body: '#FFD700', fins: '#FFA500', tail: '#FF8C00',
                shape: 'round', // Cá vàng tròn
                pattern: 'scales'
            },
            {
                name: 'Clownfish', 
                body: '#FF6B35', fins: '#FF4500', tail: '#FF6B35',
                shape: 'oval', // Cá hề oval
                pattern: 'stripes'
            },
            {
                name: 'Angelfish',
                body: '#87CEEB', fins: '#4682B4', tail: '#6495ED', 
                shape: 'tall', // Cá thiên thần cao
                pattern: 'spots'
            },
            {
                name: 'Shark',
                body: '#708090', fins: '#2F4F4F', tail: '#696969',
                shape: 'torpedo', // Cá mập thon dài
                pattern: 'none'
            },
            {
                name: 'Tropical',
                body: '#FF69B4', fins: '#DA70D6', tail: '#DDA0DD',
                shape: 'slim', // Cá nhiệt đới mảnh
                pattern: 'gradient'
            },
            {
                name: 'Tuna',
                body: '#4682B4', fins: '#191970', tail: '#000080',
                shape: 'muscular', // Cá ngừ cơ bắp
                pattern: 'metallic'
            },
            {
                name: 'Pufferfish',
                body: '#F0E68C', fins: '#DAA520', tail: '#B8860B',
                shape: 'round', // Cá nóc tròn
                pattern: 'spikes'
            },
            {
                name: 'Swordfish',
                body: '#4169E1', fins: '#0000CD', tail: '#191970',
                shape: 'sword', // Cá kiếm dài
                pattern: 'sleek'
            }
        ];
        
        const fishType = fishTypes[index % fishTypes.length];
        const displayName = fishName || fishType.name;
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'fish-svg');
        svg.setAttribute('viewBox', '0 0 120 70');
        
        let fishSVG = '';
        
        // Vẽ cá theo từng loại khác nhau
        switch(fishType.shape) {
            case 'round': // Goldfish, Pufferfish
                fishSVG = this.createRoundFish(fishType, displayName);
                break;
            case 'oval': // Clownfish
                fishSVG = this.createOvalFish(fishType, displayName);
                break;
            case 'tall': // Angelfish
                fishSVG = this.createTallFish(fishType, displayName);
                break;
            case 'torpedo': // Shark
                fishSVG = this.createTorpedoFish(fishType, displayName);
                break;
            case 'slim': // Tropical
                fishSVG = this.createSlimFish(fishType, displayName);
                break;
            case 'muscular': // Tuna
                fishSVG = this.createMuscularFish(fishType, displayName);
                break;
            case 'sword': // Swordfish
                fishSVG = this.createSwordFish(fishType, displayName);
                break;
            default:
                fishSVG = this.createOvalFish(fishType, displayName);
        }
        
        svg.innerHTML = fishSVG;
        
        // Start natural swimming animation with Anime.js
        this.startFishSwimmingAnimation(svg, index);
        
        return svg;
    }

    createRoundFish(fishType, name) {
        return `
            <!-- Fish Tail (Left side) -->
            <path class="fish-tail" d="M 15 35 Q 5 20 2 25 Q 5 35 2 45 Q 5 50 15 35" 
                  fill="${fishType.tail}" stroke="#333" stroke-width="1"/>
            
            <!-- Round Fish Body (Goldfish/Pufferfish) -->
            <circle class="fish-body" cx="60" cy="35" r="25" 
                    fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Fish Head (Right side) -->
            <circle cx="85" cy="35" r="18" fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Fish Eye -->
            <circle class="fish-eye-white" cx="92" cy="30" r="5" fill="white"/>
            <circle class="fish-eye-black" cx="94" cy="29" r="3" fill="black"/>
            <circle class="fish-eye-highlight" cx="95" cy="27" r="1.5" fill="white"/>
            
            <!-- Fish Mouth -->
            <ellipse class="fish-mouth" cx="103" cy="35" rx="4" ry="3" fill="#333"/>
            
            <!-- Top Fin -->
            <path class="fish-fin-top" d="M 50 10 Q 60 5 70 10 Q 60 15 50 10" 
                  fill="${fishType.fins}" stroke="#333" stroke-width="1"/>
            
            <!-- Bottom Fin -->
            <path class="fish-fin-bottom" d="M 50 60 Q 60 65 70 60 Q 60 55 50 60" 
                  fill="${fishType.fins}" stroke="#333" stroke-width="1"/>
            
            <!-- Side Fins -->
            <ellipse class="fish-side-fin" cx="65" cy="55" rx="10" ry="6" fill="${fishType.fins}" 
                     stroke="#333" stroke-width="1"/>
            
            <!-- Fish Name on Body -->
            <text x="60" y="38" font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
                  text-anchor="middle" fill="white" stroke="#333" stroke-width="0.7">${name}</text>
        `;
    }

    createOvalFish(fishType, name) {
        return `
            <!-- Fish Tail (Left side) -->
            <path class="fish-tail" d="M 15 35 Q 2 22 5 28 Q 8 35 5 42 Q 2 48 15 35" 
                  fill="${fishType.tail}" stroke="#333" stroke-width="1"/>
            
            <!-- Oval Fish Body (Clownfish) -->
            <ellipse class="fish-body" cx="60" cy="35" rx="27" ry="20" 
                     fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Fish Head (Right side) -->
            <ellipse cx="87" cy="35" rx="15" ry="18" fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Clownfish Stripes -->
            <ellipse cx="65" cy="35" rx="4" ry="20" fill="white" opacity="0.8"/>
            <ellipse cx="45" cy="35" rx="3" ry="18" fill="white" opacity="0.8"/>
            
            <!-- Fish Eye -->
            <circle class="fish-eye-white" cx="94" cy="30" r="5" fill="white"/>
            <circle class="fish-eye-black" cx="96" cy="29" r="3" fill="black"/>
            <circle class="fish-eye-highlight" cx="97" cy="27" r="1.5" fill="white"/>
            
            <!-- Fish Mouth -->
            <ellipse class="fish-mouth" cx="102" cy="35" rx="3" ry="4" fill="#333"/>
            
            <!-- Top Fin -->
            <path class="fish-fin-top" d="M 52 15 Q 62 8 72 15 Q 62 20 52 15" 
                  fill="${fishType.fins}" stroke="#333" stroke-width="1"/>
            
            <!-- Bottom Fin -->
            <path class="fish-fin-bottom" d="M 52 55 Q 62 62 72 55 Q 62 50 52 55" 
                  fill="${fishType.fins}" stroke="#333" stroke-width="1"/>
            
            <!-- Side Fins -->
            <ellipse class="fish-side-fin" cx="70" cy="52" rx="8" ry="5" fill="${fishType.fins}" 
                     stroke="#333" stroke-width="1"/>
            
            <!-- Fish Name on Body -->
            <text x="60" y="38" font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
                  text-anchor="middle" fill="white" stroke="#333" stroke-width="0.7">${name}</text>
        `;
    }

    createTallFish(fishType, name) {
        return `
            <!-- Fish Tail (Left side) -->
            <path class="fish-tail" d="M 20 35 Q 10 20 5 25 Q 8 35 5 45 Q 10 50 20 35" 
                  fill="${fishType.tail}" stroke="#333" stroke-width="1"/>
            
            <!-- Tall Fish Body (Angelfish) -->
            <ellipse class="fish-body" cx="60" cy="35" rx="22" ry="30" 
                     fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Fish Head (Right side) -->
            <ellipse cx="82" cy="35" rx="12" ry="22" fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Fish Eye -->
            <circle class="fish-eye-white" cx="88" cy="30" r="4" fill="white"/>
            <circle class="fish-eye-black" cx="90" cy="29" r="2.5" fill="black"/>
            <circle class="fish-eye-highlight" cx="91" cy="27" r="1.2" fill="white"/>
            
            <!-- Fish Mouth -->
            <path class="fish-mouth" d="M 94 35 Q 97 33 100 35 Q 97 37 94 35" fill="#333"/>
            
            <!-- Tall Top Fin -->
            <path class="fish-fin-top" d="M 50 5 Q 60 2 70 5 Q 65 10 60 15 Q 55 10 50 5" 
                  fill="${fishType.fins}" stroke="#333" stroke-width="1"/>
            
            <!-- Tall Bottom Fin -->
            <path class="fish-fin-bottom" d="M 50 65 Q 60 68 70 65 Q 65 60 60 55 Q 55 60 50 65" 
                  fill="${fishType.fins}" stroke="#333" stroke-width="1"/>
            
            <!-- Side Fins -->
            <ellipse class="fish-side-fin" cx="68" cy="55" rx="6" ry="10" fill="${fishType.fins}" 
                     stroke="#333" stroke-width="1"/>
            
            <!-- Angelfish Spots -->
            <circle cx="65" cy="25" r="2.5" fill="${fishType.fins}" opacity="0.7"/>
            <circle cx="58" cy="30" r="2" fill="${fishType.fins}" opacity="0.7"/>
            <circle cx="62" cy="40" r="3" fill="${fishType.fins}" opacity="0.7"/>
            
            <!-- Fish Name on Body -->
            <text x="60" y="38" font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
                  text-anchor="middle" fill="white" stroke="#333" stroke-width="0.7">${name}</text>
        `;
    }

    createTorpedoFish(fishType, name) {
        return `
            <!-- Shark Tail (Left side) -->
            <path class="fish-tail" d="M 25 35 Q 12 20 2 28 Q 5 35 2 42 Q 12 50 25 35" 
                  fill="${fishType.tail}" stroke="#333" stroke-width="1"/>
            
            <!-- Torpedo Fish Body (Shark) -->
            <ellipse class="fish-body" cx="55" cy="35" rx="35" ry="15" 
                     fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Shark Head (Right side) -->
            <ellipse cx="80" cy="35" rx="18" ry="12" fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Shark Snout -->
            <ellipse cx="98" cy="35" rx="10" ry="8" fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Fish Eye -->
            <circle class="fish-eye-white" cx="85" cy="30" r="4" fill="white"/>
            <circle class="fish-eye-black" cx="87" cy="29" r="2.5" fill="black"/>
            <circle class="fish-eye-highlight" cx="88" cy="27" r="1" fill="white"/>
            
            <!-- Shark Mouth with Teeth -->
            <path class="fish-mouth" d="M 106 35 Q 100 38 94 35 Q 100 32 106 35" fill="#333"/>
            <polygon points="104,35 102,37 100,35" fill="white"/>
            <polygon points="100,35 98,37 96,35" fill="white"/>
            
            <!-- Dorsal Fin -->
            <path class="fish-fin-top" d="M 45 18 Q 55 10 65 18 Q 55 23 45 18" 
                  fill="${fishType.fins}" stroke="#333" stroke-width="1"/>
            
            <!-- Pectoral Fins -->
            <ellipse class="fish-side-fin" cx="75" cy="47" rx="10" ry="5" fill="${fishType.fins}" 
                     stroke="#333" stroke-width="1"/>
            
            <!-- Gill Slits -->
            <line x1="78" y1="30" x2="78" y2="40" stroke="#333" stroke-width="1"/>
            <line x1="75" y1="30" x2="75" y2="40" stroke="#333" stroke-width="1"/>
            <line x1="72" y1="30" x2="72" y2="40" stroke="#333" stroke-width="1"/>
            
            <!-- Fish Name on Body -->
            <text x="60" y="38" font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
                  text-anchor="middle" fill="white" stroke="#333" stroke-width="0.7">${name}</text>
        `;
    }

    createSlimFish(fishType, name) {
        return `
            <!-- Fish Tail (Left side) -->
            <path class="fish-tail" d="M 15 35 Q 2 25 5 30 Q 8 35 5 40 Q 2 45 15 35" 
                  fill="${fishType.tail}" stroke="#333" stroke-width="1"/>
            
            <!-- Slim Fish Body (Tropical) -->
            <ellipse class="fish-body" cx="60" cy="35" rx="30" ry="12" 
                     fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Fish Head (Right side) -->
            <ellipse cx="85" cy="35" rx="15" ry="10" fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Fish Eye -->
            <circle class="fish-eye-white" cx="92" cy="32" r="4" fill="white"/>
            <circle class="fish-eye-black" cx="94" cy="31" r="2" fill="black"/>
            <circle class="fish-eye-highlight" cx="95" cy="30" r="1" fill="white"/>
            
            <!-- Fish Mouth -->
            <ellipse class="fish-mouth" cx="100" cy="35" rx="3" ry="2" fill="#333"/>
            
            <!-- Long Dorsal Fin -->
            <path class="fish-fin-top" d="M 35 20 Q 45 15 55 17 Q 65 19 75 20 Q 65 25 55 23 Q 45 25 35 20" 
                  fill="${fishType.fins}" stroke="#333" stroke-width="1"/>
            
            <!-- Anal Fin -->
            <path class="fish-fin-bottom" d="M 45 50 Q 55 53 65 50 Q 55 47 45 50" 
                  fill="${fishType.fins}" stroke="#333" stroke-width="1"/>
            
            <!-- Pectoral Fin -->
            <ellipse class="fish-side-fin" cx="75" cy="45" rx="6" ry="4" fill="${fishType.fins}" 
                     stroke="#333" stroke-width="1"/>
            
            <!-- Tropical Gradient Pattern -->
            <ellipse cx="65" cy="35" rx="25" ry="8" fill="url(#tropicalGradient)" opacity="0.5"/>
            <defs>
                <linearGradient id="tropicalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:${fishType.fins};stop-opacity:0.8" />
                    <stop offset="50%" style="stop-color:${fishType.tail};stop-opacity:0.4" />
                    <stop offset="100%" style="stop-color:${fishType.fins};stop-opacity:0.8" />
                </linearGradient>
            </defs>
            
            <!-- Fish Name on Body -->
            <text x="60" y="38" font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
                  text-anchor="middle" fill="white" stroke="#333" stroke-width="0.7">${name}</text>
        `;
    }

    createMuscularFish(fishType, name) {
        return `
            <!-- Powerful Tail (Left side) -->
            <path class="fish-tail" d="M 20 35 Q 5 22 2 28 Q 5 35 2 42 Q 5 48 20 35" 
                  fill="${fishType.tail}" stroke="#333" stroke-width="1"/>
            
            <!-- Muscular Fish Body (Tuna) -->
            <ellipse class="fish-body" cx="58" cy="35" rx="33" ry="17" 
                     fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Fish Head (Right side) -->
            <ellipse cx="82" cy="35" rx="17" ry="15" fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Fish Eye -->
            <circle class="fish-eye-white" cx="88" cy="30" r="5" fill="white"/>
            <circle class="fish-eye-black" cx="90" cy="29" r="3" fill="black"/>
            <circle class="fish-eye-highlight" cx="91" cy="28" r="1.5" fill="white"/>
            
            <!-- Fish Mouth -->
            <path class="fish-mouth" d="M 99 35 Q 95 33 91 35 Q 95 37 99 35" fill="#333"/>
            
            <!-- Dorsal Fin -->
            <path class="fish-fin-top" d="M 40 16 Q 50 11 60 16 Q 70 18 80 16 Q 70 21 60 21 Q 50 21 40 16" 
                  fill="${fishType.fins}" stroke="#333" stroke-width="1"/>
            
            <!-- Anal Fin -->
            <path class="fish-fin-bottom" d="M 50 54 Q 60 57 70 54 Q 60 51 50 54" 
                  fill="${fishType.fins}" stroke="#333" stroke-width="1"/>
            
            <!-- Pectoral Fin -->
            <ellipse class="fish-side-fin" cx="78" cy="47" rx="8" ry="6" fill="${fishType.fins}" 
                     stroke="#333" stroke-width="1"/>
            
            <!-- Muscle Lines -->
            <path d="M 65 20 Q 75 25 85 20" stroke="${fishType.fins}" stroke-width="1" fill="none" opacity="0.7"/>
            <path d="M 65 35 Q 75 40 85 35" stroke="${fishType.fins}" stroke-width="1" fill="none" opacity="0.7"/>
            <path d="M 65 50 Q 75 55 85 50" stroke="${fishType.fins}" stroke-width="1" fill="none" opacity="0.7"/>
            
            <!-- Fish Name on Body -->
            <text x="60" y="38" font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
                  text-anchor="middle" fill="white" stroke="#333" stroke-width="0.7">${name}</text>
        `;
    }

    createSwordFish(fishType, name) {
        return `
            <!-- Crescent Tail (Left side) -->
            <path class="fish-tail" d="M 25 35 Q 12 20 2 25 Q 5 35 2 45 Q 12 50 25 35" 
                  fill="${fishType.tail}" stroke="#333" stroke-width="1"/>
            <path d="M 12 20 Q 8 15 4 20" fill="${fishType.tail}" stroke="#333" stroke-width="1"/>
            <path d="M 12 50 Q 8 55 4 50" fill="${fishType.tail}" stroke="#333" stroke-width="1"/>
            
            <!-- Swordfish Body -->
            <ellipse class="fish-body" cx="50" cy="35" rx="30" ry="15" 
                     fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Fish Head (Right side) -->
            <ellipse cx="72" cy="35" rx="15" ry="12" fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Sword (Bill) -->
            <ellipse cx="92" cy="35" rx="15" ry="3" fill="${fishType.body}" stroke="#333" stroke-width="1"/>
            
            <!-- Fish Eye -->
            <circle class="fish-eye-white" cx="78" cy="30" r="4" fill="white"/>
            <circle class="fish-eye-black" cx="80" cy="29" r="2" fill="black"/>
            <circle class="fish-eye-highlight" cx="81" cy="28" r="1" fill="white"/>
            
            <!-- Fish Mouth -->
            <ellipse class="fish-mouth" cx="84" cy="35" rx="3" ry="2" fill="#333"/>
            
            <!-- High Dorsal Fin -->
            <path class="fish-fin-top" d="M 40 18 Q 50 10 60 15 Q 70 17 80 15 Q 70 22 60 22 Q 50 25 40 18" 
                  fill="${fishType.fins}" stroke="#333" stroke-width="1"/>
            
            <!-- Anal Fin -->
            <path class="fish-fin-bottom" d="M 50 52 Q 60 55 70 52 Q 60 49 50 52" 
                  fill="${fishType.fins}" stroke="#333" stroke-width="1"/>
            
            <!-- Pectoral Fin -->
            <ellipse class="fish-side-fin" cx="65" cy="47" rx="8" ry="5" fill="${fishType.fins}" 
                     stroke="#333" stroke-width="1"/>
            
            <!-- Speed Lines -->
            <path d="M 70 25 L 85 23" stroke="${fishType.fins}" stroke-width="1" opacity="0.6"/>
            <path d="M 70 45 L 85 47" stroke="${fishType.fins}" stroke-width="1" opacity="0.6"/>
            
            <!-- Fish Name on Body -->
            <text x="60" y="38" font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
                  text-anchor="middle" fill="white" stroke="#333" stroke-width="0.7">${name}</text>
        `;
    }

    startFishSwimmingAnimation(svg, index) {
        // Natural swimming animation using Anime.js
        // Add safety checks for all elements
        
        // Body breathing animation
        const fishBody = svg.querySelector('.fish-body');
        if (fishBody) {
            anime({
                targets: fishBody,
                scaleY: [1, 1.05, 1],
                duration: 2000 + (index * 200),
                easing: 'easeInOutSine',
                loop: true
            });
        }

        // Tail wagging animation
        const fishTail = svg.querySelector('.fish-tail');
        if (fishTail) {
            anime({
                targets: fishTail,
                rotate: [-12, 12, -12],
                duration: 800 + (index * 100),
                easing: 'easeInOutQuad',
                loop: true,
                transformOrigin: '60 30'
            });
        }

        // Top fin movement
        const fishFinTop = svg.querySelector('.fish-fin-top');
        if (fishFinTop) {
            anime({
                targets: fishFinTop,
                scaleY: [0.8, 1.2, 0.8],
                rotate: [-5, 5, -5],
                duration: 1200 + (index * 150),
                easing: 'easeInOutSine',
                loop: true,
                transformOrigin: '35 15'
            });
        }

        // Bottom fin movement
        const fishFinBottom = svg.querySelector('.fish-fin-bottom');
        if (fishFinBottom) {
            anime({
                targets: fishFinBottom,
                scaleY: [0.9, 1.1, 0.9],
                rotate: [3, -3, 3],
                duration: 1000 + (index * 120),
                easing: 'easeInOutSine',
                loop: true,
                transformOrigin: '35 45'
            });
        }

        // Side fin movement
        const fishSideFin = svg.querySelector('.fish-side-fin');
        if (fishSideFin) {
            anime({
                targets: fishSideFin,
                scaleX: [0.8, 1.3, 0.8],
                duration: 900 + (index * 80),
                easing: 'easeInOutQuad',
                loop: true
            });
        }

        // Eye blinking animation
        const fishEye = svg.querySelector('.fish-eye-black');
        if (fishEye) {
            anime({
                targets: fishEye,
                scaleY: [1, 0.1, 1],
                duration: 150,
                easing: 'easeInOutQuad',
                delay: 3000 + (index * 500),
                loop: true
            });
        }

        // Mouth opening animation
        const fishMouth = svg.querySelector('.fish-mouth');
        if (fishMouth) {
            anime({
                targets: fishMouth,
                scaleX: [1, 1.3, 1],
                scaleY: [1, 0.7, 1],
                duration: 400,
                easing: 'easeInOutQuad',
                delay: 5000 + (index * 800),
                loop: true
            });
        }

        // Whole fish subtle floating animation
        anime({
            targets: svg,
            translateY: [-2, 2, -2],
            duration: 2500 + (index * 200),
            easing: 'easeInOutSine',
            loop: true
        });
    }

    createWaterBubbles() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const bubble = document.createElement('div');
                bubble.className = 'water-bubble';
                bubble.style.left = Math.random() * 90 + '%';
                bubble.style.bottom = '0px';
                bubble.style.width = Math.random() * 20 + 10 + 'px';
                bubble.style.height = bubble.style.width;
                bubble.style.animationDelay = Math.random() * 2 + 's';
                
                this.raceTrack.appendChild(bubble);
                
                // Remove bubble after animation
                setTimeout(() => {
                    if (bubble.parentNode) {
                        bubble.parentNode.removeChild(bubble);
                    }
                }, 3000);
            }, i * 400);
        }
    }

    getRaceSpeedRange() {
        const speedSetting = this.raceSpeed.value;
        
        switch(speedSetting) {
            case 'slow':
                return { min: 4, max: 7 }; // 4-7 seconds
            case 'fast':
                return { min: 1, max: 3 }; // 1-3 seconds
            case 'lightning':
                return { min: 0.5, max: 1.5 }; // 0.5-1.5 seconds
            default: // normal
                return { min: 2, max: 5 }; // 2-5 seconds
        }
    }

    async animateRace(fishNames) {
        const raceStartTime = Date.now(); // Track race start time
        const speedRange = this.getRaceSpeedRange();
        
        const fishes = fishNames.map((_, index) => ({
            element: document.getElementById(`fish-${index}`),
            speed: Math.random() * (speedRange.max - speedRange.min) + speedRange.min,
            name: fishNames[index],
            index: index
        }));

        // Add racing class to all fish for faster animation
        fishes.forEach(fish => fish.element.classList.add('racing'));

        // Calculate race distance
        const raceDistance = this.raceTrack.offsetWidth - 200; // Account for finish line and padding
        
        const racePromises = fishes.map(fish => {
            return new Promise((resolve) => {
                // Random speed variation during race
                const speedVariation = Math.random() * 0.5 + 0.75; // 0.75-1.25x speed
                const duration = (fish.speed * speedVariation) * 1000; // Convert to milliseconds for Anime.js

                // Enhanced racing animation with Anime.js
                anime({
                    targets: fish.element,
                    translateX: raceDistance,
                    duration: duration,
                    easing: 'linear',
                    update: (anim) => {
                        // Add dynamic swimming effects during race
                        const progress = anim.progress / 100;
                        if (progress > 0.1) {
                            // Intense swimming motion during race
                            const swimIntensity = 1 + Math.sin(Date.now() * 0.02) * 0.15;
                            const verticalBob = Math.sin(Date.now() * 0.015) * 3;
                            fish.element.style.transform = `translateX(${anim.animatables[0].transforms.translateX}px) translateY(${verticalBob}px) scale(${swimIntensity})`;
                        }
                    },
                    complete: () => {
                        // Remove racing class when finished
                        fish.element.classList.remove('racing');
                        
                        const finishTime = Date.now();
                        const raceTime = ((finishTime - raceStartTime) / 1000).toFixed(2);
                        
                        resolve({
                            name: fish.name,
                            index: fish.index,
                            finishTime: finishTime,
                            time: raceTime
                        });
                    }
                });
            });
        });

        // Wait for all fishes to finish (or timeout after 10 seconds)
        const results = [];
        let finishedCount = 0;
        
        racePromises.forEach((promise, index) => {
            promise.then(result => {
                result.position = ++finishedCount;
                results.push(result);
                
                if (finishedCount === 1) {
                    // Winner celebration
                    this.celebrateWinner(result);
                }
                
                if (finishedCount >= fishNames.length) {
                    this.showRaceResults(results);
                }
            });
        });

        // Timeout safety
        setTimeout(() => {
            if (results.length < fishNames.length) {
                this.showRaceResults(results);
            }
        }, 15000);
    }

    celebrateWinner(winner) {
        const winnerFish = document.getElementById(`fish-${winner.index}`);
        
        // Winner celebration animation with Anime.js
        anime.timeline({
            easing: 'easeOutBounce'
        })
        .add({
            targets: winnerFish,
            scale: [1, 1.5, 1.2],
            rotate: '1turn',
            duration: 800
        })
        .add({
            targets: winnerFish,
            translateY: [-10, 0, -5, 0],
            duration: 600,
            easing: 'easeOutBounce'
        }, '-=400')
        .add({
            targets: winnerFish.querySelector('.fish-tail'),
            rotate: [-20, 20, -15, 15, 0],
            duration: 1000,
            easing: 'easeInOutQuad'
        }, '-=800');

        // Create celebration confetti
        this.createConfetti();
        
        // Play winner sound effect (if available)
        this.createWaveEffect();
    }

    showRaceResults(results) {
        // Sort by position
        results.sort((a, b) => a.position - b.position);
        
        // Show results section
        this.raceResults.style.display = 'block';
        
        // Clear previous results
        this.fullResults.innerHTML = '';
        
        // Create results for all fish
        const medals = ['🥇', '🥈', '🥉'];
        
        results.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = `result-item position-${result.position}`;
            resultItem.style.animationDelay = `${index * 0.1}s`;
            
            // Position number
            const position = document.createElement('div');
            position.className = `result-position position-${result.position}`;
            position.textContent = `#${result.position}`;
            
            // Fish SVG
            const fishContainer = document.createElement('div');
            fishContainer.className = 'result-fish';
            const fishSvg = this.createFishSVG(result.index, result.name);
            fishContainer.appendChild(fishSvg);
            
            // Fish name
            const name = document.createElement('div');
            name.className = 'result-name';
            name.textContent = result.name;
            
            // Race time
            const time = document.createElement('div');
            time.className = 'result-time';
            time.textContent = `${result.time}s`;
            
            // Medal for top 3
            const medal = document.createElement('div');
            medal.className = 'result-medal';
            if (result.position <= 3) {
                medal.textContent = medals[result.position - 1];
            }
            
            resultItem.appendChild(position);
            resultItem.appendChild(fishContainer);
            resultItem.appendChild(name);
            resultItem.appendChild(time);
            resultItem.appendChild(medal);
            
            this.fullResults.appendChild(resultItem);
        });

        // Reset button functionality - clear input and allow new race
        this.startRaceBtn.textContent = '🏁 Đua mới';
        this.startRaceBtn.disabled = false;
        this.startRaceBtn.onclick = () => {
            this.startRaceBtn.textContent = '🏁 Bắt đầu đua!';
            this.resetFishRace();
        };

        // Scroll to results
        this.raceResults.scrollIntoView({ behavior: 'smooth' });
    }

    resetFishRace() {
        // Remove racing class from all fish before clearing
        document.querySelectorAll('.fish').forEach(fish => {
            fish.classList.remove('racing');
        });
        
        // Clear any existing animations (both GSAP and Anime.js)
        gsap.killTweensOf('.fish');
        gsap.killTweensOf('.confetti-piece');
        gsap.killTweensOf('.water-bubble');
        
        // Remove all Anime.js animations
        anime.remove('.fish');
        anime.remove('.fish-svg');
        anime.remove('.fish-tail');
        anime.remove('.fish-fin-top');
        anime.remove('.fish-fin-bottom');
        anime.remove('.fish-body');
        anime.remove('.fish-eye-black');
        anime.remove('.fish-mouth');
        anime.remove('.fish-pattern-1');
        anime.remove('.fish-pattern-2');
        anime.remove('.fish-pattern-3');
        anime.remove('.fish-side-fin');
        
        // Reset track
        this.raceTrack.innerHTML = `
            <div class="race-instructions">
                <p class="placeholder">Nhập tên cá và nhấn "Bắt đầu đua!" để xem cuộc đua</p>
            </div>
        `;
        
        // Hide results
        this.raceResults.style.display = 'none';
        
        // Reset button
        this.startRaceBtn.disabled = false;
        
        // Clear any errors
        this.clearFishError();
        
        // Re-validate inputs
        this.validateFishInputs();
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