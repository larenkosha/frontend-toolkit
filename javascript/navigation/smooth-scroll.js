/**
 * Smooth Scroll Plugin
 * #jquery #nav #smoothscroll #smooth #scroll
 * 
 * Базовый модуль для плавного скролла к элементам или позициям
 * 
 * version 1.0.0
 * author Larenkosha
 */

(function($) {
    'use strict';
    
    // Настройки по умолчанию
    const defaults = {
        speed: 500,
        offset: false,        // false | число | селектор
        extraOffset: 0,
        easing: 'swing',
        addClass: false,      // false | строка (класс для целевого элемента ПОСЛЕ скролла)
        removeClass: false    // false | строка (класс для удаления с целевого элемента ПОСЛЕ скролла)
    };

    // Функция для расчета динамического отступа
    const calculateOffset = (settings) => {
        // Если offset отключен или 0
        if (settings.offset === false || settings.offset === 0) {
            return settings.extraOffset;
        }
        
        // Если offset - число
        if (typeof settings.offset === 'number') {
            return settings.offset + settings.extraOffset;
        }
        
        // Если offset - селектор (ищем элемент)
        if (typeof settings.offset === 'string') {
            const $offsetElement = $(settings.offset);
            if ($offsetElement.length) {
                const offsetHeight = $offsetElement.outerHeight() || 0;
                return offsetHeight + settings.extraOffset;
            }
        }
        
        // Fallback
        return settings.extraOffset;
    };

    // Функция плавного скролла к позиции
    const smoothScrollToPosition = (position, settings, $targetElement) => {
        return new Promise((resolve) => {
            $('html, body').animate(
                {
                    scrollTop: position
                },
                {
                    duration: settings.speed,
                    easing: settings.easing,
                    complete: function() {
                        // Применяем классы ПОСЛЕ завершения скролла
                        if (settings.addClass && $targetElement) {
                            $targetElement.addClass(settings.addClass);
                        }
                        if (settings.removeClass && $targetElement) {
                            $targetElement.removeClass(settings.removeClass);
                        }
                        resolve();
                    }
                }
            );
        });
    };

    // jQuery утилита: $.smoothScrollTo()
    $.smoothScrollTo = function(target, options = {}) {
        const settings = $.extend({}, defaults, options);
        
        // Если target - число → скролл к позиции
        if (typeof target === 'number') {
            smoothScrollToPosition(target, settings, null);
            return $(); // Возвращаем пустой jQuery объект
        }
        
        // Если target - строка → ищем элемент
        if (typeof target === 'string') {
            const $element = $(target);
            if (!$element.length) {
                console.warn(`SmoothScroll: элемент "${target}" не найден`);
                return $(); // Возвращаем пустой jQuery объект
            }
            return $element.smoothScrollTo(settings);
        }
        
        // Если target - jQuery объект или DOM элемент
        if (target.jquery || target.nodeType) {
            return $(target).smoothScrollTo(settings);
        }
        
        return $(); // Fallback
    };

    // jQuery метод: $(element).smoothScrollTo()
    $.fn.smoothScrollTo = function(options = {}) {
        const settings = $.extend({}, defaults, options);
        const $elements = this;
        
        // Если нет элементов - возвращаем this для чейнинга
        if (!$elements.length) {
            return this;
        }
        
        // Для каждого элемента в наборе
        return this.each(function() {
            const $element = $(this);
            const currentOffset = calculateOffset(settings);
            const targetPosition = $element.offset().top - currentOffset;
            
            // Выполняем скролл
            smoothScrollToPosition(targetPosition, settings, $element);
        });
    };
    
})(jQuery);