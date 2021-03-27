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
        },
        custom_events: {
            clickCard: '_onClickCard'
        },

        init: function () {
            this._super.apply(this, arguments);
            this.isVerticalScreen = true; // this must be changed
            this.cardsToInitialise = 10;

            this.cards = [];
            this.messageCards = [];

            // if (window.innerHeight >= window.innerWidth) {
            //     this.isVerticalScreen = true;
            // }
        },

        start: async function () {
            this.session = Session;
            await this._super(...arguments);
            await this._renderCards();
        },

        _renderCards: async function () {
            let currentCard;
            if (this.cards.length === 0) {
                this.cardsContainer = this.$('.cards-container');
                for (let i = 1; i <= this.cardsToInitialise; i++) {
                    currentCard = new Card(this, {
                        variant: 'card',
                        url: `/meditative_cards/static/src/img/cards/${i}.jpg`
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
                        url: `/meditative_cards/static/src/img/messages/${i}.jpg`
                    })
                    this.messageCards.push(currentCard);
                    currentCard.appendTo(this.messagesContainer);
                }
            }
        },

        _onClickShuffle: function (e) {
            // TODO: Just change the inclination of the card (transition then should apply) and the number of the ward for every widget
            function suffle(arr) {
                return arr.sort(() => (Math.random() - 0.5))
            }
            // Let's shuffle them twice!
            let newCardsOrder = this.cards;
            let newMessageCardsOrder = this.messageCards;
            for (let i = 0; i < 2; i++) {
                newCardsOrder = suffle(newCardsOrder)
                newMessageCardsOrder = suffle(newMessageCardsOrder)
            }
            let card;
            for (card of newCardsOrder) {
                card.appendTo(this.cardsContainer);
            }
            for (card of newMessageCardsOrder) {
                card.appendTo(this.messagesContainer);
            }
        },

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
