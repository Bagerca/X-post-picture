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
        time: document.getElementById('post-time'),
        date: document.getElementById('post-date'),
        views: document.getElementById('views-count'),
        theme: document.getElementById('theme-select'),
        postRadius: document.getElementById('post-radius-range'),
        
        // Background controls
        enableBg: document.getElementById('enable-background'),
        bgControlsContainer: document.getElementById('background-controls'),
        bgMode: document.getElementById('background-mode'),
        bgColor: document.getElementById('bg-color-picker'),
        bgUrl: document.getElementById('bg-image-url'),
        bgBlur: document.getElementById('bg-blur-range'),
        bgRadius: document.getElementById('bg-radius-range'),
    };

    // === Preview Elements ===
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
    };

    const root = document.documentElement;

    // --- EVENT LISTENERS ---

    // Bind simple text inputs to preview elements
    const bindText = (input, element) => input.addEventListener('input', () => element.textContent = input.value);
    bindText(inputs.name, els.name);
    bindText(inputs.nick, els.nick);
    bindText(inputs.text, els.text);
    bindText(inputs.time, els.time);
    bindText(inputs.date, els.date);

    // Views count has special formatting
    inputs.views.addEventListener('input', () => {
        els.views.innerHTML = `<b>${inputs.views.value}</b> просмотра`;
    });

    // Verification Badge
    inputs.verify.addEventListener('change', () => {
        els.badgeBlue.classList.toggle('hidden', inputs.verify.value !== 'blue');
        els.badgeGold.classList.toggle('hidden', inputs.verify.value !== 'gold');
    });

    // Theme Switcher
    inputs.theme.addEventListener('change', () => {
        els.container.className = `theme-${inputs.theme.value}`;
    });

    // Image Handlers (Avatar & Post Image)
    const handleImageInput = (fileInput, urlInput, previewEl) => {
        const updateImage = (src) => {
            previewEl.src = src;
            previewEl.classList.toggle('hidden', !src);
        };
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => updateImage(e.target.result);
                reader.readAsDataURL(file);
                urlInput.value = '';
            }
        });
        urlInput.addEventListener('input', () => updateImage(urlInput.value));
    };
    handleImageInput(inputs.avatarFile, inputs.avatarUrl, els.avatar);
    handleImageInput(inputs.postImageFile, inputs.postImageUrl, els.postImg);
    document.getElementById('remove-post-image').addEventListener('click', () => {
        els.postImg.src = '';
        els.postImg.classList.add('hidden');
        inputs.postImageFile.value = '';
        inputs.postImageUrl.value = '';
    });

    // --- BACKGROUND CONTROLS ---

    // Toggle background editor visibility and wrapper class
    inputs.enableBg.addEventListener('change', () => {
        const isEnabled = inputs.enableBg.checked;
        inputs.bgControlsContainer.classList.toggle('hidden', !isEnabled);
        els.wrapper.classList.toggle('background-enabled', isEnabled);
    });

    // Background mode switcher
    inputs.bgMode.addEventListener('change', () => {
        els.wrapper.classList.remove('mode-wide', 'mode-compact', 'mode-square');
        els.wrapper.classList.add(`mode-${inputs.bgMode.value}`);
    });
    // Set initial mode
    els.wrapper.classList.add(`mode-${inputs.bgMode.value}`);

    // Update CSS variables for live styling
    const bindCssVariable = (input, variableName, unit = '') => {
        input.addEventListener('input', () => {
            root.style.setProperty(variableName, `${input.value}${unit}`);
        });
    };
    bindCssVariable(inputs.postRadius, '--post-border-radius', 'px');
    bindCssVariable(inputs.bgRadius, '--bg-border-radius', 'px');
    bindCssVariable(inputs.bgColor, '--bg-color-value');
    bindCssVariable(inputs.bgBlur, '--bg-blur-amount', 'px');
    inputs.bgUrl.addEventListener('input', () => {
        root.style.setProperty('--bg-image-url', inputs.bgUrl.value ? `url(${inputs.bgUrl.value})` : 'none');
    });

    // --- GENERATE IMAGE ---
    document.getElementById('generate-btn').addEventListener('click', () => {
        html2canvas(els.wrapper, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null, // Transparent background for wrapper to see body
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'x-post.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
             alert("Ошибка при генерации изображения. Если вы использовали картинку по ссылке, попробуйте скачать ее и загрузить как файл.");
             console.error(err);
        });
    });

    // Set initial values on load
    root.style.setProperty('--post-border-radius', `${inputs.postRadius.value}px`);
    root.style.setProperty('--bg-border-radius', `${inputs.bgRadius.value}px`);
});
