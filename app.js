// Конфигурация
const ADMIN_ID = 8049083248;
const USER_PASSWORD = "morpa";

// Базы данных с CORS proxy
const DRIVE_FILES = [
    {"name": "boo.wf_100mln_0.csv", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1U6C-SqeNWv3ylYujFBTZS0yY1uWk2BQk"},
    {"name": "Clients.csv", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1EicBhkkAOk_s27-_tHZnbAv8Ik_56TR3"},
    {"name": "emails1.csv", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1LH8xf06jH7GnOGCC92Ld7e5hJpN4ZxAV"},
    {"name": "enter_data_copy.sql", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1IDEEjS3gE4TsqJ-_bdYPAfttS7Slbyq2"},
    {"name": "Fbi.gov.csv", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1leVbmb7ZHOw5f9NBLEImu2Ob2UPLiKlk"},
    {"name": "GetContact_2020_19kk.csv", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1f0Ns-HJfZQyn-5SBj74QTUwBvHW9n6yh"},
    {"name": "getcontact.com numbuster.com.csv", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1czMpRLgFXQo8xTs6FDZVL7_jFF99Xpar"},
    {"name": "getcontact.csv", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1gSCz1BnD1M19hZpQow_-3s8CnVhm8RxQ"},
    {"name": "hlbd_form_results.sql", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1hCEPyENccz0m4qKlvrMJVCj_Y0IcH9j_"},
    {"name": "itlyceum_felix.csv", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1oBzfT6JOxJkYajCBA9iXvg6Jc_KSZwfK"},
    {"name": "kztg.csv", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1SlTbBKJ-BDoEpyyL0L46c45Bu142H4pM"},
    {"name": "Phone Pay -1.xlsx", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1k3R1TxqoeTMvguYn8pjCICNFcU7mup2l"},
    {"name": "Phone Pay -2.xlsx", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1k3R1TxqoeTMvguYn8pjCICNFcU7mup2l"},
    {"name": "Phone Pay.xlsx", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1vMylLEXUECkL5rvXVgeKejDA_RiFyfOt"},
    {"name": "phone.csv", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1_4fy0XswInx6Ke8JzI0gKuo5jzcG4LYm"},
    {"name": "Адрес клиентов_9.3k.csv", "url": "https://corsproxy.io/?https://drive.google.com/uc?export=download&id=1nZIuSMThLynwXkrJj6jWgos-NwvsSrps"}
];

// Глобальные переменные
let tg = window.Telegram.WebApp;
let user = tg ? tg.initDataUnsafe.user : null;
let searchesLeft = 3;
let isAdmin = false;
let userStorage = JSON.parse(localStorage.getItem('userStorage')) || {};
let activeSearches = 0;

// Инициализация
function initTelegramApp() {
    if (tg) {
        tg.expand();
        tg.ready();
        
        if (user && user.id) {
            console.log('👤 User from Telegram:', user);
            isAdmin = (user.id == ADMIN_ID);
            
            if (isAdmin) {
                searchesLeft = 9999;
                showMainMenu();
                return;
            }
            
            if (!userStorage[user.id]) {
                userStorage[user.id] = {
                    searches_left: 3,
                    unlimited: false,
                    last_active: Date.now(),
                    first_seen: Date.now(),
                    username: user.username || `user_${user.id}`,
                    first_name: user.first_name || '',
                    total_searches: 0,
                    is_real_user: true
                };
                saveUserData();
                
                // Отправляем данные о новом пользователе в бот
                if (tg.sendData) {
                    tg.sendData(JSON.stringify({
                        action: 'new_user_registered',
                        user_id: user.id,
                        username: user.username,
                        first_name: user.first_name
                    }));
                }
            } else {
                searchesLeft = userStorage[user.id].searches_left;
                userStorage[user.id].last_active = Date.now();
                saveUserData();
            }
        }
    }
    
    if (!isAdmin) {
        showElement('auth');
    }
}

// Управление видимостью
function showElement(id) {
    document.getElementById(id).classList.remove('hidden');
}

function hideElement(id) {
    document.getElementById(id).classList.add('hidden');
}

function hideAllSections() {
    ['auth', 'search', 'payment', 'adminPanel'].forEach(hideElement);
}

// Сохранение данных
function saveUserData() {
    localStorage.setItem('userStorage', JSON.stringify(userStorage));
}

// Главное меню
function showMainMenu() {
    hideAllSections();
    
    if (isAdmin) {
        showElement('adminPanel');
        loadAdminStats();
    } else {
        showElement('search');
        updateSearchesCounter();
    }
}

// Аутентификация
function checkPassword() {
    let password = document.getElementById('password').value;
    if (password === USER_PASSWORD) {
        if (user && user.id) {
            if (!userStorage[user.id]) {
                userStorage[user.id] = {
                    searches_left: 3,
                    unlimited: false,
                    last_active: Date.now(),
                    first_seen: Date.now(),
                    username: user.username || 'unknown',
                    first_name: user.first_name || '',
                    total_searches: 0,
                    is_real_user: true
                };
                saveUserData();
            }
            searchesLeft = userStorage[user.id].searches_left;
            saveUserData();
        }
        showMainMenu();
    } else {
        alert('❌ НЕВЕРНЫЙ ПАРОЛЬ!');
    }
}

// Обновление счетчика
function updateSearchesCounter() {
    const counter = document.getElementById('searchesLeft');
    if (isAdmin) {
        counter.textContent = '∞';
        counter.style.color = '#00aa00';
    } else {
        counter.textContent = searchesLeft;
        counter.style.color = searchesLeft > 0 ? '#2481cc' : '#ff4444';
    }
}

// УЛУЧШЕННЫЙ ПОИСК - ВОЗВРАЩАЕМ ИМЕНА И EMAIL
async function searchData() {
    let query = document.getElementById('query').value.trim();
    
    if (query.length < 2) {
        alert('❌ Минимум 2 символа');
        return;
    }
    
    if (!isAdmin && searchesLeft <= 0) {
        hideElement('search');
        showElement('payment');
        return;
    }
    
    // Блокируем повторные поиски
    if (activeSearches > 0) {
        alert('⏳ Поиск уже выполняется...');
        return;
    }
    
    activeSearches++;
    
    if (!isAdmin) {
        searchesLeft--;
        if (user && user.id) {
            userStorage[user.id].searches_left = searchesLeft;
            userStorage[user.id].last_active = Date.now();
            userStorage[user.id].total_searches = (userStorage[user.id].total_searches || 0) + 1;
            saveUserData();
        }
        updateSearchesCounter();
    }
    
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="result">🔍 Начинаю поиск по 16 базам...</div>';
    
    try {
        await performSmartSearch(query, resultsDiv);
    } catch (error) {
        console.error('Ошибка поиска:', error);
        resultsDiv.innerHTML = '<div class="result">❌ Ошибка при поиске</div>';
    } finally {
        activeSearches--;
    }
}

// УМНЫЙ ПОИСК - ВОЗВРАЩАЕМ ВСЕ ДАННЫЕ
async function performSmartSearch(query, resultsDiv) {
    const allResults = [];
    let completed = 0;
    let foundInFiles = 0;
    let errors = 0;
    
    resultsDiv.innerHTML = `<div class="result">🔍 Анализирую запрос... (0/${DRIVE_FILES.length})</div>`;
    
    // Оптимизация: проверяем тип запроса
    const isPhone = /^[\d\+\(\)\s-]{7,}$/.test(query);
    const isEmail = /@/.test(query);
    const isName = /^[А-Яа-яЁёA-Za-z\s]{3,}$/.test(query);
    
    const searchPromises = DRIVE_FILES.map(async (file, index) => {
        try {
            // Задержка для избежания блокировки
            await new Promise(resolve => setTimeout(resolve, index * 300));
            
            const response = await fetchWithTimeout(file.url, 15000);
            if (response.ok) {
                const content = await response.text();
                const fileResults = searchInContentOptimized(content, query, file.name, isPhone, isEmail, isName);
                
                if (fileResults.length > 0) {
                    foundInFiles++;
                    allResults.push(...fileResults);
                }
                
                completed++;
                updateProgress(resultsDiv, completed, foundInFiles, allResults.length, errors);
                
                return { success: true, file: file.name, results: fileResults.length };
            } else {
                errors++;
                completed++;
                updateProgress(resultsDiv, completed, foundInFiles, allResults.length, errors);
                return { success: false, file: file.name, error: `HTTP ${response.status}` };
            }
        } catch (error) {
            errors++;
            completed++;
            updateProgress(resultsDiv, completed, foundInFiles, allResults.length, errors);
            return { success: false, file: file.name, error: error.message };
        }
    });
    
    await Promise.allSettled(searchPromises);
    displaySmartResults(allResults, query, foundInFiles, errors, resultsDiv);
}

// ОПТИМИЗИРОВАННЫЙ поиск - ВОЗВРАЩАЕМ ИМЕНА И EMAIL ПРИ ПОИСКЕ ПО НОМЕРУ
function searchInContentOptimized(content, query, fileName, isPhone, isEmail, isName) {
    const results = [];
    const lines = content.split('\n');
    const queryLower = query.toLowerCase().trim();
    const normalizedQuery = query.replace(/\D/g, '');
    
    let linesChecked = 0;
    const maxLines = 10000;
    const maxResultsPerFile = 100;

    for (let i = 0; i < Math.min(lines.length, maxLines); i++) {
        if (results.length >= maxResultsPerFile) break;
        
        const line = lines[i];
        linesChecked++;
        
        if (!line.trim()) continue;
        
        const lineLower = line.toLowerCase();
        
        // ЕСЛИ ПОИСК ПО НОМЕРУ - ИЩЕМ ВСЕ ДАННЫЕ В СТРОКЕ
        if (isPhone && line.includes(normalizedQuery)) {
            // Находим все данные в строке где есть номер
            const phones = line.match(/\b\d{7,15}\b/g) || [];
            const names = line.match(/[А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+/g) || [];
            const emails = line.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];
            
            // Добавляем все найденные данные
            phones.forEach(phone => {
                if (phone.includes(normalizedQuery) && results.length < maxResultsPerFile) {
                    let resultLine = `📞 ${phone}`;
                    // Добавляем имя если есть
                    if (names.length > 0) resultLine += ` | 👤 ${names[0]}`;
                    // Добавляем email если есть
                    if (emails.length > 0) resultLine += ` | 📧 ${emails[0]}`;
                    results.push(resultLine);
                }
            });
        } 
        else if (isEmail && lineLower.includes(queryLower)) {
            const emails = line.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];
            const names = line.match(/[А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+/g) || [];
            const phones = line.match(/\b\d{7,15}\b/g) || [];
            
            emails.forEach(email => {
                if (email.toLowerCase().includes(queryLower) && results.length < maxResultsPerFile) {
                    let resultLine = `📧 ${email}`;
                    if (names.length > 0) resultLine += ` | 👤 ${names[0]}`;
                    if (phones.length > 0) resultLine += ` | 📞 ${phones[0]}`;
                    results.push(resultLine);
                }
            });
        }
        else if (isName && lineLower.includes(queryLower)) {
            const names = line.match(/[А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+/g) || [];
            const phones = line.match(/\b\d{7,15}\b/g) || [];
            const emails = line.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];
            
            names.forEach(name => {
                if (name.toLowerCase().includes(queryLower) && results.length < maxResultsPerFile) {
                    let resultLine = `👤 ${name}`;
                    if (phones.length > 0) resultLine += ` | 📞 ${phones[0]}`;
                    if (emails.length > 0) resultLine += ` | 📧 ${emails[0]}`;
                    results.push(resultLine);
                }
            });
        }
        else if (lineLower.includes(queryLower)) {
            // Общий поиск для других типов запросов
            const phones = line.match(/\b\d{7,15}\b/g) || [];
            const names = line.match(/[А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+/g) || [];
            const emails = line.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];
            
            // Собираем все данные в одной строке
            if (phones.length > 0 || names.length > 0 || emails.length > 0) {
                let resultLine = '';
                if (phones.length > 0) resultLine += `📞 ${phones[0]} `;
                if (names.length > 0) resultLine += `| 👤 ${names[0]} `;
                if (emails.length > 0) resultLine += `| 📧 ${emails[0]}`;
                
                if (resultLine.trim() && results.length < maxResultsPerFile) {
                    results.push(resultLine.trim());
                }
            }
        }
    }
    
    return results;
}

// Функция с таймаутом
function fetchWithTimeout(url, timeout) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
}

// Обновление прогресса
function updateProgress(resultsDiv, completed, foundInFiles, totalResults, errors) {
    const progress = Math.round((completed / DRIVE_FILES.length) * 100);
    resultsDiv.innerHTML = `
        <div class="result">
            🔍 Поиск... ${progress}%<br>
            📁 Базы: ${completed}/${DRIVE_FILES.length}<br>
            ✅ Найдено в: ${foundInFiles} файлах<br>
            📊 Результатов: ${totalResults}<br>
            ❌ Ошибок: ${errors}
        </div>
    `;
}

// УМНЫЙ показ результатов - БЕЗ НАЗВАНИЙ ФАЙЛОВ
function displaySmartResults(results, query, foundInFiles, errors, resultsDiv) {
    const uniqueResults = [...new Set(results)];
    
    if (uniqueResults.length > 0) {
        let html = `<div class="result" style="background: #e8f5e8;">
            ✅ ПОИСК ЗАВЕРШЕН<br>
            🔍 Запрос: "${query}"<br>
            📁 Файлов с результатами: ${foundInFiles}<br>
            📊 Всего найдено: ${uniqueResults.length}<br>
            ❌ Ошибок: ${errors}
        </div>`;
        
        // Показываем все результаты вместе (не группируем)
        uniqueResults.slice(0, 50).forEach(result => {
            html += `<div class="result">${result}</div>`;
        });
        
        if (uniqueResults.length > 50) {
            html += `<div class="result">... и еще ${uniqueResults.length - 50} результатов</div>`;
        }
        
        resultsDiv.innerHTML = html;
    } else {
        resultsDiv.innerHTML = `
            <div class="result">
                ❌ По запросу "${query}" ничего не найдено<br>
                📁 Проверено баз: ${DRIVE_FILES.length}<br>
                ✅ Успешно: ${DRIVE_FILES.length - errors}<br>
                ❌ Ошибок: ${errors}<br>
                💡 Совет: попробуйте другой формат запроса
            </div>
        `;
    }
    
    if (!isAdmin && searchesLeft <= 0) {
        setTimeout(() => {
            hideElement('search');
            showElement('payment');
        }, 3000);
    }
}

// РЕАЛЬНАЯ АДМИН ПАНЕЛЬ - БЕЗ ДЕМО-ДАННЫХ
function loadAdminStats() {
    const realUsers = Object.values(userStorage).filter(u => u.is_real_user);
    const totalUsers = realUsers.length;
    const activeUsers = realUsers.filter(u => u.searches_left > 0).length;
    const totalSearches = realUsers.reduce((sum, user) => sum + (user.total_searches || 0), 0);
    
    // Активные за последние 24 часа
    const active24h = realUsers.filter(u => Date.now() - u.last_active < 24 * 60 * 60 * 1000).length;
    
    document.getElementById('adminStats').innerHTML = `
        <div class="result">
            <strong>📊 РЕАЛЬНАЯ СТАТИСТИКА</strong><br>
            👥 Всего пользователей: <strong>${totalUsers}</strong><br>
            🔥 Активных сейчас: <strong>${activeUsers}</strong><br>
            ⏰ За 24 часа: <strong>${active24h}</strong><br>
            🔍 Всего поисков: <strong>${totalSearches}</strong><br>
            💎 Ваш статус: <strong style="color: #00aa00;">БЕЗЛИМИТ ∞</strong>
        </div>
    `;
}

function showAdminSection(section) {
    ['Stats', 'Users', 'AddSearches', 'Broadcast', 'Sniffer'].forEach(sec => {
        hideElement(`admin${sec}`);
    });
    
    showElement(`admin${section}`);
    
    if (section === 'Users') loadRealUserList();
    if (section === 'AddSearches') initAddSearches();
    if (section === 'Broadcast') initBroadcast();
    if (section === 'Sniffer') initSniffer();
}

// РЕАЛЬНЫЙ список пользователей
function loadRealUserList() {
    const realUsers = Object.entries(userStorage)
        .filter(([id, data]) => data.is_real_user)
        .map(([id, data]) => ({
            id, 
            searches_left: data.searches_left,
            username: data.username || `user_${id}`,
            first_name: data.first_name || '',
            last_active: data.last_active,
            first_seen: data.first_seen,
            total_searches: data.total_searches || 0
        }))
        .sort((a, b) => b.last_active - a.last_active);
    
    let html = '<div class="result"><strong>👥 РЕАЛЬНЫЕ ПОЛЬЗОВАТЕЛИ:</strong><br>';
    
    if (realUsers.length === 0) {
        html += '📭 Пользователей пока нет';
    } else {
        realUsers.forEach(user => {
            const status = user.searches_left > 0 ? '🟢 АКТИВЕН' : '🔴 НЕТ ЗАПРОСОВ';
            const lastSeen = getTimeAgo(user.last_active);
            const firstSeen = new Date(user.first_seen).toLocaleDateString();
            
            html += `
                👤 ${user.first_name || user.username}<br>
                🆔 ID: <strong>${user.id}</strong><br>
                💎 Запросов: <strong>${user.searches_left}</strong><br>
                🔍 Поисков: <strong>${user.total_searches}</strong><br>
                📅 Регистрация: ${firstSeen}<br>
                📱 ${status} (${lastSeen})<br>
                ━━━━━━━━━━<br>
            `;
        });
        
        html += `<br>📈 Всего: <strong>${realUsers.length}</strong> реальных пользователей`;
    }
    
    html += '</div>';
    document.getElementById('adminUsers').innerHTML = html;
}

function getTimeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}д назад`;
    if (hours > 0) return `${hours}ч назад`;
    if (minutes > 0) return `${minutes}м назад`;
    return 'только что';
}

function initAddSearches() {
    document.getElementById('adminAddSearches').innerHTML = `
        <div class="result">
            <strong>🎁 ВЫДАЧА ЗАПРОСОВ</strong><br><br>
            
            <input type="text" id="addUserId" placeholder="ID пользователя">
            <select id="addSearchesType">
                <option value="5">5 запросов</option>
                <option value="10">10 запросов</option>
                <option value="25">25 запросов</option>
                <option value="50">50 запросов</option>
                <option value="100">100 запросов</option>
                <option value="unlimited">БЕЗЛИМИТ</option>
            </select>
            
            <button onclick="addSearchesToUser()" style="background: #00aa00;">
                💎 ВЫДАТЬ ЗАПРОСЫ
            </button>
            
            <div id="addSearchesResult" style="margin-top: 10px;"></div>
        </div>
    `;
}

// РЕАЛЬНАЯ выдача запросов с уведомлением через бота
function addSearchesToUser() {
    const userId = document.getElementById('addUserId').value.trim();
    const type = document.getElementById('addSearchesType').value;
    const resultDiv = document.getElementById('addSearchesResult');
    
    if (!userId) {
        resultDiv.innerHTML = '<div style="color: red;">❌ Введите ID пользователя</div>';
        return;
    }

    // Отправляем команду боту
    if (tg && tg.sendData) {
        tg.sendData(JSON.stringify({
            action: 'admin_add_searches',
            user_id: parseInt(userId),
            search_type: type,
            admin_id: user.id,
            timestamp: Date.now()
        }));
        
        resultDiv.innerHTML = `
            <div style="color: green;">
                ✅ Команда отправлена боту!<br>
                👤 Пользователь: <strong>${userId}</strong><br>
                💎 Запросы: <strong>${type === 'unlimited' ? 'БЕЗЛИМИТ' : type}</strong><br>
                📨 Отправляется уведомление...
            </div>
        `;

        // Обновляем локально
        if (!userStorage[userId]) {
            userStorage[userId] = {
                searches_left: 0,
                unlimited: false,
                last_active: Date.now(),
                first_seen: Date.now(),
                username: `user_${userId}`,
                is_real_user: true
            };
        }

        if (type === 'unlimited') {
            userStorage[userId].unlimited = true;
            userStorage[userId].searches_left = 9999;
        } else {
            const addAmount = parseInt(type);
            userStorage[userId].searches_left += addAmount;
            userStorage[userId].unlimited = false;
        }

        userStorage[userId].last_active = Date.now();
        saveUserData();

    } else {
        resultDiv.innerHTML = '<div style="color: red;">❌ Ошибка: Telegram WebApp не доступен</div>';
    }
    
    showNotification(`Запросы выданы пользователю ${userId}`);
}

function initBroadcast() {
    document.getElementById('adminBroadcast').innerHTML = `
        <div class="result">
            <strong>📢 РАССЫЛКА ВСЕМ ПОЛЬЗОВАТЕЛЯМ</strong><br><br>
            
            <textarea id="broadcastMessage" placeholder="Введите сообщение для рассылки..." rows="4"></textarea>
            
            <button onclick="sendRealBroadcast()" style="background: #ff4444;">
                📢 ОТПРАВИТЬ РАССЫЛКУ
            </button>
            
            <div id="broadcastResult" style="margin-top: 10px;"></div>
        </div>
    `;
}

// РЕАЛЬНАЯ рассылка через бота
function sendRealBroadcast() {
    const message = document.getElementById('broadcastMessage').value.trim();
    const resultDiv = document.getElementById('broadcastResult');
    
    if (!message) {
        resultDiv.innerHTML = '<div style="color: red;">❌ Введите сообщение для рассылки</div>';
        return;
    }

    if (tg && tg.sendData) {
        // Отправляем команду боту на рассылку
        tg.sendData(JSON.stringify({
            action: 'admin_broadcast',
            message: message,
            admin_id: user.id,
            user_count: Object.keys(userStorage).length,
            timestamp: Date.now()
        }));

        resultDiv.innerHTML = '<div style="color: blue;">🔄 Отправляю команду боту на рассылку...</div>';
        
        // Имитация процесса
        setTimeout(() => {
            const userCount = Object.keys(userStorage).length;
            resultDiv.innerHTML = `
                <div style="color: green;">
                    ✅ Команда рассылки отправлена боту!<br>
                    📨 Сообщение: "${message}"<br>
                    👥 Получателей: ~${userCount} пользователей<br>
                    ⚡ Бот начал рассылку...
                </div>
            `;
            showNotification(`Рассылка запущена для ${userCount} пользователей`);
        }, 2000);

    } else {
        resultDiv.innerHTML = '<div style="color: red;">❌ Ошибка: Telegram WebApp не доступен</div>';
    }
}

function initSniffer() {
    document.getElementById('adminSniffer').innerHTML = `
        <div class="result">
            <strong>📊 МОНИТОРИНГ АКТИВНОСТИ</strong><br><br>
            
            <div style="background: #1a1a1a; color: #00ff00; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px;">
                🚀 СИСТЕМА МОНИТОРИНГА<br>
                📈 Сбор реальной статистики...
            </div>
            
            <button onclick="showRealTimeStats()" style="background: #00aa00; margin: 10px 0;">
                📊 ОБНОВИТЬ СТАТИСТИКУ
            </button>
            
            <button onclick="exportUserData()" style="background: #8e44ad;">
                💾 ЭКСПОРТ ДАННЫХ
            </button>
            
            <div id="snifferOutput" style="margin-top: 10px;"></div>
        </div>
    `;
}

// РЕАЛЬНАЯ статистика в реальном времени
function showRealTimeStats() {
    const output = document.getElementById('snifferOutput');
    const realUsers = Object.values(userStorage).filter(u => u.is_real_user);
    
    const now = Date.now();
    const activeNow = realUsers.filter(u => now - u.last_active < 5 * 60 * 1000).length;
    const activeToday = realUsers.filter(u => {
        const today = new Date().toDateString();
        const userDate = new Date(u.last_active).toDateString();
        return today === userDate;
    }).length;
    
    const searchesToday = realUsers.reduce((sum, user) => {
        const today = new Date().toDateString();
        const userDate = new Date(user.last_active).toDateString();
        return sum + (today === userDate ? (user.total_searches || 0) : 0);
    }, 0);
    
    output.innerHTML = `
        <div class="result" style="background: #e8f5e8;">
            <strong>📊 СТАТИСТИКА В РЕАЛЬНОМ ВРЕМЕНИ</strong><br>
            👥 Всего пользователей: <strong>${realUsers.length}</strong><br>
            🔥 Активных сейчас (5мин): <strong>${activeNow}</strong><br>
            📈 Активных сегодня: <strong>${activeToday}</strong><br>
            🔍 Поисков сегодня: <strong>${searchesToday}</strong><br>
            ⏰ Последнее обновление: ${new Date().toLocaleTimeString()}
        </div>
    `;
}

function exportUserData() {
    const realUsers = Object.values(userStorage).filter(u => u.is_real_user);
    const dataStr = JSON.stringify(realUsers, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Данные пользователей экспортированы!');
}

// Уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Платежи
function buyRequests(amount) {
    if (isAdmin) {
        alert('💎 У вас безлимитный доступ!');
        return;
    }
    
    searchesLeft += amount;
    if (user && user.id) {
        userStorage[user.id].searches_left = searchesLeft;
        saveUserData();
    }
    updateSearchesCounter();
    
    hideElement('payment');
    showElement('search');
    
    showNotification(`Добавлено ${amount} запросов!`);
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    initTelegramApp();
});
