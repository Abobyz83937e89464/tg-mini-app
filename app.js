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
let user = tg.initDataUnsafe.user;
let searchesLeft = 3;
let isAdmin = false;
let userStorage = JSON.parse(localStorage.getItem('userStorage')) || {};

// Инициализация Telegram Mini App
function initTelegramApp() {
    if (typeof tg !== 'undefined') {
        tg.expand();
        tg.ready();
        checkAdminRights();
    } else {
        console.log('Telegram WebApp не обнаружен, запуск в браузере');
        // Автозаполнение для тестирования
        document.getElementById('password').value = USER_PASSWORD;
    }
}

// Проверка админских прав
function checkAdminRights() {
    if (user && user.id === ADMIN_ID) {
        isAdmin = true;
        searchesLeft = 9999;
        console.log('👑 Админский доступ активирован');
    }
    return isAdmin;
}

// Сохранение данных
function saveUserData() {
    localStorage.setItem('userStorage', JSON.stringify(userStorage));
}

// Главное меню
function showMainMenu() {
    hideAllSections();
    
    if (isAdmin) {
        document.getElementById('adminPanel').classList.remove('hidden');
        loadAdminStats();
    } else {
        document.getElementById('search').classList.remove('hidden');
        updateSearchesCounter();
    }
}

function hideAllSections() {
    const sections = ['auth', 'search', 'payment', 'adminPanel'];
    sections.forEach(id => document.getElementById(id).classList.add('hidden'));
}

// Аутентификация
function checkPassword() {
    let password = document.getElementById('password').value;
    if (password === USER_PASSWORD) {
        // Сохраняем пользователя
        if (user && user.id) {
            if (!userStorage[user.id]) {
                userStorage[user.id] = {
                    searches_left: isAdmin ? 9999 : 3,
                    unlimited: isAdmin,
                    last_active: Date.now(),
                    username: user.username || 'unknown'
                };
            }
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

// ПОИСК ПО БАЗАМ ДАННЫХ
async function searchData() {
    let query = document.getElementById('query').value.trim();
    
    if (query.length < 2) {
        alert('❌ Минимум 2 символа');
        return;
    }
    
    // Проверка лимитов
    if (!isAdmin && searchesLeft <= 0) {
        document.getElementById('search').classList.add('hidden');
        document.getElementById('payment').classList.remove('hidden');
        return;
    }
    
    // Списание запроса
    if (!isAdmin) {
        searchesLeft--;
        updateSearchesCounter();
    }
    
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="result">🔍 Сканирую 16 баз данных... (1-2 минуты)</div>';
    
    try {
        const allResults = [];
        let completed = 0;
        
        // Параллельный поиск по всем базам
        for (let file of DRIVE_FILES) {
            try {
                const response = await fetch(file.url);
                if (response.ok) {
                    const content = await response.text();
                    const fileResults = searchInContent(content, query, file.name);
                    allResults.push(...fileResults);
                }
            } catch (error) {
                console.error(`Ошибка в базе ${file.name}:`, error);
            }
            
            completed++;
            resultsDiv.innerHTML = `<div class="result">🔍 Сканирую... (${completed}/${DRIVE_FILES.length} баз)</div>`;
        }
        
        // Обработка результатов
        displaySearchResults(allResults, query);
        
    } catch (error) {
        console.error('Ошибка поиска:', error);
        resultsDiv.innerHTML = '<div class="result">❌ Ошибка при поиске</div>';
    }
}

// Поиск в содержимом файла
function searchInContent(content, query, fileName) {
    const results = [];
    const lines = content.split('\n');
    
    for (let line of lines) {
        if (line.toLowerCase().includes(query.toLowerCase())) {
            // Телефоны
            const phones = line.match(/\d{7,15}/g) || [];
            // Имена (кириллица)
            const names = line.match(/[А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+/g) || [];
            // Email
            const emails = line.match(/\S+@\S+\.\S+/g) || [];
            
            phones.forEach(phone => results.push(`📞 ${phone}`));
            names.forEach(name => results.push(`👤 ${name}`));
            emails.forEach(email => results.push(`📧 ${email}`));
        }
    }
    
    return results;
}

// Отображение результатов поиска
function displaySearchResults(results, query) {
    const resultsDiv = document.getElementById('results');
    const uniqueResults = [...new Set(results)];
    
    if (uniqueResults.length > 0) {
        let html = `<div class="result" style="background: #e8f5e8;">
            ✅ НАЙДЕНО: "${query}"<br>
            📊 Результатов: ${uniqueResults.length}
        </div>`;
        
        uniqueResults.slice(0, 30).forEach(result => {
            html += `<div class="result">${result}</div>`;
        });
        
        if (uniqueResults.length > 30) {
            html += `<div class="result">... и еще ${uniqueResults.length - 30} результатов</div>`;
        }
        
        resultsDiv.innerHTML = html;
    } else {
        resultsDiv.innerHTML = `<div class="result">❌ По запросу "${query}" ничего не найдено</div>`;
    }
    
    // Проверка лимитов после поиска
    if (!isAdmin && searchesLeft <= 0) {
        setTimeout(() => {
            document.getElementById('search').classList.add('hidden');
            document.getElementById('payment').classList.remove('hidden');
        }, 1000);
    }
}

// АДМИН ПАНЕЛЬ
function loadAdminStats() {
    const totalUsers = Object.keys(userStorage).length;
    const activeUsers = Object.values(userStorage).filter(u => u.searches_left > 0).length;
    
    document.getElementById('adminStats').innerHTML = `
        <div class="result">
            <strong>📊 СТАТИСТИКА СИСТЕМЫ</strong><br>
            👥 Всего пользователей: <strong>${totalUsers}</strong><br>
            🔥 Активных: <strong>${activeUsers}</strong><br>
            💎 Ваш статус: <strong style="color: #00aa00;">БЕЗЛИМИТ ∞</strong>
        </div>
    `;
}

function showAdminSection(section) {
    // Скрываем все секции
    const sections = ['Stats', 'Users', 'AddSearches', 'Broadcast', 'Sniffer'];
    sections.forEach(sec => {
        const element = document.getElementById(`admin${sec}`);
        if (element) element.classList.add('hidden');
    });
    
    // Показываем выбранную
    const targetElement = document.getElementById(`admin${section}`);
    if (targetElement) targetElement.classList.remove('hidden');
    
    // Загружаем данные
    if (section === 'Users') loadUserList();
    if (section === 'AddSearches') initAddSearches();
    if (section === 'Broadcast') initBroadcast();
    if (section === 'Sniffer') initSniffer();
}

function loadUserList() {
    let html = '<div class="result"><strong>👥 ПОСЛЕДНИЕ ПОЛЬЗОВАТЕЛИ:</strong><br>';
    
    if (Object.keys(userStorage).length === 0) {
        html += '📭 Пользователей пока нет';
    } else {
        const users = Object.entries(userStorage)
            .sort((a, b) => b[1].last_active - a[1].last_active)
            .slice(0, 8);
        
        users.forEach(([userId, userData]) => {
            const searches = userData.unlimited ? '∞' : userData.searches_left;
            const status = userData.unlimited ? '🟢 БЕЗЛИМИТ' : (userData.searches_left > 0 ? '🟡 АКТИВЕН' : '🔴 НЕТ ЗАПРОСОВ');
            html += `
                👤 ID: <strong>${userId}</strong><br>
                💎 Запросов: <strong>${searches}</strong><br>
                📱 ${status}<br>
                ━━━━━━━━━━<br>
            `;
        });
    }
    
    html += '</div>';
    document.getElementById('adminUsers').innerHTML = html;
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
    
    if (!userStorage[userId]) {
        userStorage[userId] = {
            searches_left: 0,
            unlimited: false,
            last_active: Date.now(),
            username: 'added_by_admin'
        };
    }
    
    if (type === 'unlimited') {
        userStorage[userId].unlimited = true;
        userStorage[userId].searches_left = 9999;
        resultDiv.innerHTML = `<div style="color: green;">✅ Пользователю ${userId} выдан <strong>БЕЗЛИМИТ</strong></div>`;
    } else {
        const addAmount = parseInt(type);
        userStorage[userId].searches_left += addAmount;
        userStorage[userId].unlimited = false;
        resultDiv.innerHTML = `<div style="color: green;">✅ Пользователю ${userId} добавлено <strong>${addAmount}</strong> запросов</div>`;
    }
    
    userStorage[userId].last_active = Date.now();
    saveUserData();
    
    setTimeout(() => loadUserList(), 500);
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
    
    const users = Object.keys(userStorage);
    if (users.length === 0) {
        resultDiv.innerHTML = '<div style="color: orange;">⚠️ Нет пользователей для рассылки</div>';
        return;
    }
    
    resultDiv.innerHTML = `<div style="color: blue;">🔄 Рассылка начата... 0/${users.length}</div>`;
    
    // Эмуляция рассылки
    let sent = 0;
    const interval = setInterval(() => {
        sent++;
        resultDiv.innerHTML = `<div style="color: blue;">🔄 Рассылка... ${sent}/${users.length}</div>`;
        
        if (sent >= users.length) {
            clearInterval(interval);
            resultDiv.innerHTML = `<div style="color: green;">✅ Рассылка завершена! Отправлено: ${sent}</div>`;
        }
    }, 100);
}

function initSniffer() {
    document.getElementById('adminSniffer').innerHTML = `
        <div class="result">
            <strong>🎯 СНИФЕР ТРАФИКА</strong><br><br>
            
            <div style="background: #1a1a1a; color: #00ff00; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px;">
                🚀 Модуль снифера активирован<br>
                📡 Мониторинг сетевой активности...<br>
                🌐 Анализ DNS запросов...<br>
                🔒 Перехват HTTP/HTTPS трафика...<br>
                💾 Логирование пакетов...<br>
                ⚡ Готов к работе
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
    output.innerHTML = '<div class="result">🎯 Снифер запущен...</div>';
    
    // Эмуляция работы снифера
    const messages = [
        '📡 Перехвачен DNS запрос: google.com',
        '🌐 HTTP запрос к: api.telegram.org',
        '🔒 HTTPS соединение: bank.ru',
        '📊 Пакет данных: 512 bytes',
        '🖥️ User-Agent: Chrome/120.0.0.0',
        '📍 IP адрес: 192.168.1.1'
    ];
    
    let index = 0;
    const interval = setInterval(() => {
        if (index < messages.length) {
            output.innerHTML += `<div class="result" style="font-size: 11px;">${messages[index]}</div>`;
            index++;
        } else {
            clearInterval(interval);
        }
    }, 1500);
    
    window.snifferInterval = interval;
}

function stopSniffer() {
    if (window.snifferInterval) {
        clearInterval(window.snifferInterval);
    }
    document.getElementById('snifferOutput').innerHTML = '<div class="result">⏹️ Снифер остановлен</div>';
}

// Платежи
function buyRequests(amount) {
    if (isAdmin) {
        alert('💎 У вас безлимитный доступ!');
        return;
    }
    
    // Эмуляция платежа
    searchesLeft += amount;
    updateSearchesCounter();
    
    document.getElementById('payment').classList.add('hidden');
    document.getElementById('search').classList.remove('hidden');
    
    alert(`✅ Оплата прошла успешно! Добавлено ${amount} запросов`);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initTelegramApp();
    
    // Автозаполнение пароля для админа при тестировании
    if (isAdmin) {
        document.getElementById('password').value = USER_PASSWORD;
    }
});
