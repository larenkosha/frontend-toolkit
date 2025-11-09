/**
 * [Название компонента]
 * [теги]
 * 
 * [Краткое описание назначения]
 * 
 * version: 1.0.0
 * author: Larenkosha
 */

(function($) {
    'use strict';

    $.prototype.componentName = function(options = {}) {
        const settings = $.extend({
            speed: 300,
            autoInit: true
        }, options);
        
        // Код компонента...
        
        return this;
    };
})(jQuery);