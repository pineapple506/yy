// Проверяем авторизацию и показываем контент
function initializePage() {
    const login = localStorage.getItem('login');
    if (!login) {
        // Перенаправляем на страницу авторизации, если пользователь не авторизован
        showSection('auth-form')
    } else {
        // Показываем защищённый контент
        document.getElementById('protected-content').style.display = 'block';
        showSection('description')

        // Добавляем информацию о пользователе в заголовок
        document.getElementById('user-info').innerHTML = `
            <p>Добро пожаловать, ${login}</p>
            <button id="logout-btn">Выйти</button>
        `;

        // Обработчик выхода
        document.getElementById('logout-btn').addEventListener('click', function () {
            localStorage.clear();
            showSection('auth-form');
            document.getElementById('protected-content').style.display = 'none';
        });
    }
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    const navLinks = document.querySelectorAll('header nav ul li a');
    navLinks.forEach(link => link.classList.remove('active'));
    if (sectionId !== 'auth-form') {
        const activeLink = Array.from(navLinks).find(link => link.getAttribute('onclick') === `showSection('${sectionId}')`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

function checkAnswer(questionId, userAnswer, correctAnswer) {
    const resultDiv = document.getElementById(`${questionId}-result`);
    const feedbackDiv = document.getElementById(`${questionId}-feedback`);

    if (userAnswer && userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        resultDiv.textContent = 'Верно!';
        resultDiv.classList.add('correct');
        feedbackDiv.textContent = 'Правильный ответ.';
        feedbackDiv.classList.add('correct');
        return true;
    } else {
        resultDiv.textContent = `Неверно, правильный ответ: ${correctAnswer}`;
        resultDiv.classList.add('incorrect');
        return false;
    }
}
// Проверка авторизации и обновление состояния
document.getElementById('authForm')?.addEventListener('submit', function (event) {
    event.preventDefault();
    if (validateForm()) {

        const login = document.getElementById('login').value;
        const birthDate = document.getElementById('birthDate').value;
        const gender = document.querySelector('input[name="gender"]:checked');

        localStorage.setItem('login', login);
        localStorage.setItem('birthDate', birthDate);
        localStorage.setItem('gender', gender.value);

        initializePage();
    }

});

function validateForm() {
    const login = document.getElementById('login').value;
    const birthDate = document.getElementById('birthDate').value;
    let gender = document.querySelector('input[name="gender"]:checked');

    let isValid = true;
    let loginError = document.getElementById('login-error');
    let birthDateError = document.getElementById('birthDate-error');
    let genderError = document.getElementById('gender-error');

    loginError.textContent = '';
    birthDateError.textContent = '';
    genderError.textContent = '';

    // Login validation (4-10 symbols, alphanumeric)
    if (!login || !/^[а-яА-ЯёЁ0-9]{4,10}$/.test(login)) {
        loginError.textContent = 'Логин должен содержать от 4 до 10 символов и только русские буквы и цифры!';
        isValid = false;
    }

    // Birth date validation (not in the future, not before 1950)
    if (!birthDate || isInvalidDate(birthDate)) {
        birthDateError.textContent = 'Неверная дата рождения.';
        isValid = false;
    }


    // Gender validation (make sure a gender is selected)
    if (!gender) {
        genderError.textContent = 'Пожалуйста, выберите пол!';
        isValid = false;
    }

    return isValid;
}

function isInvalidDate(birthDate) {
    const birthDateObj = new Date(birthDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date to midnight
    const minDate = new Date("1950-01-01");

    return isNaN(birthDateObj.getTime()) || birthDateObj >= currentDate || birthDateObj < minDate;
}
// Проверка авторизации при загрузке страницы
window.onload = function () {
    initializePage();
    const login = localStorage.getItem('login');
    if (login) {
        // Если пользователь авторизован, показываем его логин и кнопку "Выйти"
        document.getElementById('user-info').innerHTML = `
            <p>Добро пожаловать, ${login}</p>
            <button id="logout-btn">Выйти</button>
        `;

        // Обработчик выхода
        document.getElementById('logout-btn').addEventListener('click', function () {
            localStorage.clear();
            showSection('auth-form');
            document.getElementById('protected-content').style.display = 'none';
        });
    } else {
        // Если пользователь не авторизован, просто показываем ссылку на авторизацию
        document.getElementById('user-info').innerHTML = `
            <a href="#" onclick="showSection('auth-form')">Войти</a>
        `;
    }
    loadUserData();

    const testForm = document.getElementById('test-form');
    if (testForm) {
        testForm.addEventListener('submit', function (event) {
            event.preventDefault();

            let score = 0;
            let correctCount = 0;
            let incorrectCount = 0;
            const correctAnswers = {
                q1: '2013',
                q2: 'botfather',
                q3: 'End-to-End',
                q4: 'C++',
                q5: 'Павел Дуров',
                q6: '800'
            };
            const q1Answer = document.getElementById('q1').value.trim();
            const q2Answer = document.getElementById('q2').value.trim();
            const q3Answer = document.querySelector('input[name="q3"]:checked');
            const q4Answer = document.getElementById('q4').value;
            const q5Answer = document.getElementById('q5').value;
            const q6Answer = document.getElementById('q6').value.trim();

            if (!q1Answer && !q2Answer && !q3Answer && !q4Answer && !q5Answer && !q6Answer) {
                const questions = document.querySelectorAll('#test-form .question');
                questions.forEach(question => {
                    const resultDiv = question.querySelector('[id$="-result"]');
                    const feedbackDiv = question.querySelector('[id$="-feedback"]');
                    resultDiv.textContent = `Неверно, правильный ответ: ${correctAnswers[question.querySelector('input[type="text"]')?.id || question.querySelector('select')?.id || question.querySelector('input[type="radio"]')?.name]}`;
                    resultDiv.classList.add('incorrect');
                    incorrectCount++;
                });
            } else {
                if (checkAnswer('q1', q1Answer, correctAnswers.q1)) {
                    score++;
                    correctCount++;
                } else {
                    incorrectCount++;
                }
                if (checkAnswer('q2', q2Answer, correctAnswers.q2)) {
                    score++;
                    correctCount++;
                } else {
                    incorrectCount++;
                }
                if (checkAnswer('q3', q3Answer && q3Answer.value, correctAnswers.q3)) {
                    score++;
                    correctCount++;
                } else {
                    incorrectCount++;
                }
                if (checkAnswer('q4', q4Answer, correctAnswers.q4)) {
                    score++;
                    correctCount++;
                } else {
                    incorrectCount++;
                }
                if (checkAnswer('q5', q5Answer, correctAnswers.q5)) {
                    score++;
                    correctCount++;
                } else {
                    incorrectCount++;
                }
                if (checkAnswer('q6', q6Answer, correctAnswers.q6)) {
                    score++;
                    correctCount++;
                } else {
                    incorrectCount++;
                }
            }
            document.getElementById('result').textContent = `Ваш результат: ${score} из 6`;
            document.getElementById('restart-test').style.display = 'block';
            localStorage.setItem('testScore', score);
            localStorage.setItem('correctCount', correctCount);
            localStorage.setItem('incorrectCount', incorrectCount);
            disableTestInputs();
            loadUserData();
        });

        document.getElementById('restart-test')?.addEventListener('click', function () {
            testForm.reset();
            document.getElementById('result').textContent = '';
            document.getElementById('restart-test').style.display = 'none';

            const feedbackDivs = document.querySelectorAll('[id$="-feedback"]');
            feedbackDivs.forEach(div => {
                div.textContent = '';
                div.classList.remove('incorrect', 'correct');
            });

            const resultDivs = document.querySelectorAll('[id$="-result"]');
            resultDivs.forEach(div => {
                div.textContent = '';
                div.classList.remove('incorrect', 'correct');
            });
            enableTestInputs();
            loadUserData();
        });
    }
};
function disableTestInputs() {
    const inputs = document.querySelectorAll('#test-form input, #test-form select, #test-form button');
    inputs.forEach(input => {
        input.disabled = true;
    });
}
function enableTestInputs() {
    const inputs = document.querySelectorAll('#test-form input, #test-form select');
    inputs.forEach(input => {
        input.disabled = false;
    });
    const submitBtn = document.querySelector('#test-form button[type="submit"]');
    if (submitBtn) submitBtn.disabled = false;
}
// Галерея слайдер
let currentSlide = 0;
const slides = document.querySelectorAll('#slider .slide');
const slider = document.getElementById('slider');

function showSlide(index) {
    slider.style.transform = `translateX(-${index * 100}%)`;
    document.getElementById('slide-number').textContent = `${index + 1} из ${slides.length}`;
    currentSlide = index;
}

function nextSlide() {
    if (currentSlide < slides.length - 1) {
        showSlide(currentSlide + 1);
    }
}
function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}
// Инициализация слайдера
if (document.getElementById('slider')) {
    showSlide(currentSlide);
}

function searchGlossary() {
    const searchInput = document.getElementById('search');
    const searchTerm = searchInput.value.toLowerCase();
    const terms = document.querySelectorAll('#glossary-list .term');

    terms.forEach(term => {
        const termText = term.textContent.toLowerCase();
        if (termText.includes(searchTerm)) {
            term.style.display = 'block';
        } else {
            term.style.display = 'none';
        }
    });
}

function showTerm(term) {
    const termDescription = document.getElementById('term-description');
    let description = '';
    switch (term) {
        case 'Telegram':
            description = 'Telegram — это бесплатный мессенджер, позволяющий обмениваться сообщениями и файлами.';
            break;
        case 'Bot':
            description = 'Боты Telegram — это аккаунты, управляемые программным обеспечением, которые могут выполнять различные задачи.';
            break;
        case 'Channel':
            description = 'Каналы Telegram — это инструменты для трансляции сообщений широкой аудитории.';
            break;
        case 'Group':
            description = 'Группы Telegram — это чаты для общения нескольких пользователей.';
            break;
        case 'Secret Chat':
            description = 'Секретные чаты Telegram обеспечивают сквозное шифрование и самоуничтожение сообщений.';
            break;
        case 'Sticker':
            description = 'Стикеры Telegram — это анимированные изображения для выражения эмоций.';
            break;
        case 'Message':
            description = 'Сообщения Telegram — текстовые, графические или мультимедийные данные.';
            break;
        case 'Cloud Storage':
            description = 'Telegram позволяет хранить сообщения и файлы в облаке.';
            break;
        case 'Encryption':
            description = 'Telegram использует шифрование для защиты пользовательских данных.';
            break;
        case 'Broadcast':
            description = 'Рассылка Telegram — отправка одного сообщения нескольким контактам.';
            break;
        default:
            description = 'Описание для данного термина не найдено.';
    }
    termDescription.innerHTML = `<p>${description}</p>`;
}
function loadUserData() {
    const login = localStorage.getItem('login');
    const birthDate = localStorage.getItem('birthDate');
    let gender = localStorage.getItem('gender');
    if (login) {
        document.getElementById('user-login').textContent = login;
    }
    if (gender) {
        if (gender === 'male') {
            gender = 'Мужской';
        } else if (gender === 'female') {
            gender = 'Женский';
        }
        document.getElementById('user-gender').textContent = gender;
    }
    if (birthDate) {
        const birthDateObj = new Date(birthDate);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDateObj.getFullYear();

        if (currentDate.getMonth() < birthDateObj.getMonth() || (currentDate.getMonth() === birthDateObj.getMonth() && currentDate.getDate() < birthDateObj.getDate())) {
            age--;
        }
        document.getElementById('user-age').textContent = age;
    }

    const score = localStorage.getItem('testScore');
    const correctCount = localStorage.getItem('correctCount');
    const incorrectCount = localStorage.getItem('incorrectCount');
    if (score) {
        document.getElementById('user-score').textContent = `${score} балл(ов)`;
    }
    if (correctCount) {
        document.getElementById('user-correct').textContent = `${correctCount} из 6`;
    }
    if (incorrectCount) {
        document.getElementById('user-incorrect').textContent = `${incorrectCount} из 6`;
    }
    document.getElementById('logout-btn-profile2')?.addEventListener('click', function () {
        localStorage.clear();
        showSection('auth-form');
        document.getElementById('protected-content').style.display = 'none';
    });
}