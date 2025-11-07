document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements Cache ===
    const inputs = {
        name: document.getElementById('name'),
        nick: document.getElementById('nickname'),
        verify: document.getElementById('verified-badge'),
        avatarFile: document.getElementById('avatar-file'),
        avatarUrl: document.getElementById('avatar-url'),
        text: document.getElementById('post-text'),
        postImageFile: document.getElementById('post-image-file'),
        postImageUrl: document.getElementById('post-image-url'),
        time: document.getElementById('post-time'),
        date: document.getElementById('post-date'),
        views: document.getElementById('views-count'),
        comments: document.getElementById('comments-count'),
        retweets: document.getElementById('retweets-count'),
        likes: document.getElementById('likes-count'),
        theme: document.getElementById('theme-select'),
        postRadius: document.getElementById('post-radius-range'),
        enableBg: document.getElementById('enable-background'),
        bgControls: document.getElementById('background-controls'),
        bgMode: document.getElementById('background-mode'),
        bgColor: document.getElementById('bg-color-picker'),
        bgUrl: document.getElementById('bg-image-url'),
        bgBlur: document.getElementById('bg-blur-range'),
        bgRadius: document.getElementById('bg-radius-range'),
        // Watermark
        enableWm: document.getElementById('enable-watermark'),
        wmControls: document.getElementById('watermark-controls'),
        wmPos: document.getElementById('watermark-position'),
        wmType: document.getElementById('watermark-type'),
        wmAvatarFile: document.getElementById('watermark-avatar-file'),
        wmAvatarUrl: document.getElementById('watermark-avatar-url'),
        wmText: document.getElementById('watermark-text'),
        wmColor: document.getElementById('watermark-color'),
    };

    const els = {
        wrapper: document.getElementById('capture-wrapper'),
        container: document.getElementById('post-container'),
        name: document.getElementById('name-preview'),
        nick: document.getElementById('nickname-preview'),
        avatar: document.getElementById('main-avatar-preview'),
        badgeBlue: document.getElementById('badge-blue'),
        badgeGold: document.getElementById('badge-gold'),
        text: document.getElementById('main-text-preview'),
        postImg: document.getElementById('post-image-preview'),
        time: document.getElementById('time-preview'),
        date: document.getElementById('date-preview'),
        views: document.getElementById('views-preview'),
        comments: document.getElementById('comments-count-preview'),
        retweets: document.getElementById('retweets-count-preview'),
        likes: document.getElementById('likes-count-preview'),
        // Watermark
        wmPreview: document.getElementById('watermark-preview'),
        wmAvatar: document.getElementById('watermark-avatar-preview'),
        wmText: document.getElementById('watermark-text-preview'),
    };

    const root = document.documentElement;

    // --- UTILITY FUNCTIONS ---
    const bindText = (input, element) => input.addEventListener('input', () => element.textContent = input.value);
    const handleImageInput = (fileInput, urlInput, previewEl) => {
        const update = (src) => {
            previewEl.src = src;
            previewEl.classList.toggle('hidden', !src);
        };
        fileInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => update(e.target.result);
                reader.readAsDataURL(file);
                urlInput.value = '';
            }
        });
        urlInput.addEventListener('input', () => update(urlInput.value || 'https://placehold.co/24x24'));
    };
    const bindCssVar = (input, varName, unit = '') => input.addEventListener('input', () => root.style.setProperty(varName, `${input.value}${unit}`));

    // --- EVENT BINDING ---
    // Post Content
    bindText(inputs.name, els.name);
    bindText(inputs.nick, els.nick);
    bindText(inputs.text, els.text);
    bindText(inputs.time, els.time);
    bindText(inputs.date, els.date);
    bindText(inputs.comments, els.comments);
    bindText(inputs.retweets, els.retweets);
    bindText(inputs.likes, els.likes);
    inputs.views.addEventListener('input', () => els.views.innerHTML = `<b>${inputs.views.value}</b> просмотра`);
    inputs.verify.addEventListener('change', () => {
        els.badgeBlue.classList.toggle('hidden', inputs.verify.value !== 'blue');
        els.badgeGold.classList.toggle('hidden', inputs.verify.value !== 'gold');
    });
    handleImageInput(inputs.avatarFile, inputs.avatarUrl, els.avatar);
    handleImageInput(inputs.postImageFile, inputs.postImageUrl, els.postImg);
    document.getElementById('remove-post-image').addEventListener('click', () => {
        els.postImg.src = ''; els.postImg.classList.add('hidden');
        inputs.postImageFile.value = ''; inputs.postImageUrl.value = '';
    });
    
    // Post Styling
    inputs.theme.addEventListener('change', () => els.container.className = `theme-${inputs.theme.value}`);
    bindCssVar(inputs.postRadius, '--post-border-radius', 'px');

    // Background
    inputs.enableBg.addEventListener('change', () => {
        const isEnabled = inputs.enableBg.checked;
        inputs.bgControls.classList.toggle('hidden', !isEnabled);
        els.wrapper.classList.toggle('background-enabled', isEnabled);
    });
    inputs.bgMode.addEventListener('change', () => {
        els.wrapper.className = els.wrapper.className.replace(/mode-\w+/g, '');
        els.wrapper.classList.add(`mode-${inputs.bgMode.value}`);
    });
    bindCssVar(inputs.bgColor, '--bg-color-value');
    bindCssVar(inputs.bgBlur, '--bg-blur-amount', 'px');
    bindCssVar(inputs.bgRadius, '--bg-border-radius', 'px');
    inputs.bgUrl.addEventListener('input', () => root.style.setProperty('--bg-image-url', inputs.bgUrl.value ? `url(${inputs.bgUrl.value})` : 'none'));

    // Watermark
    inputs.enableWm.addEventListener('change', () => {
        const isEnabled = inputs.enableWm.checked;
        inputs.wmControls.classList.toggle('hidden', !isEnabled);
        els.wmPreview.classList.toggle('hidden', !isEnabled);
    });
    inputs.wmPos.addEventListener('change', () => {
        els.wmPreview.className = els.wmPreview.className.replace(/wm-\w+-\w+/g, '');
        els.wmPreview.classList.add(inputs.wmPos.value);
    });
    inputs.wmType.addEventListener('change', () => {
        const type = inputs.wmType.value;
        els.wmAvatar.classList.toggle('hidden', type === 'text-only');
        els.wmText.classList.toggle('hidden', type === 'avatar-only');
    });
    bindText(inputs.wmText, els.wmText);
    inputs.wmColor.addEventListener('input', () => els.wmText.style.color = inputs.wmColor.value);
    handleImageInput(inputs.wmAvatarFile, inputs.wmAvatarUrl, els.wmAvatar);
    
    // Generate Button
    document.getElementById('generate-btn').addEventListener('click', () => {
        html2canvas(els.wrapper, { scale: 3, useCORS: true, allowTaint: true, backgroundColor: null })
        .then(canvas => {
            const link = document.createElement('a');
            link.download = 'x-post-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            alert("Ошибка генерации. Если использовали картинку по URL, попробуйте загрузить ее как файл.");
            console.error(err);
        });
    });

    // --- INITIALIZATION ---
    root.style.setProperty('--post-border-radius', `${inputs.postRadius.value}px`);
    root.style.setProperty('--bg-border-radius', `${inputs.bgRadius.value}px`);
    els.wrapper.classList.add(`mode-${inputs.bgMode.value}`);
    els.wmPreview.classList.add(inputs.wmPos.value);
    els.wmText.style.color = inputs.wmColor.value;
});
