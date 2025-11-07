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
        time: document.getElementById('post-time'), date: document.getElementById('post-date'),
        views: document.getElementById('views-count'), comments: document.getElementById('comments-count'),
        retweets: document.getElementById('retweets-count'), likes: document.getElementById('likes-count'),
        theme: document.getElementById('theme-select'), postRadius: document.getElementById('post-radius-range'),
        isRetweet: document.getElementById('is-retweet-mode'), isReply: document.getElementById('is-reply-mode'),
        replyControls: document.getElementById('reply-controls'), replyName: document.getElementById('reply-name'),
        replyAvatarUrl: document.getElementById('reply-avatar-url'),
        enableBg: document.getElementById('enable-background'), bgControls: document.getElementById('background-controls'),
        bgMode: document.getElementById('background-mode'), bgColor: document.getElementById('bg-color-picker'),
        bgImageFile: document.getElementById('bg-image-file'), bgUrl: document.getElementById('bg-image-url'),
        bgBlur: document.getElementById('bg-blur-range'), bgRadius: document.getElementById('bg-radius-range'),
        enableWm: document.getElementById('enable-watermark'), wmControls: document.getElementById('watermark-controls'),
        wmPos: document.getElementById('watermark-position'), wmType: document.getElementById('watermark-type'),
        wmAvatarFile: document.getElementById('watermark-avatar-file'), wmAvatarUrl: document.getElementById('watermark-avatar-url'),
        wmText: document.getElementById('watermark-text'), wmColor: document.getElementById('watermark-color'),
    };

    const els = {
        wrapper: document.getElementById('capture-wrapper'), container: document.getElementById('post-container'),
        name: document.getElementById('name-preview'), nick: document.getElementById('nickname-preview'),
        avatar: document.getElementById('main-avatar-preview'), badgeBlue: document.getElementById('badge-blue'),
        badgeGold: document.getElementById('badge-gold'), text: document.getElementById('main-text-preview'),
        imagesContainer: document.getElementById('post-images-container'),
        time: document.getElementById('time-preview'), date: document.getElementById('date-preview'),
        views: document.getElementById('views-preview'), comments: document.getElementById('comments-count-preview'),
        retweets: document.getElementById('retweets-count-preview'), likes: document.getElementById('likes-count-preview'),
        retweetHeader: document.getElementById('retweet-header'), retweeterName: document.getElementById('retweeter-name-preview'),
        replyParent: document.getElementById('reply-parent'), replyName: document.getElementById('reply-name-preview'),
        replyAvatar: document.getElementById('reply-avatar-preview'),
        wmPreview: document.getElementById('watermark-preview'), wmAvatar: document.getElementById('watermark-avatar-preview'),
        wmText: document.getElementById('watermark-text-preview'),
    };

    const root = document.documentElement;
    
    // --- UTILITY FUNCTIONS ---
    const bindText = (input, element) => input.addEventListener('input', () => element.textContent = input.value);
    const handleImageInput = (fileInput, urlInput, previewEl) => {
        const update = src => { previewEl.src = src; };
        fileInput.addEventListener('change', e => {
            if (e.target.files[0]) { const reader = new FileReader(); reader.onload = e => update(e.target.result); reader.readAsDataURL(e.target.files[0]); if(urlInput) urlInput.value = ''; }
        });
        if(urlInput) urlInput.addEventListener('input', () => update(urlInput.value || 'https://placehold.co/48x48'));
    };
    const bindCssVar = (input, varName, unit = '') => input.addEventListener('input', () => root.style.setProperty(varName, `${input.value}${unit}`));

    // --- EVENT BINDING ---
    // Post Content
    bindText(inputs.name, els.name); bindText(inputs.nick, els.nick); bindText(inputs.text, els.text);
    bindText(inputs.time, els.time); bindText(inputs.date, els.date); bindText(inputs.comments, els.comments);
    bindText(inputs.retweets, els.retweets); bindText(inputs.likes, els.likes);
    bindText(inputs.replyName, els.replyName);
    inputs.views.addEventListener('input', () => els.views.innerHTML = `<b>${inputs.views.value}</b> просмотра`);
    inputs.verify.addEventListener('change', () => {
        els.badgeBlue.classList.toggle('hidden', inputs.verify.value !== 'blue');
        els.badgeGold.classList.toggle('hidden', inputs.verify.value !== 'gold');
    });
    handleImageInput(inputs.avatarFile, inputs.avatarUrl, els.avatar);
    
    // Post Modes
    inputs.isRetweet.addEventListener('change', () => els.retweetHeader.classList.toggle('hidden', !inputs.isRetweet.checked));
    inputs.isReply.addEventListener('change', () => {
        const isEnabled = inputs.isReply.checked;
        els.replyParent.classList.toggle('hidden', !isEnabled);
        inputs.replyControls.classList.toggle('hidden', !isEnabled);
    });
    handleImageInput(null, inputs.replyAvatarUrl, els.replyAvatar);
    
    // Multi-Image Handler
    inputs.postImageFile.addEventListener('change', e => {
        els.imagesContainer.innerHTML = '';
        const files = Array.from(e.target.files).slice(0, 4); // Limit to 4 images
        if (files.length === 0) { els.imagesContainer.removeAttribute('data-count'); return; }
        
        els.imagesContainer.setAttribute('data-count', files.length);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = e => {
                const img = document.createElement('img');
                img.src = e.target.result;
                els.imagesContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });
    document.getElementById('remove-post-images').addEventListener('click', () => {
        els.imagesContainer.innerHTML = '';
        inputs.postImageFile.value = '';
        els.imagesContainer.removeAttribute('data-count');
    });
    
    // Styling & Background
    inputs.theme.addEventListener('change', () => els.container.className = `theme-${inputs.theme.value}`);
    bindCssVar(inputs.postRadius, '--post-border-radius', 'px');
    inputs.enableBg.addEventListener('change', () => {
        inputs.bgControls.classList.toggle('hidden', !inputs.enableBg.checked);
        els.wrapper.classList.toggle('background-enabled', inputs.enableBg.checked);
    });
    inputs.bgMode.addEventListener('change', () => {
        els.wrapper.className = els.wrapper.className.replace(/mode-\w+/g, '');
        els.wrapper.classList.add(`mode-${inputs.bgMode.value}`);
    });
    bindCssVar(inputs.bgColor, '--bg-color-value');
    bindCssVar(inputs.bgBlur, '--bg-blur-amount', 'px');
    bindCssVar(inputs.bgRadius, '--bg-border-radius', 'px');
    const updateBgImage = (src) => root.style.setProperty('--bg-image-url', src ? `url(${src})` : 'none');
    inputs.bgImageFile.addEventListener('change', e => {
        if(e.target.files[0]) { const reader = new FileReader(); reader.onload = e => updateBgImage(e.target.result); reader.readAsDataURL(e.target.files[0]); inputs.bgUrl.value = ''; }
    });
    inputs.bgUrl.addEventListener('input', () => updateBgImage(inputs.bgUrl.value));

    // Watermark
    inputs.enableWm.addEventListener('change', () => {
        inputs.wmControls.classList.toggle('hidden', !inputs.enableWm.checked);
        els.wmPreview.classList.toggle('hidden', !inputs.enableWm.checked);
    });
    inputs.wmPos.addEventListener('change', () => {
        els.wmPreview.className = 'wm-bottom-right'; // Reset and apply
        els.wmPreview.classList.replace('wm-bottom-right', inputs.wmPos.value);
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
