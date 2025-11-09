/**
 * Scroll To Plugin
 * #jquery #nav #scroll #smooth-scroll #smoothScroll  #scrollto #scrollTo #scrolltop #scrollTop
 * 
 * Универсальные одиночные ссылки для скролла в любом направлении
 * Использует smooth-scroll.js для плавного скролла
 * 
 * version: 1.0.0
 * author: Larenkosha
 */

(function($) {
    'use strict';
    
    // Проверяем что smooth-scroll.js загружен
    if (typeof $.fn.smoothScrollTo === 'undefined') {
        console.error('scroll-to.js: smooth-scroll.js не загружен!');
        return;
    }
    
    // Настройки по умолчанию
    const defaults = {
        // Селекторы и атрибуты
        targetAttribute: 'target',      // data-target
        scrollToTopClass: 'scroll-top', // Класс для кнопки "наверх"
        
        // Наследуем от smooth-scroll
        speed: 500,
        offset: false,
        extraOffset: 0,
        easing: 'swing',
        
        // Уникальные для scroll-to
        scrollBehavior: 'smooth',
        addClass: false,               // Класс для добавления после скролла
        removeClass: false             // Класс для удаления после скролла
    };

    // Функция определения типа target
    const parseTarget = (targetValue) => {
        // Если число - это позиция в пикселях
        if (!isNaN(targetValue) && targetValue !== '') {
            return Number(targetValue);
        }
        
        // Если 'top' или '0' - скролл наверх
        if (targetValue === 'top' || targetValue === '0') {
            return 0;
        }
        
        // Если строка начинается с # или . - это селектор
        if (typeof targetValue === 'string' && (targetValue.startsWith('#') || targetValue.startsWith('.'))) {
            return targetValue;
        }
        
        // Если просто строка - предполагаем что это ID
        if (typeof targetValue === 'string' && targetValue !== '') {
            return '#' + targetValue;
        }
        
        return null;
    };

    // Основной плагин
    $.fn.scrollTo = function(options = {}) {
        const settings = $.extend({}, defaults, options);
        
        return this.each(function() {
            const $link = $(this);
            
            // Обработчик клика
            $link.on('click.scrollTo', function(e) {
                e.preventDefault();
                
                const targetValue = $link.data(settings.targetAttribute);
                const parsedTarget = parseTarget(targetValue);
                
                if (parsedTarget === null) {
                    console.warn('scroll-to: неверный target:', targetValue);
                    return;
                }
                
                // Скролл к позиции (число)
                if (typeof parsedTarget === 'number') {
                    if (settings.scrollBehavior === 'smooth') {
                        $.smoothScrollTo(parsedTarget, {
                            speed: settings.speed,
                            offset: settings.offset,
                            extraOffset: settings.extraOffset,
                            easing: settings.easing
                        });
                    } else {
                        $('html, body').scrollTop(parsedTarget);
                    }
                    return;
                }
                
                // Скролл к элементу (селектор)
                const $targetElement = $(parsedTarget);
                if (!$targetElement.length) {
                    console.warn('scroll-to: элемент не найден:', parsedTarget);
                    return;
                }
                
                if (settings.scrollBehavior === 'smooth') {
                    $targetElement.smoothScrollTo({
                        speed: settings.speed,
                        offset: settings.offset,
                        extraOffset: settings.extraOffset,
                        easing: settings.easing,
                        addClass: settings.addClass,
                        removeClass: settings.removeClass
                    });
                } else {
                    $.smoothScrollTo($targetElement, {
                        speed: 0, // Мгновенно
                        offset: settings.offset,
                        extraOffset: settings.extraOffset,
                        addClass: settings.addClass,
                        removeClass: settings.removeClass
                    });
                }
            });
        });
    };
    
    // Глобальная инициализация для кнопки "наверх"
    $.scrollToInit = function(options = {}) {
        const settings = $.extend({}, defaults, options);
        
        // Инициализируем все элементы с классом scroll-to
        $('.scroll-to').scrollTo(settings);
        
        // Специальная обработка для кнопки "наверх"
        $(settings.scrollToTopClass).scrollTo({
            targetAttribute: settings.targetAttribute,
            scrollBehavior: settings.scrollBehavior,
            speed: settings.speed,
            offset: settings.offset,
            extraOffset: settings.extraOffset,
            easing: settings.easing
        });
    };
    
})(jQuery);