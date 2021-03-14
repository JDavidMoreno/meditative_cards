odoo.define('meditative_cards.board', function (require) {
    "use strict";

    // var AbstractAction = require('web.AbstractAction');
    var Widget = require('web.Widget');
    var publicWidget = require('web.public.widget');
    // var core = require('web.core');
    // var Session = require('web.session');
    // var QWeb = core.qweb;

    var Card = require('meditative_cards.card');

    // var _t = core._t;




    var CardsBoard = Widget.extend({
        template: "cards.Board",
        xmlDependencies:
            ['/meditative_cards/static/src/xml/cards_templates.xml']
        ,
        events: {
            'click .shuffle-cards': '_onClickShuffle',
        },
        custom_events: {
            clickCard: '_onClickCard'
        },

        init: function () {
            this._super.apply(this, arguments);
            this.isVerticalScreen = true;
            this.cardsToInitialise = 10;

            this.cards = [];
            this.messageCards = [];

            // if (window.innerHeight >= window.innerWidth) {
            //     this.isVerticalScreen = true;
            // }
        },

        start: async function () {
            // this.session = Session;
            await this._super(...arguments);
            await this._renderCards();
        },

        _renderCards: async function () {
            let currentCard;
            if (!this.cards) {
                const cardsContainer = this.$('.cards-container');
                for (let i = 1; i <= this.cardsToInitialise; i++) {
                    currentCard = new Card(this, {
                        variant: 'card',
                        url: `/meditative_cards/static/src/img/cards/${i}`
                    })
                    this.cards.push(currentCard);
                    currentCard.appendTo(cardsContainer);
                }
            }
            if (!this.messageCards) {
                const messagesContainer = this.$('.messages-container');
                for (let i = 1; i <= this.cardsToInitialise; i++) {
                    currentCard = new Card(this, {
                        variant: 'message',
                        url: `/meditative_cards/static/src/img/messages/${i}`
                    })
                    this.messageCards.push(currentCard);
                    currentCard.appendTo(messagesContainer);
                }
            }
        },

        _onClickShuffle: function (e) {
            return
        },

    });

    publicWidget.registry.baseCardBoard = publicWidget.Widget.extend({
        selector: '#cards-board',

        start: function () {
            this._super.apply(this, arguments);
            const cardsBoardWidget = new CardsBoard();
            cardsBoardWidget.appendTo(this.$('#cards-board'));
        }

    });

    // core.action_registry.add('meditative_cards', CardsBoard);
    return {
        CardsBoard: CardsBoard,
        BaseCardBoard: publicWidget.registry.baseCardBoard
    }

});
