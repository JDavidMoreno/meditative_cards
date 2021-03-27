odoo.define('meditative_cards.card', function (require) {
    "use strict";

    var Widget = require('web.Widget');


    var Card = Widget.extend({
        template: 'cards.Card',
        events: {
            'dblclick .meditative-card': '_onClickCard',
        },

        init: function (parent, options) {
            this.parent = parent;
            this.variant = options.variant;
            this.url = options.url;
            this.rotation = this._getRotation();
            this._super.apply(this, arguments);
        },

        start: function () {
            this._super.apply(this, arguments);
            this.$el.draggable();
        },

        _getRotation: function () {
            const num = Math.random() * 10;
            return (parseInt(num) % 2 === 0 ? '+' : '-') + num.toString();
        },

        _flipCard: function (card) {
            const front = card.children('img.front'), back = card.children('img.back');
            card.addClass('card-flip-shadow');
            card.children(':last-child').css('opacity', 0.8);
            card.css('width', 0);
            setTimeout(() => {
                card.removeClass('card-flip-shadow');
                front.css('display') == 'none' ? front.css('display', 'block') : front.css('display', 'none');
                back.css('display') == 'none' ? back.css('display', 'block') : back.css('display', 'none');
                card.children(':first-child').css('visibility', 'visible');
                card.css('width', ''); // Remove the width in the element and use the one from the class
                card.children(':last-child').css('opacity', 0)
            }, 0.4 * 1000);
            this.flipped = true;
        },

        _onClickCard: function (e) {
            this._flipCard(this.$el.find('.meditative-card'));
            // this.$el.find('img').css('visibility', 'initial');
            // this.triggerUp('clickCard', {
            //     id: e.target.dataset.cardId,
            //     variant: this.variant
            // });
        },

    });

    return Card
});
