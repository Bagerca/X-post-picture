document.addEventListener('DOMContentLoaded', () => {
    // Элементы для ввода данных
    const nameInput = document.getElementById('name');
    const nicknameInput = document.getElementById('nickname');
    const avatarInput = document.getElementById('avatar');
    const postTextInput = document.getElementById('post-text');
    const likesInput = document.getElementById('likes');
    const retweetsInput = document.getElementById('retweets');
    const generateBtn = document.getElementById('generate-image-btn');

    // Элементы для предпросмотра
    const namePreview = document.getElementById('name-preview');
    const nicknamePreview = document.getElementById('nickname-preview');
    const avatarPreview = document.getElementById('avatar-preview');
    const postTextPreview = document.getElementById('post-text-preview');
    const likesPreview = document.getElementById('likes-preview');
    const retweetsPreview = document.getElementById('retweets-preview');
    const postPreview = document.getElementById('post-preview');

    // Обновление текста в реальном времени
    nameInput.addEventListener('input', () => namePreview.textContent = nameInput.value);
    nicknameInput.addEventListener('input', () => nicknamePreview.textContent = nicknameInput.value);
    postTextInput.addEventListener('input', () => postTextPreview.textContent = postTextInput.value);

    // Обновление лайков и ретвитов
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
            reader.onload = (e) => {
                avatarPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Генерация и скачивание изображения
    generateBtn.addEventListener('click', () => {
        html2canvas(postPreview, {
            scale: 3, // Увеличиваем разрешение для лучшего качества
            useCORS: true // Необходимо для загрузки внешних изображений
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'post.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
});
