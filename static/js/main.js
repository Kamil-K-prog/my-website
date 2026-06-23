document.addEventListener('DOMContentLoaded', () => {
    // 1. Управление навигационными ретро-кнопками в шапке
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Снимаем класс selected со всех кнопок навигации
            navButtons.forEach(btn => btn.classList.remove('selected'));
            // Добавляем класс selected на нажатую кнопку
            button.classList.add('selected');
        });
    });

    // 2. Сворачивание и разворачивание бокового меню
    const sidebarMenu = document.getElementById('sidebarMenu');
    const menuToggle = document.getElementById('menuToggle');
    if (sidebarMenu && menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebarMenu.classList.toggle('collapsed');
        });
    }

    // 3. Переключение активных пунктов бокового меню и плавная прокрутка к секциям
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.resume-section');
    const scrollContainer = document.querySelector('.resume-layout');
    
    // Флаг для предотвращения ложного переключения меню во время анимации плавной прокрутки
    let isProgrammaticScroll = false;
    let scrollTimeout;

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            isProgrammaticScroll = true;
            clearTimeout(scrollTimeout);

            // Убираем класс active у всех остальных пунктов
            menuItems.forEach(i => i.classList.remove('active'));
            // Добавляем класс active к текущему
            item.classList.add('active');

            // Выполняем плавный скролл к целевому элементу
            const targetId = item.getAttribute('data-target');
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }

            // Возвращаем управление скроллу через таймаут (после окончания анимации скролла)
            scrollTimeout = setTimeout(() => {
                isProgrammaticScroll = false;
            }, 800); // 800мс достаточно для завершения плавной прокрутки scroll-snap
        });
    });

    // Автоматическое переключение пунктов бокового меню при скролле (Intersection Observer)
    if (scrollContainer && sections.length > 0) {
        const observerOptions = {
            root: scrollContainer,
            rootMargin: '0px',
            threshold: 0.5 // Элемент считается активным, если он виден на 50% и более
        };

        const observerCallback = (entries) => {
            // Если скролл вызван кликом по пункту меню, то обсервер временно игнорирует события
            if (isProgrammaticScroll) return;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetId = entry.target.id;
                    const matchingMenuItem = document.querySelector(`.menu-item[data-target="${targetId}"]`);
                    if (matchingMenuItem) {
                        menuItems.forEach(i => i.classList.remove('active'));
                        matchingMenuItem.classList.add('active');
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach(section => observer.observe(section));
    }

    // 4. Интерактивные аккордеоны для карточки "Что я умею" (Skills)
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    // Функция для закрытия секции аккордеона
    const closeAccordion = (item) => {
        const content = item.querySelector('.accordion-content');
        const btn = item.querySelector('.accordion-toggle-btn');
        const header = item.querySelector('.accordion-header');
        
        item.classList.remove('expanded');
        if (content) {
            content.style.maxHeight = '0px';
        }
        if (btn) {
            btn.textContent = '+';
        }
        if (header) {
            header.setAttribute('aria-expanded', 'false');
        }
    };
    
    // Функция для открытия секции аккордеона
    const openAccordion = (item) => {
        const content = item.querySelector('.accordion-content');
        const btn = item.querySelector('.accordion-toggle-btn');
        const header = item.querySelector('.accordion-header');
        
        item.classList.add('expanded');
        if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
        if (btn) {
            btn.textContent = '-';
        }
        if (header) {
            header.setAttribute('aria-expanded', 'true');
        }
    };
    
    // Инициализация аккордеонов
    accordionItems.forEach(item => {
        const content = item.querySelector('.accordion-content');
        if (item.classList.contains('expanded')) {
            // Если элемент должен быть открыт по умолчанию
            openAccordion(item);
        } else {
            closeAccordion(item);
        }
        
        const header = item.querySelector('.accordion-header');
        if (header) {
            // Клик на заголовок
            header.addEventListener('click', () => {
                const isExpanded = item.classList.contains('expanded');
                
                if (isExpanded) {
                    // Если уже открыт, то просто закрываем его
                    closeAccordion(item);
                } else {
                    // Закрываем все остальные открытые аккордеоны
                    accordionItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('expanded')) {
                            closeAccordion(otherItem);
                        }
                    });
                    // Открываем текущий
                    openAccordion(item);
                }
            });
            
            // Доступность с клавиатуры (активация по Enter / Space)
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click();
                }
            });
        }
    });
    
    // Корректировка max-height при изменении размеров экрана (например, поворот экрана или ресайз)
    window.addEventListener('resize', () => {
        accordionItems.forEach(item => {
            if (item.classList.contains('expanded')) {
                const content = item.querySelector('.accordion-content');
                if (content) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });

    // 5. Windows 95 File Explorer (Карточка "Проекты")
    // Конфигурация проектов: raw-URL README на GitHub и ссылка на репозиторий.
    // README грузится напрямую с raw.githubusercontent.com (CORS: Access-Control-Allow-Origin: *).
    const projectConfig = {
        'AI_chat': {
            rawUrl: 'https://raw.githubusercontent.com/Kamil-K-prog/AI_chat/main/README.md',
            repoUrl: 'https://github.com/Kamil-K-prog/AI_chat'
        },
        'my-website': {
            rawUrl: 'https://raw.githubusercontent.com/Kamil-K-prog/my-website/main/README.md',
            repoUrl: 'https://github.com/Kamil-K-prog/my-website'
        },
        'project-dnd': {
            rawUrl: 'https://raw.githubusercontent.com/Kamil-K-prog/project-dnd/master/README.md',
            repoUrl: 'https://github.com/Kamil-K-prog/project-dnd'
        }
    };

    // Кэш загруженных README — не грузим повторно при переключении проектов
    const readmeCache = {};

    const treeItems = document.querySelectorAll('.explorer-tree .tree-item');
    const readmeRenderer = document.getElementById('readmeRenderer');
    const addressLink = document.getElementById('addressLink');

    // Рендеринг Markdown-текста в правую панель (marked.js, с fallback на <pre>)
    const renderMarkdown = (markdownText) => {
        if (!readmeRenderer) return;
        if (window.marked && typeof window.marked.parse === 'function') {
            readmeRenderer.innerHTML = window.marked.parse(markdownText);
        } else {
            // Запасной вариант, если библиотека marked не загрузилась
            const escaped = markdownText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            readmeRenderer.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace;">${escaped}</pre>`;
        }
    };

    // Асинхронная загрузка и рендеринг README.md с GitHub
    const renderReadme = async (projectName) => {
        if (!readmeRenderer) return;

        const config = projectConfig[projectName];
        if (!config) {
            readmeRenderer.innerHTML = '<p class="readme-loading">Выберите проект в дереве каталогов для просмотра README.md</p>';
            if (addressLink) { addressLink.href = '#'; addressLink.textContent = '—'; }
            return;
        }

        // Обновляем адресную строку ссылкой на репозиторий
        if (addressLink) {
            addressLink.href = config.repoUrl;
            addressLink.textContent = config.repoUrl;
        }

        // Скроллим контент README наверх при смене проекта (скролл-контейнер — .explorer-scroll)
        const scrollPanel = document.querySelector('.explorer-scroll');
        if (scrollPanel) {
            scrollPanel.scrollTop = 0;
        }

        // Отдаём из кэша, если уже загружали
        if (readmeCache[projectName]) {
            renderMarkdown(readmeCache[projectName]);
            return;
        }

        // Состояние загрузки
        readmeRenderer.innerHTML = '<p class="readme-loading">⏳ Загрузка README.md с GitHub…</p>';

        try {
            const response = await fetch(config.rawUrl, { cache: 'no-cache' });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const markdownText = await response.text();
            readmeCache[projectName] = markdownText;
            renderMarkdown(markdownText);
        } catch (err) {
            readmeRenderer.innerHTML =
                '<div class="readme-error">' +
                '<p><strong>⚠ Не удалось загрузить README.md</strong></p>' +
                '<p>' + err.message + '</p>' +
                '<p>Проверьте подключение к сети или откройте репозиторий по ссылке «Адрес».</p>' +
                '</div>';
        }
    };

    // Инициализация дерева и кликов
    treeItems.forEach(item => {
        const toggleBtn = item.querySelector(':scope > .tree-row > .tree-toggle');
        const treeRow = item.querySelector(':scope > .tree-row');
        
        // 1. Управление разворачиванием/сворачиванием папок-ветвей (branch)
        if (item.classList.contains('branch')) {
            const toggleBranch = (e) => {
                // Если кликнули именно по toggle кнопке или по тексту ветки (но не по листу)
                e.stopPropagation();
                item.classList.toggle('expanded');
                if (toggleBtn) {
                    toggleBtn.textContent = item.classList.contains('expanded') ? '-' : '+';
                }
            };

            if (toggleBtn) {
                toggleBtn.addEventListener('click', toggleBranch);
            }
            if (treeRow) {
                treeRow.addEventListener('click', toggleBranch);
            }
        }

        // 2. Управление выбором проектов-листьев (leaf)
        if (item.classList.contains('leaf')) {
            if (treeRow) {
                treeRow.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // Убираем выделение со всех листьев
                    document.querySelectorAll('.explorer-tree .tree-item.leaf').forEach(leaf => {
                        leaf.classList.remove('selected');
                    });
                    
                    // Выделяем текущий
                    item.classList.add('selected');
                    
                    // Рендерим README
                    const projectName = item.getAttribute('data-project');
                    renderReadme(projectName);
                });

                // Доступность с клавиатуры (фокус и выбор по Enter/Space)
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        treeRow.click();
                    }
                });
            }
        }
    });

    // Рендерим проект по умолчанию при старте
    const defaultSelectedLeaf = document.querySelector('.explorer-tree .tree-item.leaf.selected');
    if (defaultSelectedLeaf) {
        const defaultProject = defaultSelectedLeaf.getAttribute('data-project');
        renderReadme(defaultProject);
    }

    // 6. Свойства: Экран (Диалоговое окно "Интересное")
    const interestingData = {
        'sport': {
            title: 'Спорт',
            text: 'Спорт для меня — это отличный способ переключить внимание и держать себя в тонусе после долгих часов разработки. Регулярная физическая активность помогает поддерживать высокую концентрацию и продуктивность в работе.',
            url: '/static/ascii/sport.txt'
        },
        'networks': {
            title: 'Сети и ПК',
            text: 'С увлечением разбираюсь в сетевых технологиях и компьютерном железе. Проектирую топологии сетей в Cisco Packet Tracer, настраиваю маршрутизацию (VLAN, OSPF, ACL) и администрирую домашние Linux-сервера. Люблю собирать компьютеры и оптимизировать их работу.',
            url: '/static/ascii/networks.txt'
        },
        'music': {
            title: 'Музыка',
            text: 'В свободное время самостоятельно учусь играть на синтезаторе. Помогает очистить голову и стабилизировать настроение.',
            url: '/static/ascii/music.txt'
        },
        'ml': {
            title: 'ML & DL',
            text: 'Стремлюсь расширить свой кругозор в сторону Machine Learning и Deep Learning. Изучаю математические основы ИИ и планирую применять нейросети для решения сложных практических задач, чтобы повысить свою инженерную ценность.',
            url: '/static/ascii/ml.txt'
        }
    };

    const displayTabs = document.querySelectorAll('.display-tab');
    const crtScreen = document.getElementById('crtScreen');
    const crtAscii = document.getElementById('crtAscii');
    const infoTitle = document.getElementById('infoTitle');
    const infoText = document.getElementById('infoText');
    const crtLed = document.getElementById('crtLed');
    const crtPowerBtn = document.getElementById('crtPowerBtn');

    let isMonitorOn = true;

    const updateDisplayTab = (tabName, skipRefresh = false) => {
        if (!isMonitorOn) return;

        const data = interestingData[tabName];
        if (!data) return;

        // Эффект луча-развёртки при смене вкладки (CRT)
        if (crtScreen && !skipRefresh) {
            crtScreen.classList.add('beam-refresh');
            setTimeout(() => {
                crtScreen.classList.remove('beam-refresh');
            }, 300);
        }

        // Загружаем ASCII арт асинхронно
        fetch(data.url)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load ASCII');
                return res.text();
            })
            .then(text => {
                if (crtAscii && isMonitorOn) {
                    crtAscii.textContent = text;
                }
            })
            .catch(err => {
                console.error(err);
                if (crtAscii && isMonitorOn) {
                    crtAscii.textContent = '⚠️ Error loading art';
                }
            });

        if (infoTitle) infoTitle.textContent = data.title;
        if (infoText) infoText.textContent = data.text;
    };

    displayTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;

            displayTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
                t.setAttribute('tabindex', '-1');
            });

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            tab.setAttribute('tabindex', '0');

            const tabName = tab.getAttribute('data-tab');
            updateDisplayTab(tabName);
        });

        // Поддержка стрелок на клавиатуре для вкладок
        tab.addEventListener('keydown', (e) => {
            const tabsArray = Array.from(displayTabs);
            const index = tabsArray.indexOf(tab);
            let nextIndex;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                nextIndex = (index + 1) % tabsArray.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                nextIndex = (index - 1 + tabsArray.length) % tabsArray.length;
            }

            if (nextIndex !== undefined) {
                e.preventDefault();
                tabsArray[nextIndex].focus();
                tabsArray[nextIndex].click();
            }
        });
    });

    // Управление питанием монитора (кнопка Power)
    if (crtPowerBtn) {
        crtPowerBtn.addEventListener('click', () => {
            isMonitorOn = !isMonitorOn;
            if (isMonitorOn) {
                if (crtScreen) {
                    crtScreen.classList.remove('power-off');
                    crtScreen.classList.add('power-on');
                    setTimeout(() => crtScreen.classList.remove('power-on'), 600);
                }
                if (crtLed) {
                    crtLed.className = 'crt-led green';
                }
                const activeTab = document.querySelector('.display-tab.active');
                if (activeTab) {
                    const tabName = activeTab.getAttribute('data-tab');
                    updateDisplayTab(tabName, true);
                }
            } else {
                if (crtScreen) crtScreen.classList.add('power-off');
                if (crtLed) {
                    crtLed.className = 'crt-led off';
                }
            }
        });
    }

    // Обработка кнопок ОК, Отмена и Закрыть (плавный скролл наверх к Hero)
    const btnOk = document.getElementById('displayOk');
    const btnCancel = document.getElementById('displayCancel');
    const btnClose = document.getElementById('displayClose');

    const scrollToTop = () => {
        const heroSection = document.getElementById('hero');
        const scrollContainer = document.querySelector('.resume-layout');
        if (heroSection && scrollContainer) {
            isProgrammaticScroll = true;
            clearTimeout(scrollTimeout);

            // Убираем класс active у всех пунктов меню, ставим "Шапка" активным
            const menuItemsList = document.querySelectorAll('.menu-item');
            menuItemsList.forEach(i => i.classList.remove('active'));
            const heroMenuItem = document.querySelector('.menu-item[data-target="hero"]');
            if (heroMenuItem) {
                heroMenuItem.classList.add('active');
            }

            heroSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            scrollTimeout = setTimeout(() => {
                isProgrammaticScroll = false;
            }, 800);
        }
    };

    [btnOk, btnCancel, btnClose].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', scrollToTop);
        }
    });

    // Инициализация при старте
    updateDisplayTab('sport');
});
