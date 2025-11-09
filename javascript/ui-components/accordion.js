/**
 * Accordion
 * #jquery #ui #ui-components #uicomponents #accordion
 * 
 * Обычный аккореон с вариациями мульти
 * 
 * version: 1.0.0
 * author: Larenkosha
 */

(function($) {
    'use strict';

    $.fn.accordion = function(options = {}) {
        const settings = $.extend({
            // Селекторы
            itemSelector: '.accordion-item',
            headSelector: '.accordion-head',
            triggerSelector: null, // Селектор триггера внутри head (например, .accordion-arrow)
            // Поведение
            multiple: null, // null - автоопределение по классу .multiple
            startOpen: false, // false - автоопределение по активным items
            activeClass: 'active',
            // События
            onOpen: null,
            onClose: null
        }, options);

        return this.each(function() {
            const $accordion = $(this);
            const $items = $accordion.find(settings.itemSelector);
            
            // Автоопределение multiple
            const isMultiple = settings.multiple !== null ? 
                settings.multiple : $accordion.hasClass('multiple');
            
            // Автоопределение startOpen
            const shouldStartOpen = settings.startOpen !== false ? 
                settings.startOpen : $items.hasClass(settings.activeClass);
            
            // Инициализация начального состояния
            if (!shouldStartOpen) {
                $items.removeClass(settings.activeClass);
            } else if (!isMultiple) {
                // В одиночном режиме оставляем только первый активный
                $items.removeClass(settings.activeClass).first().addClass(settings.activeClass);
            }
            
            // Определяем селектор для клика
            const clickSelector = settings.triggerSelector ? 
                settings.headSelector + ' ' + settings.triggerSelector : 
                settings.headSelector;

            $accordion.on('click.accordion', clickSelector, function(e) {
                e.preventDefault();
                e.stopPropagation(); // Чтобы не срабатывало на родителе
                
                const $trigger = $(this);
                const $head = settings.triggerSelector ? 
                    $trigger.closest(settings.headSelector) : $trigger;
                const $item = $head.closest(settings.itemSelector);
                const wasActive = $item.hasClass(settings.activeClass);

                // Множественное открытие
                if (isMultiple) {
                    $item.toggleClass(settings.activeClass);
                    
                    if (!$item.hasClass(settings.activeClass) && wasActive) {
                        settings.onClose?.($item, $head, $trigger);
                    } else if ($item.hasClass(settings.activeClass) && !wasActive) {
                        settings.onOpen?.($item, $head, $trigger);
                    }
                } 
                // Одиночное открытие
                else {
                    // Если кликаем по уже активному - закрываем
                    if (wasActive) {
                        $item.removeClass(settings.activeClass);
                        settings.onClose?.($item, $head, $trigger);
                    } else {
                        // Закрываем все и открываем текущий
                        $items.removeClass(settings.activeClass);
                        settings.onClose?.($items.filter('.' + settings.activeClass), $head, $trigger);
                        
                        $item.addClass(settings.activeClass);
                        settings.onOpen?.($item, $head, $trigger);
                    }
                }
            });
        });
    };

})(jQuery);