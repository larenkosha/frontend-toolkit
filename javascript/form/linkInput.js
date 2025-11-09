/**
 * Link Input Plugin
 * #jquery #label #radio #checkbox #file
 * 
 * Автоматически связывает inputs с labels по структурным паттернам
 * 
 * version: 1.0.0
 * author: Larenkosha
 */

(function($) {
    'use strict';

    $.fn.linkInput = function(options = {}) {
        const settings = $.extend({
            inputTypes: ['checkbox', 'radio'],
            idPrefix: 'input-',
            processedAttr: 'data-linked'
        }, options);

        return this.each(function() {
            const $container = $(this);
            
            const inputSelector = settings.inputTypes.map(type => 
                `input[type="${type}"]:not([id]):not([${settings.processedAttr}])`
            ).join(', ');
            
            const $inputs = $container.find(inputSelector);
            
            $inputs.each(function() {
                const $input = $(this);
                if ($input.attr(settings.processedAttr)) return;
                
                const uniqueId = settings.idPrefix + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
                
                let $foundLabel = null;
                
                // Паттерн 1: input уже внутри label
                $foundLabel = $input.closest('label');
                
                // Паттерн 2: input + следующий label (основной случай)
                if (!$foundLabel.length) {
                    $foundLabel = $input.next('label');
                }
                
                // Паттерн 3: Родительская обёртка
                if (!$foundLabel.length) {
                    const $parent = $input.parent();
                    if ($parent.is('.radio-button, .checkbox-button, .input-wrapper')) {
                        $foundLabel = $parent.find('label').first();
                    }
                }
                
                // Связываем
                this.id = uniqueId;
                
                if ($foundLabel.length && !$foundLabel.attr('for')) {
                    $foundLabel.attr('for', uniqueId);
                    $foundLabel.css('cursor', 'pointer');
                }
                
                $input.attr(settings.processedAttr, 'true');
            });
        });
    };
    
})(jQuery);