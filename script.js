document.addEventListener('DOMContentLoaded', () => {
    // === ЭЛЕМЕНТЫ РЕДАКТОРА ===
    const nameInput = document.getElementById('name');
    const nicknameInput = document.getElementById('nickname');
    const avatarInput = document.getElementById('avatar');
    const postTextInput = document.getElementById('post-text');
    const postImageInput = document.getElementById('post-image');
    const removePostImageBtn = document.getElementById('remove-post-image');
    const likesInput = document.getElementById('likes');
    const retweetsInput = document.getElementById('retweets');
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    const isRetweetCheckbox = document.getElementById('is-retweet');
    const retweeterNameInput = document.getElementById('retweeter-name');
    const retweetEditor = document.getElementById('retweet-editor');
    const generateBtn = document.getElementById('generate-image-btn');

    // === ЭЛЕМЕНТЫ ПРЕДПРОСМОТРА ===
    const postPreview = document.getElementById('post-preview');
    const namePreview = document.getElementById('name-preview');
    const nicknamePreview = document.getElementById('nickname-preview');
    const avatarPreview = document.getElementById('avatar-preview');
    const postTextPreview = document.getElementById('post-text-preview');
    const postImagePreview = document.getElementById('post-image-preview');
    const likesPreview = document.getElementById('likes-preview');
    const retweetsPreview = document.getElementById('retweets-preview');
    const retweetHeader = document.getElementById('retweet-header');
    const retweeterNamePreview = document.getElementById('retweeter-name-preview');

    // --- ОБРАБОТЧИКИ СОБЫТИЙ ---

    // Обновление текста и статистики в реальном времени
    nameInput.addEventListener('input', () => namePreview.textContent = nameInput.value);
    nicknameInput.addEventListener('input', () => nicknamePreview.textContent = nicknameInput.value);
    postTextInput.addEventListener('input', () => postTextPreview.textContent = postTextInput.value);
    likesInput.addEventListener('input', () => {
        likesPreview.innerHTML = `<b>${Number(likesInput.value).toLocaleString('ru-RU')}</b> Лайков`;
    });
    retweetsInput.addEventListener('input', () => {
        retweetsPreview.innerHTML = `<b>${Number(retweetsInput.value).toLocaleString('ru-RU')}</b> Ретвитов`;
    });

    // Обновление аватара
    avatarInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => avatarPreview.src = e.target.result;
            reader.readAsDataURL(file);
        }
    });

    // Обновление изображения в посте
    postImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                postImagePreview.src = e.target.result;
                postImagePreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    // Удаление изображения из поста
    removePostImageBtn.addEventListener('click', () => {
        postImagePreview.src = '';
        postImagePreview.classList.add('hidden');
        postImageInput.value = null; // Сброс инпута
    });

    // Переключение тем
    themeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            postPreview.classList.remove('theme-light', 'theme-dim', 'theme-dark');
            postPreview.classList.add(radio.value);
        });
    });

    // Логика ретвита
    isRetweetCheckbox.addEventListener('change', () => {
        const isChecked = isRetweetCheckbox.checked;
        retweetEditor.classList.toggle('hidden', !isChecked);
        retweetHeader.classList.toggle('hidden', !isChecked);
    });

    retweeterNameInput.addEventListener('input', () => {
        retweeterNamePreview.textContent = retweeterNameInput.value;
    });

    // Генерация и скачивание изображения
    generateBtn.addEventListener('click', () => {
        // Получаем цвет фона из CSS переменной для корректной отрисовки
        const computedStyle = getComputedStyle(postPreview);
        const backgroundColor = computedStyle.getPropertyValue('--bg-color');

        html2canvas(postPreview, {
            scale: 3, // Увеличенное разрешение для лучшего качества
            useCORS: true,
            backgroundColor: backgroundColor,
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'post.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
});
