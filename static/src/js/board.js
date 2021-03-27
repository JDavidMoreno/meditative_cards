odoo.define('meditative_cards.board', function (require) {
    "use strict";

    // var AbstractAction = require('web.AbstractAction');
    var Widget = require('web.Widget');
    var publicWidget = require('web.public.widget');
    // var core = require('web.core');
    var Session = require('web.session');
    // var QWeb = core.qweb;

    var Card = require('meditative_cards.card');

    // var _t = core._t;




    var CardsBoard = Widget.extend({
        template: "cards.Board",
        xmlDependencies:
            ['/meditative_cards/static/src/xml/cards_templates.xml']
        ,
        events: {
            'click #shuffle-cards': '_onClickShuffle',
            'click #toggle-music': '_onClickToggleMusic',
        },
        custom_events: {
            clickCard: '_onClickCard'
        },

        init: function () {
            this._super.apply(this, arguments);
            this.cardsToInitialise = 10;

            this.cards = [];
            this.messageCards = [];
        },

        start: async function () {
            this.session = Session;
            await this._super(...arguments);
            await this._renderCards();
            this.$el.find('.cards-block-deck').draggable({
                handle: '#move-cards-deck',
                containment: "window"
            });
            this.audioObject = new Audio('/meditative_cards/static/src/assets/delayde-little-spirit.mp3');
            this.audioObject.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);
        },

        _renderCards: async function () {
            let currentCard;
            if (this.cards.length === 0) {
                this.cardsContainer = this.$('.cards-container');
                for (let i = 1; i <= this.cardsToInitialise; i++) {
                    currentCard = new Card(this, {
                        variant: 'card',
                        url: `/meditative_cards/static/src/img/cards/${i}.jpg`,
                        cardsToInitialise: this.cardsToInitialise
                    })
                    this.cards.push(currentCard);
                    currentCard.appendTo(this.cardsContainer);
                }
            }
            if (this.messageCards.length === 0) {
                this.messagesContainer = this.$('.messages-container');
                for (let i = 1; i <= this.cardsToInitialise; i++) {
                    currentCard = new Card(this, {
                        variant: 'message',
                        url: `/meditative_cards/static/src/img/messages/${i}.jpg`,
                        cardsToInitialise: this.cardsToInitialise
                    })
                    this.messageCards.push(currentCard);
                    currentCard.appendTo(this.messagesContainer);
                }
            }
        },

        _onClickShuffle: function (e) {
            e.preventDefault();
            let card;
            for (card of this.cards) {
                card.resetDisplay();
            }
            for (card of this.messageCards) {
                card.resetDisplay();
            }
        },

        _onClickToggleMusic: function (e) {
            e.preventDefault();
            const toggleButton = this.$el.find('#toggle-music');
            if (toggleButton.hasClass('fa-volume-off')) {
                toggleButton.removeClass('fa-volume-off').addClass('fa-volume-up');
                this.audioObject.play();
            } else {
                toggleButton.removeClass('fa-volume-up').addClass('fa-volume-off');
                this.audioObject.pause();
            }
        },

        destroy: function () {
            this.audioObject.pause();
            delete this.audioObject;
            return this._super.apply(this, arguments);
        }

    });

    publicWidget.registry.baseCardBoard = publicWidget.Widget.extend({
        selector: '#cards-board',

        start: function () {
            this._super.apply(this, arguments);
            const cardsBoardWidget = new CardsBoard();
            cardsBoardWidget.appendTo(this.$el);
        }

    });

    // core.action_registry.add('meditative_cards', CardsBoard);
    return {
        CardsBoard: CardsBoard,
        BaseCardBoard: publicWidget.registry.baseCardBoard
    }

});
