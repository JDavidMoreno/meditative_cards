odoo.define('meditative_cards.card', function (require) {
    "use strict";

    var Widget = require('web.Widget');


    var Card = Widget.extend({
        template: 'cards.Card',
        events: {
            'click .meditative-card': '_onClickCard',
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
        },

        _getRotation: function () {
            const num = Math.random() * 10;
            return (parseInt(num) % 2 === 0 ? '+' : '-') + num.toString();
        },

        _onClickCard: function (e) {
            this.triggerUp('clickCard', {
                id: e.target.dataset.cardId,
                variant: this.variant
            });
        },

    });

    return Card
});
