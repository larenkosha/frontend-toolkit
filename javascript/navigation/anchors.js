/**
 * Anchor Navigation Plugin
 * #nav #jquery #smooth-scroll #anchors
 * 
 * Плавная навигация по якорям с автоподсветкой для групп ссылок
 * Использует smooth-scroll.js как базовый модуль
 * 
 * version: 1.0.0
 * author: Larenkosha
 */

(function($) {
    'use strict';
    
    // Настройки по умолчанию
    const defaults = {
        // Селекторы
        linkSelector: 'a',
        anchorAttribute: 'anchor',
        
        // Наследуем от smooth-scroll
        speed: 500,
        offset: false,
        extraOffset: 0,
        easing: 'swing',
        
        // Уникальные для anchors
        highlightOnScroll: true,
        activeClass: 'active',
        scrollBehavior: 'smooth'
    };

    // Основной плагин
    $.fn.anchors = function(options = {}) {
        const settings = $.extend({}, defaults, options);
        
        return this.each(function() {
            const $container = $(this);
            const $links = $container.find(settings.linkSelector);
            let scrollTimeout;
            
            // Функция обновления активной ссылки
            const updateActiveLink = ($activeLink) => {
                $links.removeClass(settings.activeClass);
                $activeLink.addClass(settings.activeClass);
            };
            
            // Обработчик клика по ссылке
            $links.on('click.anchors', function(e) {
                e.preventDefault();
                
                const $link = $(this);
                const anchorId = $link.data(settings.anchorAttribute);
                const $targetSection = $('#' + anchorId);
                
                if ($targetSection.length) {
                    // Используем smooth-scroll для плавного скролла
                    if (settings.scrollBehavior === 'smooth') {
                        $targetSection.smoothScrollTo({
                            speed: settings.speed,
                            offset: settings.offset,
                            extraOffset: settings.extraOffset,
                            easing: settings.easing
                        });
                    } else {
                        // Мгновенный скролл
                        const currentOffset = calculateOffset(settings);
                        const targetPosition = $targetSection.offset().top - currentOffset;
                        $('html, body').scrollTop(targetPosition);
                    }
                    
                    updateActiveLink($link);
                }
            });
            
            // Функция для расчета offset (аналогичная smooth-scroll)
            const calculateOffset = (settings) => {
                if (settings.offset === false || settings.offset === 0) {
                    return settings.extraOffset;
                }
                
                if (typeof settings.offset === 'number') {
                    return settings.offset + settings.extraOffset;
                }
                
                if (typeof settings.offset === 'string') {
                    const $offsetElement = $(settings.offset);
                    if ($offsetElement.length) {
                        const offsetHeight = $offsetElement.outerHeight() || 0;
                        return offsetHeight + settings.extraOffset;
                    }
                }
                
                return settings.extraOffset;
            };
            
            // Автоподсветка при скролле
            if (settings.highlightOnScroll) {
                const handleScrollHighlight = () => {
                    const currentOffset = calculateOffset(settings);
                    const scrollPos = $(window).scrollTop() + currentOffset;
                    let currentActive = null;
                    let smallestDistance = Infinity;

                    $links.each(function() {
                        const $link = $(this);
                        const anchorId = $link.data(settings.anchorAttribute);
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
                        updateActiveLink(currentActive);
                    }
                };

                const debouncedScroll = () => {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(handleScrollHighlight, 50);
                };

                $(window).on('scroll.anchors', debouncedScroll);
                setTimeout(handleScrollHighlight, 100);
            }
        });
    };
    
})(jQuery);