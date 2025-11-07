document.addEventListener('DOMContentLoaded', () => {
    // === Elements Inputs ===
    const inputs = {
        name: document.getElementById('name'),
        nick: document.getElementById('nickname'),
        verify: document.getElementById('verified-badge'),
        avatarFile: document.getElementById('avatar-file'),
        avatarUrl: document.getElementById('avatar-url'),
        text: document.getElementById('post-text'),
        postImageFile: document.getElementById('post-image-file'),
        postImageUrl: document.getElementById('post-image-url'),
        isReply: document.getElementById('is-reply-mode'),
        replyName: document.getElementById('reply-name'),
        replyText: document.getElementById('reply-text'),
        replyAvatarUrl: document.getElementById('reply-avatar-url'),
        time: document.getElementById('post-time'),
        date: document.getElementById('post-date'),
        views: document.getElementById('views-count'),
        likes: document.getElementById('likes-count'),
        retweets: document.getElementById('retweets-count'),
        comments: document.getElementById('comments-count'),
        theme: document.getElementById('theme-select'),
        bgColor: document.getElementById('bg-color-picker'),
        bgUrl: document.getElementById('bg-image-url'),
        bgBlur: document.getElementById('bg-blur-range'),
        padding: document.getElementById('padding-range'),
    };

    // === Preview Elements ===
    const els = {
        container: document.getElementById('post-container'),
        wrapper: document.getElementById('capture-wrapper'),
        name: document.getElementById('name-preview'),
        nick: document.getElementById('nickname-preview'),
        avatar: document.getElementById('main-avatar-preview'),
        badgeBlue: document.getElementById('badge-blue'),
        badgeGold: document.getElementById('badge-gold'),
        text: document.getElementById('main-text-preview'),
        postImg: document.getElementById('post-image-preview'),
        replyParent: document.getElementById('reply-parent'),
        replyName: document.getElementById('reply-name-preview'),
        replyText: document.getElementById('reply-text-preview'),
        replyAvatar: document.getElementById('reply-avatar-preview'),
        time: document.getElementById('time-preview'),
        date: document.getElementById('date-preview'),
        views: document.getElementById('views-preview'),
        likes: document.getElementById('likes-count-preview'),
        retweets: document.getElementById('retweets-count-preview'),
        comments: document.getElementById('comments-count-preview'),
    };

    // === State Management ===
    const state = {
        avatarSrc: 'https://via.placeholder.com/48',
        postImgSrc: '',
        bgUrl: '',
    };

    // Helper to update text
    const bindTxt = (input, element, formatFn = v => v) => {
        input.addEventListener('input', () => {
            if (element.tagName === 'B' || element.tagName === 'STRONG') {
                // Special case for bold wrapper inside
                element.textContent = formatFn(input.value);
            } else if (element.id === 'views-preview') {
                 // Very specific case for view count structure
                 element.innerHTML = `<b>${input.value}</b> просмотра`;
            } else {
                element.textContent = formatFn(input.value);
            }
        });
    };

    // Basic bindings
    bindTxt(inputs.name, els.name);
    bindTxt(inputs.nick, els.nick);
    bindTxt(inputs.text, els.text);
    bindTxt(inputs.time, els.time);
    bindTxt(inputs.date, els.date);
    bindTxt(inputs.views, els.views); // Special handler inside bindTxt handled above differently
    bindTxt(inputs.likes, els.likes);
    bindTxt(inputs.retweets, els.retweets);
    bindTxt(inputs.comments, els.comments);
    bindTxt(inputs.replyName, els.replyName);
    bindTxt(inputs.replyText, els.replyText);

    // Specific complex inputs
    inputs.views.addEventListener('input', () => {
        els.views.innerHTML = `<b>${inputs.views.value}</b> просмотра`;
    });

    // Verification Badge
    inputs.verify.addEventListener('change', () => {
        els.badgeBlue.classList.add('hidden');
        els.badgeGold.classList.add('hidden');
        if (inputs.verify.value === 'blue') els.badgeBlue.classList.remove('hidden');
        if (inputs.verify.value === 'gold') els.badgeGold.classList.remove('hidden');
    });

    // Theme
    inputs.theme.addEventListener('change', () => {
        els.container.className = `theme-${inputs.theme.value}`;
    });

    // Background Styling
    const updateBg = () => {
        const color = inputs.bgColor.value;
        const url = inputs.bgUrl.value;
        const blur = inputs.bgBlur.value;
        const pad = inputs.padding.value;
        
        els.wrapper.style.backgroundColor = color;
        els.wrapper.style.backgroundImage = url ? `url("${url}")` : 'none';
        els.wrapper.style.backgroundSize = 'cover';
        els.wrapper.style.backgroundPosition = 'center';
        els.wrapper.style.padding = `${pad}px`;
        
        // Since backdrop-filter doesn't work on wrapper background directly, we fake it
        // Actually, better to set backdrop-filter on container if desired, but user asked for bg edit.
        // Let's leave blur for wrapper children if needed in future.
    };
    inputs.bgColor.addEventListener('input', updateBg);
    inputs.bgUrl.addEventListener('input', updateBg);
    inputs.padding.addEventListener('input', updateBg);

    // Image Handling Handlers
    const handleImageFile = (input, urlInput, previewEl, callback) => {
        const updateImg = (src) => {
            previewEl.src = src;
            if (previewEl.classList.contains('hidden') && src) {
                 previewEl.classList.remove('hidden');
            } else if (!src) {
                 previewEl.classList.add('hidden');
            }
            if(callback) callback(src);
        };

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => updateImg(e.target.result);
                reader.readAsDataURL(file);
            }
        });

        urlInput.addEventListener('input', (e) => {
            if (e.target.value) updateImg(e.target.value);
        });
    };

    handleImageFile(inputs.avatarFile, inputs.avatarUrl, els.avatar);
    handleImageFile(inputs.postImageFile, inputs.postImageUrl, els.postImg);
    // For reply avatar handled manually since it's only URL input in HTML provided
    inputs.replyAvatarUrl.addEventListener('input', () => {
        els.replyAvatar.src = inputs.replyAvatarUrl.value || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png';
    });

    // Toggle Reply Mode
    inputs.isReply.addEventListener('change', () => {
        els.replyParent.classList.toggle('hidden', !inputs.isReply.checked);
    });

    document.getElementById('remove-post-image').addEventListener('click', () => {
        els.postImg.src = '';
        els.postImg.classList.add('hidden');
        inputs.postImageFile.value = '';
        inputs.postImageUrl.value = '';
    });

    // Generator
    document.getElementById('generate-btn').addEventListener('click', () => {
        // Ensure fonts load before capture
        document.documentElement.classList.add('capturing');
        
        html2canvas(els.wrapper, {
            scale: 3, // High Res
            useCORS: true, // Crucial for external images
            allowTaint: true,
            backgroundColor: null // Use established background
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'tweet-ultimate.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            document.documentElement.classList.remove('capturing');
        }).catch(err => {
             alert("Ошибка при генерации. Если картинка не загрузилась, возможно сайт блокирует доступ (CORS). Попробуйте загрузить файл локально.");
             console.error(err);
             document.documentElement.classList.remove('capturing');
        });
    });
});
