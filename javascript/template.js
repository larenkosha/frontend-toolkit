/**
 * [Название компонента]
 * 
 * [Краткое описание назначения]
 * 
 * @version 1.0.0
 * @author [Ваше имя]
 * 
 * @example
 * // HTML
 * <div class="component"></div>
 * 
 * // JavaScript
 * $('.component').componentName({
 *     option: value
 * });
 * 
 * @param {Object} options - Настройки компонента
 * @param {number} options.speed - Скорость анимации
 * @param {boolean} options.autoInit - Автоинициализация
 * 
 * @returns {jQuery}
 */

$.prototype.componentName = function(options = {}) {
    const settings = $.extend({
        speed: 300,
        autoInit: true
    }, options);
    
    // Код компонента...
    
    return this;
};