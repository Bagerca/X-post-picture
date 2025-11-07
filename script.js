document.addEventListener('DOMContentLoaded', () => {
    // === ЭЛЕМЕНТЫ РЕДАКТОРА ===
    const nameInput = document.getElementById('name');
    const nicknameInput = document.getElementById('nickname');
    const avatarUrlInput = document.getElementById('avatar-url');
    const avatarInput = document.getElementById('avatar');
    const removeAvatarBtn = document.getElementById('remove-avatar');
    const verifiedCheckbox = document.getElementById('verified');
    const postTextInput = document.getElementById('post-text');
    const postImageUrlInput = document.getElementById('post-image-url');
    const postImageInput = document.getElementById('post-image');
    const removePostImageBtn = document.getElementById('remove-post-image');
    const likesInput = document.getElementById('likes');
    const retweetsInput = document.getElementById('retweets');
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    const isRetweetCheckbox = document.getElementById('is-retweet');
    const retweeterNameInput = document.getElementById('retweeter-name');
    const retweetEditor = document.getElementById('retweet-editor');
    const isReplyCheckbox = document.getElementById('is-reply');
    const replyEditor = document.getElementById('reply-editor');
    const replyNameInput = document.getElementById('reply-name');
    const replyNicknameInput = document.getElementById('reply-nickname');
    const bgColorInput = document.getElementById('bg-color');
    const bgImageUrlInput = document.getElementById('bg-image-url');
    const bgImageInput = document.getElementById('bg-image');
    const removeBgImageBtn = document.getElementById('remove-bg-image');
    const bgBlurInput = document.getElementById('bg-blur');
    const borderColorInput = document.getElementById('border-color');
    const borderWidthInput = document.getElementById('border-width');
    const borderStyleSelect = document.getElementById('border-style');
    const generateBtn = document.getElementById('generate-image-btn');

    // === ЭЛЕМЕНТЫ ПРЕДПРОСМОТРА ===
    const postPreview = document.getElementById('post-preview');
    const namePreview = document.getElementById('name-preview');
    const nicknamePreview = document.getElementById('nickname-preview');
    const avatarPreview = document.getElementById('avatar-preview');
    const verifiedIcon = document.getElementById('verified-icon');
    const postTextPreview = document.getElementById('post-text-preview');
    const postImagePreview = document.getElementById('post-image-preview');
    const likesPreview = document.getElementById('likes-preview');
    const retweetsPreview = document.getElementById('retweets-preview');
    const retweetHeader = document.getElementById('retweet-header');
    const retweeterNamePreview = document.getElementById('retweeter-name-preview');
    const replyHeader = document.getElementById('reply-header');
    const replyNamePreview = document.getElementById('reply-name-preview');
    const replyNicknamePreview = document.getElementById('reply-nickname-preview');
    const replyPreview = document.getElementById('reply-preview');

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

    // Аватар (URL и загрузка)
    avatarUrlInput.addEventListener('input', () => {
        avatarPreview.src = avatarUrlInput.value;
        avatarPreview.classList.remove('hidden');
    });

    avatarInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                avatarPreview.src = e.target.result;
                avatarUrlInput.value = ''; // Сброс URL, если загружен файл
            };
            reader.readAsDataURL(file);
            avatarPreview.classList.remove('hidden');
        }
    });

    removeAvatarBtn.addEventListener('click', () => {
        avatarPreview.src = 'https://via.placeholder.com/48'; // Сброс на placeholder
        avatarUrlInput.value = '';
        avatarInput.value = null; // Сброс инпута файла
    });
    // Верификация
    verifiedCheckbox.addEventListener('change', () => {
        verifiedIcon.classList.toggle('hidden', !verifiedCheckbox.checked);
    });

    // Изображение поста (URL и загрузка)
    postImageUrlInput.addEventListener('input', () => {
        postImagePreview.src = postImageUrlInput.value;
        postImagePreview.classList.remove('hidden');
    });

    postImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                postImagePreview.src = e.target.result;
                postImageUrlInput.value = ''; // Сброс URL при загрузке файла
            };
            reader.readAsDataURL(file);
            postImagePreview.classList.remove('hidden');
        }
    });

    removePostImageBtn.addEventListener('click', () => {
        postImagePreview.src = '';
        postImagePreview.classList.add('hidden');
        postImageUrlInput.value = '';
        postImageInput.value = null;
    });

    // Переключение тем
    themeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            postPreview.classList.remove('theme-light', 'theme-dim', 'theme-dark');
            postPreview.classList.add(radio.value);
        });
    });

    // Ретвит
    isRetweetCheckbox.addEventListener('change', () => {
        const isChecked = isRetweetCheckbox.checked;
        retweetEditor.classList.toggle('hidden', !isChecked);
        retweetHeader.classList.toggle('hidden', !isChecked);
    });

    retweeterNameInput.addEventListener('input', () => {
        retweeterNamePreview.textContent = retweeterNameInput.value;
    });

    // Ответ на пост
    isReplyCheckbox.addEventListener('change', () => {
        const isChecked = isReplyCheckbox.checked;
        replyEditor.classList.toggle('hidden', !isChecked);
        replyPreview.classList.toggle('hidden', !isChecked);
    });

    // Настройки фона
    bgColorInput.addEventListener('input', () => {
        postPreview.style.setProperty('--bg-color', bgColorInput.value);
    });

    bgImageUrlInput.addEventListener('input', () => {
        postPreview.style.setProperty('--bg-image', `url('${bgImageUrlInput.value}')`);
        postPreview.style.backgroundImage = `url('${bgImageUrlInput.value}')`; // Для отображения в превью
    });

    bgImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                postPreview.style.setProperty('--bg-image', `url('${e.target.result}')`);
                postPreview.style.backgroundImage = `url('${e.target.result}')`; // Для отображения в превью
                bgImageUrlInput.value = ''; // Сброс URL
            };
            reader.readAsDataURL(file);
        }
    });

    removeBgImageBtn.addEventListener('click', () => {
         postPreview.style.setProperty('--bg-image', 'none');
         postPreview.style.backgroundImage = 'none';
         bgImageUrlInput.value = '';
         bgImageInput.value = null;
    });

    bgBlurInput.addEventListener('input', () => {
        postPreview.style.setProperty('--bg-blur', bgBlurInput.value + 'px');
    });

    borderColorInput.addEventListener('input', () => {
        postPreview.style.setProperty('--border-color', borderColorInput.value);
    });

    borderWidthInput.addEventListener('input', () => {
        postPreview.style.setProperty('--border-width', borderWidthInput.value + 'px');
    });

    borderStyleSelect.addEventListener('change', () => {
        postPreview.style.setProperty('--border-style', borderStyleSelect.value);
    });

    // Генерация и скачивание изображения
    generateBtn.addEventListener('click', () => {
        // Получаем цвет фона из CSS переменной для корректной отрисовки
        const computedStyle = getComputedStyle(postPreview);
        const backgroundColor = computedStyle.getPropertyValue('--bg-color');
        const backgroundImage = computedStyle.getPropertyValue('--bg-image');

        html2canvas(postPreview, {
            scale: 3, // Увеличенное разрешение для лучшего качества
            useCORS: true,
            backgroundColor: backgroundColor,
            imageTimeout: 0,
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'post.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
});
