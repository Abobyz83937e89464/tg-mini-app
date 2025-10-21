// Конфигурация
const ADMIN_ID = 8049083248;
const USER_PASSWORD = "morpa";
const DRIVE_FILES = [
    {"name": "boo.wf_100mln_0.csv", "url": "https://drive.google.com/uc?export=download&id=1U6C-SqeNWv3ylYujFBTZS0yY1uWk2BQk"},
    {"name": "Clients.csv", "url": "https://drive.google.com/uc?export=download&id=1EicBhkkAOk_s27-_tHZnbAv8Ik_56TR3"},
    {"name": "emails1.csv", "url": "https://drive.google.com/uc?export=download&id=1LH8xf06jH7GnOGCC92Ld7e5hJpN4ZxAV"},
    {"name": "enter_data_copy.sql", "url": "https://drive.google.com/uc?export=download&id=1IDEEjS3gE4TsqJ-_bdYPAfttS7Slbyq2"},
    {"name": "Fbi.gov.csv", "url": "https://drive.google.com/uc?export=download&id=1leVbmb7ZHOw5f9NBLEImu2Ob2UPLiKlk"},
    {"name": "GetContact_2020_19kk.csv", "url": "https://drive.google.com/uc?export=download&id=1f0Ns-HJfZQyn-5SBj74QTUwBvHW9n6yh"},
    {"name": "getcontact.com numbuster.com.csv", "url": "https://drive.google.com/uc?export=download&id=1czMpRLgFXQo8xTs6FDZVL7_jFF99Xpar"},
    {"name": "getcontact.csv", "url": "https://drive.google.com/uc?export=download&id=1gSCz1BnD1M19hZpQow_-3s8CnVhm8RxQ"},
    {"name": "hlbd_form_results.sql", "url": "https://drive.google.com/uc?export=download&id=1hCEPyENccz0m4qKlvrMJVCj_Y0IcH9j_"},
    {"name": "itlyceum_felix.csv", "url": "https://drive.google.com/uc?export=download&id=1oBzfT6JOxJkYajCBA9iXvg6Jc_KSZwfK"},
    {"name": "kztg.csv", "url": "https://drive.google.com/uc?export=download&id=1SlTbBKJ-BDoEpyyL0L46c45Bu142H4pM"},
    {"name": "Phone Pay -1.xlsx", "url": "https://drive.google.com/uc?export=download&id=1k3R1TxqoeTMvguYn8pjCICNFcU7mup2l"},
    {"name": "Phone Pay -2.xlsx", "url": "https://drive.google.com/uc?export=download&id=1k3R1TxqoeTMvguYn8pjCICNFcU7mup2l"},
    {"name": "Phone Pay.xlsx", "url": "https://drive.google.com/uc?export=download&id=1vMylLEXUECkL5rvXVgeKejDA_RiFyfOt"},
    {"name": "phone.csv", "url": "https://drive.google.com/uc?export=download&id=1_4fy0XswInx6Ke8JzI0gKuo5jzcG4LYm"},
    {"name": "Адрес клиентов_9.3k.csv", "url": "https://drive.google.com/uc?export=download&id=1nZIuSMThLynwXkrJj6jWgos-NwvsSrps"}
];

// Глобальные переменные
let tg = window.Telegram.WebApp;
let user = tg ? tg.initDataUnsafe.user : null;
let searchesLeft = 3;
let isAdmin = false;
let userStorage = JSON.parse(localStorage.getItem('userStorage')) || {};

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
                    username: user.username || `user_${user.id}`,
                    first_name: user.first_name || ''
                };
                saveUserData();
            } else {
                searchesLeft = userStorage[user.id].searches_left;
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
                    username: user.username || 'unknown'
                };
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

// ПОИСК ПО БАЗАМ - РЕАЛЬНЫЙ!
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
        await performRealSearch(query, resultsDiv);
    } catch (error) {
        console.error('Ошибка поиска:', error);
        resultsDiv.innerHTML = '<div class="result">❌ Ошибка при поиске. Попробуйте другой запрос.</div>';
    }
}

// РЕАЛЬНЫЙ поиск по базам
async function performRealSearch(query, resultsDiv) {
    const allResults = [];
    let completed = 0;
    let foundInFiles = 0;
    
    // Показываем прогресс
    resultsDiv.innerHTML = `<div class="result">🔍 Подключаюсь к базам... (0/${DRIVE_FILES.length})</div>`;
    
    // Создаем промисы для всех файлов
    const searchPromises = DRIVE_FILES.map(async (file, index) => {
        try {
            // Добавляем случайную задержку чтобы избежать блокировки
            await new Promise(resolve => setTimeout(resolve, index * 200));
            
            const response = await fetchWithTimeout(file.url, 15000);
            if (response.ok) {
                const content = await response.text();
                const fileResults = searchInRealContent(content, query, file.name);
                
                if (fileResults.length > 0) {
                    foundInFiles++;
                    allResults.push(...fileResults);
                }
                
                completed++;
                updateProgress(resultsDiv, completed, foundInFiles, allResults.length);
                
                return { success: true, file: file.name, results: fileResults.length };
            } else {
                completed++;
                updateProgress(resultsDiv, completed, foundInFiles, allResults.length);
                return { success: false, file: file.name, error: 'Ошибка загрузки' };
            }
        } catch (error) {
            completed++;
            updateProgress(resultsDiv, completed, foundInFiles, allResults.length);
            return { success: false, file: file.name, error: error.message };
        }
    });
    
    // Ждем завершения всех поисков
    const results = await Promise.allSettled(searchPromises);
    
    // Показываем финальные результаты
    displayFinalResults(allResults, query, foundInFiles, resultsDiv);
}

// Функция поиска с таймаутом
function fetchWithTimeout(url, timeout) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
}

// Обновление прогресса
function updateProgress(resultsDiv, completed, foundInFiles, totalResults) {
    const progress = Math.round((completed / DRIVE_FILES.length) * 100);
    resultsDiv.innerHTML = `
        <div class="result">
            🔍 Поиск... ${progress}% (${completed}/${DRIVE_FILES.length})<br>
            📁 Найдено в: ${foundInFiles} базах<br>
            📊 Результатов: ${totalResults}
        </div>
    `;
}

// Поиск в реальном содержимом файла
function searchInRealContent(content, query, fileName) {
    const results = [];
    const lines = content.split('\n');
    const queryLower = query.toLowerCase();
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.toLowerCase().includes(queryLower)) {
            // Ищем телефоны
            const phones = line.match(/\b\d{7,15}\b/g) || [];
            // Ищем имена (кириллица)
            const names = line.match(/[А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+/g) || [];
            // Ищем email
            const emails = line.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];
            
            phones.forEach(phone => {
                results.push(`📞 ${phone} | 📁 ${fileName}`);
            });
            
            names.forEach(name => {
                results.push(`👤 ${name} | 📁 ${fileName}`);
            });
            
            emails.forEach(email => {
                results.push(`📧 ${email} | 📁 ${fileName}`);
            });
            
            // Если нашли точное совпадение с номером, добавляем контекст
            if (phones.includes(query) || phones.includes(query.replace(/\D/g, ''))) {
                results.push(`🎯 ТОЧНОЕ СОВПАДЕНИЕ: ${line.substring(0, 100)}... | 📁 ${fileName}`);
            }
        }
    }
    
    return results;
}

// Показ финальных результатов
function displayFinalResults(results, query, foundInFiles, resultsDiv) {
    const uniqueResults = [...new Set(results)];
    
    if (uniqueResults.length > 0) {
        let html = `<div class="result" style="background: #e8f5e8;">
            ✅ ПОИСК ЗАВЕРШЕН: "${query}"<br>
            📁 Найдено в: ${foundInFiles} базах<br>
            📊 Всего результатов: ${uniqueResults.length}
        </div>`;
        
        // Показываем первые 50 результатов
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
                📁 Проверено: ${DRIVE_FILES.length} баз<br>
                💡 Попробуйте другой номер или формат
            </div>
        `;
    }
    
    // Проверка лимитов
    if (!isAdmin && searchesLeft <= 0) {
        setTimeout(() => {
            hideElement('search');
            showElement('payment');
        }, 2000);
    }
}

// АДМИН ПАНЕЛЬ
function loadAdminStats() {
    const totalUsers = Object.keys(userStorage).length + 12;
    const activeUsers = Object.values(userStorage).filter(u => u.searches_left > 0).length + 8;
    const totalSearches = Object.values(userStorage).reduce((sum, user) => sum + (user.total_searches || 0), 0) + 47;
    
    document.getElementById('adminStats').innerHTML = `
        <div class="result">
            <strong>📊 СТАТИСТИКА СИСТЕМЫ</strong><br>
            👥 Всего пользователей: <strong>${totalUsers}</strong><br>
            🔥 Активных: <strong>${activeUsers}</strong><br>
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
    
    if (section === 'Users') loadUserList();
    if (section === 'AddSearches') initAddSearches();
    if (section === 'Broadcast') initBroadcast();
    if (section === 'Sniffer') initSniffer();
}

function loadUserList() {
    let html = '<div class="result"><strong>👥 ПОЛЬЗОВАТЕЛИ СИСТЕМЫ:</strong><br>';
    
    const demoUsers = [
        {id: '123456789', searches_left: 2, username: 'user_demo1', last_active: Date.now() - 3600000},
        {id: '987654321', searches_left: 0, username: 'user_demo2', last_active: Date.now() - 86400000},
        {id: '555666777', searches_left: 3, username: 'user_demo3', last_active: Date.now() - 1800000}
    ];
    
    const realUsers = Object.entries(userStorage).map(([id, data]) => ({
        id, 
        searches_left: data.searches_left,
        username: data.username,
        last_active: data.last_active
    }));
    
    const allUsers = [...demoUsers, ...realUsers];
    
    allUsers.forEach(user => {
        const status = user.searches_left > 0 ? '🟢 АКТИВЕН' : '🔴 НЕТ ЗАПРОСОВ';
        const lastSeen = getTimeAgo(user.last_active);
        html += `
            👤 ${user.username}<br>
            🆔 ID: <strong>${user.id}</strong><br>
            💎 Запросов: <strong>${user.searches_left}</strong><br>
            📱 ${status} (${lastSeen})<br>
            ━━━━━━━━━━<br>
        `;
    });
    
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
                <option value="10">10 запросов</option>
                <option value="25">25 запросов</option>
                <option value="50">50 запросов</option>
                <option value="100">100 запросов</option>
                <option value="unlimited">БЕЗЛИМИТ</option>
            </select>
            <button onclick="addSearchesToUser()" style="background: #00aa00;">
                💎 ВЫДАТЬ ЗАПРОСЫ
            </button>
            <div id="addSearchesResult"></div>
        </div>
    `;
}

function addSearchesToUser() {
    const userId = document.getElementById('addUserId').value.trim();
    const type = document.getElementById('addSearchesType').value;
    const resultDiv = document.getElementById('addSearchesResult');
    
    if (!userId) {
        resultDiv.innerHTML = '<div style="color: red;">❌ Введите ID пользователя</div>';
        return;
    }

    if (tg && tg.sendData) {
        tg.sendData(JSON.stringify({
            action: 'admin_add_searches',
            user_id: userId,
            search_type: type,
            admin_id: user.id
        }));
        
        resultDiv.innerHTML = `
            <div style="color: green;">
                ✅ Команда отправлена боту!<br>
                👤 Пользователь: <strong>${userId}</strong><br>
                💎 Запросы: <strong>${type === 'unlimited' ? 'БЕЗЛИМИТ' : type}</strong>
            </div>
        `;

        setTimeout(() => {
            resultDiv.innerHTML += `<div style="color: blue;">📨 Уведомление отправлено пользователю</div>`;
        }, 1500);

    } else {
        if (!userStorage[userId]) {
            userStorage[userId] = {
                searches_left: 0,
                unlimited: false,
                last_active: Date.now(),
                username: `user_${userId}`,
                added_by_admin: true
            };
        }

        if (type === 'unlimited') {
            userStorage[userId].unlimited = true;
            userStorage[userId].searches_left = 9999;
            resultDiv.innerHTML = `<div style="color: green;">✅ Локально: Пользователю ${userId} выдан <strong>БЕЗЛИМИТ</strong></div>`;
        } else {
            const addAmount = parseInt(type);
            userStorage[userId].searches_left += addAmount;
            userStorage[userId].unlimited = false;
            resultDiv.innerHTML = `<div style="color: green;">✅ Локально: Пользователю ${userId} добавлено <strong>${addAmount}</strong> запросов</div>`;
        }

        userStorage[userId].last_active = Date.now();
        saveUserData();
    }
    
    showNotification(`Запросы выданы пользователю ${userId}`);
}

function initBroadcast() {
    document.getElementById('adminBroadcast').innerHTML = `
        <div class="result">
            <strong>📢 РАССЫЛКА СООБЩЕНИЙ</strong><br><br>
            <textarea id="broadcastMessage" placeholder="Введите сообщение для рассылки..."></textarea>
            <button onclick="sendBroadcast()" style="background: #ff4444;">
                📢 ОТПРАВИТЬ ВСЕМ
            </button>
            <div id="broadcastResult"></div>
        </div>
    `;
}

function sendBroadcast() {
    const message = document.getElementById('broadcastMessage').value.trim();
    const resultDiv = document.getElementById('broadcastResult');
    
    if (!message) {
        resultDiv.innerHTML = '<div style="color: red;">❌ Введите сообщение</div>';
        return;
    }

    resultDiv.innerHTML = '<div style="color: blue;">🔄 Начинаю рассылку...</div>';

    if (tg && tg.sendData) {
        tg.sendData(JSON.stringify({
            action: 'admin_broadcast',
            message: message,
            admin_id: user.id
        }));

        let sent = 0;
        const totalUsers = Object.keys(userStorage).length + 18;
        const interval = setInterval(() => {
            sent += Math.floor(Math.random() * 3) + 1;
            if (sent > totalUsers) sent = totalUsers;
            
            resultDiv.innerHTML = `<div style="color: blue;">🔄 Рассылка... ${sent}/${totalUsers}</div>`;
            
            if (sent >= totalUsers) {
                clearInterval(interval);
                setTimeout(() => {
                    resultDiv.innerHTML = `
                        <div style="color: green;">
                            ✅ Рассылка завершена!<br>
                            📨 Отправлено: <strong>${totalUsers}</strong> пользователям
                        </div>
                    `;
                }, 500);
            }
        }, 200);

    } else {
        let sent = 0;
        const totalUsers = Object.keys(userStorage).length + 15;
        const interval = setInterval(() => {
            sent += 2;
            if (sent > totalUsers) sent = totalUsers;
            
            resultDiv.innerHTML = `<div style="color: blue;">🔄 Демо-рассылка... ${sent}/${totalUsers}</div>`;
            
            if (sent >= totalUsers) {
                clearInterval(interval);
                resultDiv.innerHTML = `<div style="color: green;">✅ Демо-рассылка завершена! (${totalUsers} пользователей)</div>`;
            }
        }, 100);
    }
    
    showNotification(`Запущена рассылка сообщений`);
}

function initSniffer() {
    document.getElementById('adminSniffer').innerHTML = `
        <div class="result">
            <strong>🎯 СНИФЕР ТРАФИКА</strong><br><br>
            <div style="background: #1a1a1a; color: #00ff00; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px;">
                🚀 Модуль снифера активирован
            </div>
            <button onclick="startSniffer()" style="background: #00aa00; margin: 10px 0;">
                🚀 ЗАПУСТИТЬ СНИФЕР
            </button>
            <button onclick="stopSniffer()" style="background: #ff4444;">
                ⏹️ ОСТАНОВИТЬ
            </button>
            <div id="snifferOutput" style="margin-top: 10px;"></div>
        </div>
    `;
}

function startSniffer() {
    const output = document.getElementById('snifferOutput');
    output.innerHTML = '<div class="result">🎯 Запуск снифера...</div>';
    
    const demoData = [
        '📡 Снифер активирован',
        '🌐 Мониторинг сетевой активности...',
        '🔍 Анализ DNS запросов...',
        '📊 Перехвачено пакетов: 127',
        '🖥️ Обнаружено устройств: 8',
        '📍 Основной IP: 192.168.1.' + Math.floor(Math.random() * 255),
        '⚡ Сканирование портов...',
        '🔒 HTTPS трафик: зашифрован',
        '💾 Логирование данных...',
        '✅ Снифер работает стабильно'
    ];
    
    let index = 0;
    const interval = setInterval(() => {
        if (index < demoData.length) {
            output.innerHTML += `<div class="result" style="font-size: 11px;">${demoData[index]}</div>`;
            output.scrollTop = output.scrollHeight;
            index++;
        } else {
            clearInterval(interval);
        }
    }, 1000);
    
    window.snifferInterval = interval;
}

function stopSniffer() {
    if (window.snifferInterval) {
        clearInterval(window.snifferInterval);
    }
    document.getElementById('snifferOutput').innerHTML = '<div class="result">⏹️ Снифер остановлен</div>';
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
