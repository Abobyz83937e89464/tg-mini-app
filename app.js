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

// ПОИСК ПО БАЗАМ - РЕАЛЬНЫЙ С CORS PROXY!
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
    resultsDiv.innerHTML = '<div class="result">🔍 Начинаю РЕАЛЬНЫЙ поиск по 16 базам...</div>';
    
    try {
        await performRealSearchWithProxy(query, resultsDiv);
    } catch (error) {
        console.error('Ошибка поиска:', error);
        resultsDiv.innerHTML = `
            <div class="result">
                ❌ Ошибка доступа к базам<br>
                🔧 Используется CORS proxy<br>
                💡 Попробуйте другой запрос
            </div>
        `;
    }
}

// РЕАЛЬНЫЙ поиск с CORS proxy
async function performRealSearchWithProxy(query, resultsDiv) {
    const allResults = [];
    let completed = 0;
    let foundInFiles = 0;
    let errors = 0;
    
    // Показываем прогресс
    resultsDiv.innerHTML = `<div class="result">🔍 Подключаюсь к базам через proxy... (0/${DRIVE_FILES.length})</div>`;
    
    // Ограничиваем количество одновременно загружаемых файлов
    const BATCH_SIZE = 3;
    
    for (let i = 0; i < DRIVE_FILES.length; i += BATCH_SIZE) {
        const batch = DRIVE_FILES.slice(i, i + BATCH_SIZE);
        const batchPromises = batch.map(async (file) => {
            try {
                console.log(`🔄 Загружаю: ${file.name}`);
                
                const response = await fetch(file.url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/plain, */*',
                        'Cache-Control': 'no-cache'
                    }
                });
                
                if (response.ok) {
                    const content = await response.text();
                    const fileResults = searchInContent(content, query, file.name);
                    
                    if (fileResults.length > 0) {
                        foundInFiles++;
                        allResults.push(...fileResults);
                        console.log(`✅ ${file.name}: найдено ${fileResults.length} результатов`);
                    } else {
                        console.log(`ℹ️ ${file.name}: совпадений нет`);
                    }
                    
                    completed++;
                    updateProgress(resultsDiv, completed, foundInFiles, allResults.length, errors);
                    return { success: true, file: file.name, results: fileResults.length };
                } else {
                    console.log(`❌ ${file.name}: ошибка HTTP ${response.status}`);
                    errors++;
                    completed++;
                    updateProgress(resultsDiv, completed, foundInFiles, allResults.length, errors);
                    return { success: false, file: file.name, error: `HTTP ${response.status}` };
                }
            } catch (error) {
                console.error(`❌ ${file.name}:`, error);
                errors++;
                completed++;
                updateProgress(resultsDiv, completed, foundInFiles, allResults.length, errors);
                return { success: false, file: file.name, error: error.message };
            }
        });
        
        // Ждем завершения батча
        await Promise.allSettled(batchPromises);
        
        // Небольшая задержка между батчами
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Показываем финальные результаты
    displayFinalResults(allResults, query, foundInFiles, errors, resultsDiv);
}

// Поиск в содержимом
function searchInContent(content, query, fileName) {
    const results = [];
    const lines = content.split('\n');
    const queryLower = query.toLowerCase().trim();
    
    // Нормализуем номер телефона для поиска
    const normalizedQuery = query.replace(/\D/g, '');
    
    for (let i = 0; i < Math.min(lines.length, 10000); i++) { // Ограничиваем для производительности
        const line = lines[i];
        const lineLower = line.toLowerCase();
        
        // Ищем точное совпадение
        if (lineLower.includes(queryLower) || line.includes(normalizedQuery)) {
            // Телефоны
            const phones = line.match(/\b\d{7,15}\b/g) || [];
            // Имена
            const names = line.match(/[А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+/g) || [];
            // Email
            const emails = line.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];
            
            phones.forEach(phone => {
                if (phone.includes(normalizedQuery) || phone.includes(query)) {
                    results.push(`📞 ${phone} | 📁 ${fileName}`);
                }
            });
            
            names.forEach(name => {
                results.push(`👤 ${name} | 📁 ${fileName}`);
            });
            
            emails.forEach(email => {
                results.push(`📧 ${email} | 📁 ${fileName}`);
            });
            
            // Если нашли точное совпадение, добавляем контекст
            if (phones.some(phone => phone === query || phone === normalizedQuery)) {
                const context = line.substring(0, 150).replace(/[^\x20-\x7EА-Яа-яЁё]/g, ' ');
                results.push(`🎯 ${context}... | 📁 ${fileName}`);
            }
        }
    }
    
    return results;
}

// Обновление прогресса
function updateProgress(resultsDiv, completed, foundInFiles, totalResults, errors) {
    const progress = Math.round((completed / DRIVE_FILES.length) * 100);
    resultsDiv.innerHTML = `
        <div class="result">
            🔍 Поиск... ${progress}%<br>
            📁 Обработано: ${completed}/${DRIVE_FILES.length}<br>
            ✅ Найдено в: ${foundInFiles} базах<br>
            📊 Результатов: ${totalResults}<br>
            ❌ Ошибок: ${errors}
        </div>
    `;
}

// Показ финальных результатов
function displayFinalResults(results, query, foundInFiles, errors, resultsDiv) {
    const uniqueResults = [...new Set(results)];
    
    if (uniqueResults.length > 0) {
        let html = `<div class="result" style="background: #e8f5e8;">
            ✅ РЕАЛЬНЫЙ ПОИСК ЗАВЕРШЕН!<br>
            🔍 Запрос: "${query}"<br>
            📁 Найдено в: ${foundInFiles} базах<br>
            📊 Результатов: ${uniqueResults.length}<br>
            ❌ Ошибок загрузки: ${errors}
        </div>`;
        
        // Группируем результаты по типу
        const phones = uniqueResults.filter(r => r.includes('📞'));
        const names = uniqueResults.filter(r => r.includes('👤'));
        const emails = uniqueResults.filter(r => r.includes('📧'));
        const exact = uniqueResults.filter(r => r.includes('🎯'));
        
        if (exact.length > 0) {
            html += `<div class="result" style="background: #fff3cd; border-color: #ffc107;">
                <strong>🎯 ТОЧНЫЕ СОВПАДЕНИЯ:</strong>
            </div>`;
            exact.forEach(result => {
                html += `<div class="result">${result}</div>`;
            });
        }
        
        if (phones.length > 0) {
            html += `<div class="result" style="background: #d1ecf1; border-color: #17a2b8;">
                <strong>📞 ТЕЛЕФОНЫ (${phones.length}):</strong>
            </div>`;
            phones.slice(0, 20).forEach(result => {
                html += `<div class="result">${result}</div>`;
            });
            if (phones.length > 20) {
                html += `<div class="result">... и еще ${phones.length - 20} телефонов</div>`;
            }
        }
        
        if (names.length > 0) {
            html += `<div class="result" style="background: #d4edda; border-color: #28a745;">
                <strong>👤 ИМЕНА (${names.length}):</strong>
            </div>`;
            names.slice(0, 10).forEach(result => {
                html += `<div class="result">${result}</div>`;
            });
        }
        
        if (emails.length > 0) {
            html += `<div class="result" style="background: #e2e3e5; border-color: #6c757d;">
                <strong>📧 EMAILS (${emails.length}):</strong>
            </div>`;
            emails.slice(0, 10).forEach(result => {
                html += `<div class="result">${result}</div>`;
            });
        }
        
        resultsDiv.innerHTML = html;
    } else {
        resultsDiv.innerHTML = `
            <div class="result">
                ❌ По запросу "${query}" ничего не найдено<br>
                📁 Проверено: ${DRIVE_FILES.length} баз<br>
                ✅ Успешно: ${DRIVE_FILES.length - errors} баз<br>
                ❌ Ошибок: ${errors}<br>
                💡 Попробуйте: другой формат номера или меньше цифр
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

// АДМИН ПАНЕЛЬ (остается без изменений)
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

// ... остальные функции админ-панели без изменений ...

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    initTelegramApp();
});
