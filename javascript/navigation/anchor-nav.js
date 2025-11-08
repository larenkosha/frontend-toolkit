/**
 * anchorNav.js - Anchor Navigation Plugin
 * 
 * #nav #jquery #smooth-scroll #anchors
 * 
 * Плавная навигация по якорям с автоподсветкой
 * 
 * version 1.0.0
 * author [larenkosha]
 * 
 * example
 * // HTML
 * <div class="component"></div>
 * 
 * // JavaScript
 * $('.component').componentName({
 *     option: value
 * });
 * 
 * param {Object} options - Настройки компонента
 * param {number} options.speed - Скорость анимации
 * param {boolean} options.autoInit - Автоинициализация
 * 
 * returns {jQuery}
 */

(function($) {
    'use strict';
    
    $.prototype.anchorNav = function (options = {}) {
        // Настройки по умолчанию
        const settings = $.extend({
            scrollSpeed: 500,
            offset: 'header',
            extraOffset: 30,
            highlightOnScroll: false,
            activeClass: 'active',
            scrollBehavior: 'smooth',
            headerSelector: 'header',
            anchorSelector: '.anchor-link' // Селектор для всех якорных ссылок
        }, options);

        // Основная функция инициализации для каждого контейнера
        const initAnchorNav = ($container) => {
            // Объявляем переменные для таймеров
            let scrollTimeout;
            let resizeTimeout;

            // ===== ФУНКЦИЯ ДЛЯ РАСЧЕТА ДИНАМИЧЕСКОГО ОТСТУПА =====
            const calculateOffset = () => {
                if (typeof settings.offset === 'number') {
                    return settings.offset; // Возвращаем фиксированный отступ
                }
                
                // Если offset = 'header' или указан селектор
                const selector = settings.offset === 'header' ? settings.headerSelector : settings.offset;
                const $header = $(selector);
                
                if ($header.length) {
                    const headerHeight = $header.outerHeight() || 0;
                    return headerHeight + settings.extraOffset; // Высота хедера + доп. отступ
                }
                
                return settings.extraOffset; // Fallback
            };

            // ===== ОБРАБОТЧИК КЛИКА ПО ЯКОРЮ ВНУТРИ КОНТЕЙНЕРА =====
            $container.on('click', settings.anchorSelector, function(e) {
                e.preventDefault(); // Отменяем стандартное поведение ссылки
                
                const $link = $(this);
                const anchorId = $link.data('anchor'); // Получаем ID секции из data-атрибута
                const $targetSection = $('#' + anchorId); // Находим целевую секцию
                
                if ($targetSection.length) {
                    scrollToSection($targetSection, $link); // Прокручиваем к секции
                }
            });

            // ===== ФУНКЦИЯ ПЛАВНОЙ ПРОКРУТКИ К СЕКЦИИ =====
            const scrollToSection = ($section, $clickedLink = null) => {
                const currentOffset = calculateOffset(); // Рассчитываем текущий отступ
                const targetPosition = $section.offset().top - currentOffset; // Позиция с учетом отступа
                
                if (settings.scrollBehavior === 'smooth') {
                    // Плавная анимация прокрутки
                    $('html, body').animate({
                        scrollTop: targetPosition
                    }, settings.scrollSpeed);
                } else {
                    // Мгновенная прокрутка
                    $('html, body').scrollTop(targetPosition);
                }
                
                // Если кликнули по ссылке - обновляем активное состояние
                if ($clickedLink) {
                    updateActiveLink($clickedLink);
                }
            };

            // ===== ОБНОВЛЕНИЕ АКТИВНОЙ ССЫЛКИ (РАБОТАЕТ СО ВСЕМИ ССЫЛКАМИ НА СТРАНИЦЕ) =====
            const updateActiveLink = ($activeLink) => {
                // Снимаем активный класс со ВСЕХ якорных ссылок на странице
                $(settings.anchorSelector).removeClass(settings.activeClass);
                // Добавляем только к текущей активной ссылке
                $activeLink.addClass(settings.activeClass);
            };

            // ===== ОБРАБОТЧИК СКРОЛЛА ДЛЯ АВТОПОДСВЕТКИ =====
            const handleScrollHighlight = () => {
                const currentOffset = calculateOffset(); // Текущий отступ
                const scrollPos = $(window).scrollTop() + currentOffset; // Позиция скролла с отступом
                let currentActive = null; // Текущая активная ссылка
                let smallestDistance = Infinity; // Минимальное расстояние до секции

                // Перебираем ВСЕ якорные ссылки на странице
                $(settings.anchorSelector).each(function() {
                    const $link = $(this);
                    const anchorId = $link.data('anchor');
                    const $section = $('#' + anchorId);
                    
                    if ($section.length) {
                        const sectionTop = $section.offset().top; // Позиция секции
                        const distance = Math.abs(sectionTop - scrollPos); // Расстояние до секции
                        
                        // Находим ближайшую секцию выше текущей позиции скролла
                        if (distance < smallestDistance && scrollPos >= sectionTop - 50) {
                            smallestDistance = distance;
                            currentActive = $link;
                        }
                    }
                });

                // Если нашли активную ссылку и она еще не активна - обновляем
                if (currentActive && !currentActive.hasClass(settings.activeClass)) {
                    updateActiveLink(currentActive);
                }
            };

            // ===== ДЕБАУНС ДЛЯ СКРОЛЛА (оптимизация производительности) =====
            const debouncedScroll = () => {
                clearTimeout(scrollTimeout); // Сбрасываем предыдущий таймер
                scrollTimeout = setTimeout(handleScrollHighlight, 50); // Запускаем новый через 50мс
            };

            // ===== ДЕБАУНС ДЛЯ РЕСАЙЗА =====
            const debouncedResize = () => {
                clearTimeout(resizeTimeout); // Сбрасываем предыдущий таймер
                resizeTimeout = setTimeout(() => {
                    // При ресайзе обновляем подсветку если включена автоподсветка
                    if (settings.highlightOnScroll) {
                        handleScrollHighlight();
                    }
                }, 100); // Ждем 100мс после окончания ресайза
            };

            // ===== ИНИЦИАЛИЗАЦИЯ АВТОПОДСВЕТКИ ЕСЛИ ВКЛЮЧЕНА =====
            if (settings.highlightOnScroll) {
                $(window).on('scroll.anchorNav', debouncedScroll); // Вешаем обработчик скролла
                setTimeout(handleScrollHighlight, 100); // Инициализируем начальное состояние
            }

            // ===== СЛУШАЕМ РЕСАЙЗ ДЛЯ ПЕРЕСЧЕТА ВЫСОТЫ ХЕДЕРА =====
            $(window).on('resize.anchorNav', debouncedResize);

            // ===== СОХРАНЯЕМ НАСТРОЙКИ И ОБРАБОТЧИКИ ДЛЯ УПРАВЛЕНИЯ =====
            $container.data('anchorNav-settings', settings);
            $container.data('anchorNav-handlers', {
                scrollHandler: debouncedScroll,
                resizeHandler: debouncedResize,
                calculateOffset: calculateOffset
            });
        };

        // Инициализируем плагин для каждого выбранного элемента
        return this.each(function() {
            initAnchorNav($(this));
        });
    };

    /**
     * МЕТОД ДЛЯ ОБНОВЛЕНИЯ ОПЦИЙ ПОСЛЕ ИНИЦИАЛИЗАЦИИ
     */
    $.prototype.anchorNav.update = function (newOptions) {
        return this.each(function() {
            const $el = $(this);
            const currentSettings = $el.data('anchorNav-settings') || {};
            const handlers = $el.data('anchorNav-handlers');
            
            // Обновляем настройки
            const settings = $.extend({}, currentSettings, newOptions);
            $el.data('anchorNav-settings', settings);
            
            // Если изменилась опция highlightOnScroll - обновляем обработчики
            if (handlers && currentSettings.highlightOnScroll !== settings.highlightOnScroll) {
                if (settings.highlightOnScroll) {
                    // Включаем автоподсветку
                    $(window).on('scroll.anchorNav', handlers.scrollHandler);
                    setTimeout(handlers.scrollHandler, 100);
                } else {
                    // Выключаем автоподсветку
                    $(window).off('scroll.anchorNav', handlers.scrollHandler);
                    $(settings.anchorSelector).removeClass(settings.activeClass);
                }
            }
        });
    };

    /**
     * МЕТОД ДЛЯ ПРИНУДИТЕЛЬНОГО ПЕРЕСЧЕТА ОТСТУПОВ
     * (полезно когда хедер изменился программно)
     */
    $.prototype.anchorNav.recalculate = function () {
        return this.each(function() {
            const $el = $(this);
            const handlers = $el.data('anchorNav-handlers');
            if (handlers && handlers.calculateOffset) {
                // Просто вызываем функцию для обновления кэшированных значений
                handlers.calculateOffset();
            }
        });
    };

    /**
     * МЕТОД ДЛЯ УНИЧТОЖЕНИЯ ПЛАГИНА И ОЧИСТКИ РЕСУРСОВ
     */
    $.prototype.anchorNav.destroy = function () {
        return this.each(function() {
            const $el = $(this);
            const handlers = $el.data('anchorNav-handlers');
            
            if (handlers) {
                // Удаляем обработчики событий
                $(window).off('scroll.anchorNav', handlers.scrollHandler);
                $(window).off('resize.anchorNav', handlers.resizeHandler);
            }
            
            // Удаляем обработчики кликов и данные
            $el.off('click', '.anchor-link');
            $el.removeData('anchorNav-settings');
            $el.removeData('anchorNav-handlers');
            $(settings.anchorSelector).removeClass('active');
        });
    };

    // ===== ГЛОБАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ ДЛЯ ВСЕХ ANCHOR-LINK НА СТРАНИЦЕ =====
    $.anchorNavInit = function(options = {}) {
        const settings = $.extend({
            scrollSpeed: 500,
            offset: 'header',
            extraOffset: 30,
            highlightOnScroll: true,
            activeClass: 'active',
            scrollBehavior: 'smooth',
            headerSelector: 'header'
        }, options);

        // Объявляем переменные для таймеров
        let scrollTimeout;
        let resizeTimeout;

        // ===== ФУНКЦИЯ ДЛЯ РАСЧЕТА ДИНАМИЧЕСКОГО ОТСТУПА =====
        const calculateOffset = () => {
            if (typeof settings.offset === 'number') {
                return settings.offset;
            }
            
            const selector = settings.offset === 'header' ? settings.headerSelector : settings.offset;
            const $header = $(selector);
            
            if ($header.length) {
                const headerHeight = $header.outerHeight() || 0;
                return headerHeight + settings.extraOffset;
            }
            
            return settings.extraOffset;
        };

        // ===== ОБРАБОТЧИК КЛИКА ПО ЛЮБОМУ ANCHOR-LINK НА СТРАНИЦЕ =====
        $(document).on('click', '.anchor-link', function(e) {
            e.preventDefault();
            
            const $link = $(this);
            const anchorId = $link.data('anchor');
            const $targetSection = $('#' + anchorId);
            
            if ($targetSection.length) {
                const currentOffset = calculateOffset();
                const targetPosition = $targetSection.offset().top - currentOffset;
                
                if (settings.scrollBehavior === 'smooth') {
                    $('html, body').animate({
                        scrollTop: targetPosition
                    }, settings.scrollSpeed);
                } else {
                    $('html, body').scrollTop(targetPosition);
                }
                
                // Обновляем активную ссылку
                $('.anchor-link').removeClass(settings.activeClass);
                $link.addClass(settings.activeClass);
            }
        });

        // ===== ОБРАБОТЧИК СКРОЛЛА ДЛЯ АВТОПОДСВЕТКИ =====
        const handleScrollHighlight = () => {
            const currentOffset = calculateOffset();
            const scrollPos = $(window).scrollTop() + currentOffset;
            let currentActive = null;
            let smallestDistance = Infinity;

            $('.anchor-link').each(function() {
                const $link = $(this);
                const anchorId = $link.data('anchor');
                const $section = $('#' + anchorId);
                
                if ($section.length) {
                    const sectionTop = $section.offset().top;
                    const distance = Math.abs(sectionTop - scrollPos);
                    
                    if (distance < smallestDistance && scrollPos >= sectionTop - 50) {
                        smallestDistance = distance;
                        currentActive = $link;
                    }
                }
            });

            if (currentActive && !currentActive.hasClass(settings.activeClass)) {
                $('.anchor-link').removeClass(settings.activeClass);
                currentActive.addClass(settings.activeClass);
            }
        };

        // ===== ДЕБАУНС ДЛЯ СКРОЛЛА =====
        const debouncedScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScrollHighlight, 50);
        };

        // ===== ДЕБАУНС ДЛЯ РЕСАЙЗА =====
        const debouncedResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleScrollHighlight, 100);
        };

        // ===== ИНИЦИАЛИЗАЦИЯ АВТОПОДСВЕТКИ ЕСЛИ ВКЛЮЧЕНА =====
        if (settings.highlightOnScroll) {
            $(window).on('scroll.anchorNavGlobal', debouncedScroll);
            $(window).on('resize.anchorNavGlobal', debouncedResize);
            setTimeout(handleScrollHighlight, 100); // Начальная инициализация
        }

        // ===== СОХРАНЯЕМ ГЛОБАЛЬНЫЕ ОБРАБОТЧИКИ =====
        $.data(document, 'anchorNavGlobal', {
            settings: settings,
            handlers: {
                scrollHandler: debouncedScroll,
                resizeHandler: debouncedResize
            }
        });
    };

    // ===== АВТОМАТИЧЕСКАЯ ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ДОКУМЕНТА =====
    // $(document).ready(function() {
    //     // Вариант 1: Для конкретного контейнера
    //     $('.anchors-links').anchorNav({
    //         highlightOnScroll: true,
    //         activeClass: 'anchor-active'
    //     });

    //     // Вариант 2: Глобально для ВСЕХ anchor-link на странице
    //     $.anchorNavInit({
    //         highlightOnScroll: true,
    //         activeClass: 'anchor-active'
    //     });
    // });

})(jQuery);