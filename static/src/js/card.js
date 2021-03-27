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
            this.$cardsToInitialise = options.cardsToInitialise;
            this.rotation = this._getRotation();
            this.zIndex = this.getRandomInt(0, this.$cardsToInitialise);
            this._super.apply(this, arguments);
        },

        start: function () {
            this._super.apply(this, arguments);
            // this.$el.draggable();
            this.$card = this.$el.find('.meditative-card');
            this.$card.draggable();
            this.isCardFlipped = false;
            this.originalTopPosition = this.$card.position().top;
            this.originalLeftPosition = this.$card.position().left;
        },

        _getRotation: function () {
            const num = Math.random() * 10;
            return (parseInt(num) % 2 === 0 ? '+' : '-') + num.toString();
        },

        getRandomInt: function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        resetDisplay: function () {
            this._flipCard(true);
            this.$card.css({
                'transition': 'all 0.4s linear',
                'top': this.originalTopPosition + 'px',
                'left': this.originalLeftPosition + 'px',
                'transform': 'rotate(' + this._getRotation() + 'deg)',
                'z-index': this.getRandomInt(0, this.$cardsToInitialise)
            });
            setTimeout(() => {
                this.$card.css({
                    'transition': '', // Just apply the transition for the shuffleling, but remove a moment later
                })
            }, 400);
        },

        _flipCard: function (reset=false) {
            if (reset && !this.isCardFlipped) {
                return // It's already flipped down
            }
            const front = this.$card.children('img.front'), back = this.$card.children('img.back');
            this.$card.addClass('card-flip-shadow');
            this.$card.children(':last-child').css('opacity', 0.8);
            this.$card.css('width', 0);
            setTimeout(() => {
                this.$card.removeClass('card-flip-shadow');
                if (reset || front.css('display') == 'block') {
                    front.css('display', 'none');
                    back.css('display', 'block');
                    this.isCardFlipped = false;
                } else {
                    front.css('display', 'block');
                    back.css('display', 'none');
                    this.isCardFlipped = true;
                }
                this.$card.children(':first-child').css('visibility', 'visible');
                this.$card.css('width', ''); // Remove the width in the element and use the one from the class
                this.$card.children(':last-child').css('opacity', 0)
            }, 0.4 * 1000);
            this.flipped = true;
        },

        _onClickCard: function (e) {
            this._flipCard();
            // this.$el.find('img').css('visibility', 'initial');
            // this.triggerUp('clickCard', {
            //     id: e.target.dataset.cardId,
            //     variant: this.variant
            // });
        },

    });

    return Card
});
