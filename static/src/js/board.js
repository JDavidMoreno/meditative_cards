odoo.define('meditative_cards.board', function (require) {
    "use strict";

    var Widget = require('web.Widget');
    var publicWidget = require('web.public.widget');
    // var core = require('web.core');
    var Session = require('web.session');

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
            'click #cards-music-popover': '_onClickTooltipMusic',
        },
        custom_events: {
            mouseUpCard: '_onMouseUpCard'
        },

        init: function () {
            this._super.apply(this, arguments);
            this.cardsToInitialise = 10;
            this.cards = [];
            this.messages = [];
            this.cardsRefZIndex = 1;
        },

        start: async function () {
            this.session = Session;
            await this._super(...arguments);
            this.cardsContainer = this.$('.cards-container');
            this.messagesContainer = this.$('.messages-container');
            this._loadDeck();
            this.deckHandDraggable = this.$el.find('.cards-block-deck');
            this.deckHandDraggable.draggable({
                handle: '#move-cards-deck',
                containment: "body"
            });
            this._onOrientationChange();
            window.addEventListener("orientationchange", this._onOrientationChange.bind(this));
            this.audioObject = new Audio('/meditative_cards/static/src/assets/delayde-little-spirit.mp3');
            this.audioObject.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);
        },

        _freeDeckHandler: function () {
            this.deckHandDraggable.draggable("option", "axis", false);
        },

        _limitDeckHandler: function () {
            this.deckHandDraggable.draggable("option", "axis", "x");
        },

        _onOrientationChange: function () {
            // This is funny, but seems to be like a small delay of time between triggering the orientationChange and the change in the values for window.innherWidth and window.innerHeight
            setTimeout(() => {
                console.log(window.innerWidth, window.innerHeight);
                if (window.innerWidth >= window.innerHeight) {
                    this.deckHandDraggable.removeClass("col-12").addClass("col-sm-4");
                    if (($("nav").height() * 4) < window.innerHeight ) {
                        this._freeDeckHandler();
                    } else {
                        this._limitDeckHandler();
                    }
                } else {
                    this.deckHandDraggable.removeClass("col-sm-4").addClass("col-12");
                    this._limitDeckHandler();
                }
            }, 200);

        },

        _loadDeck: async function () {
            this._renderCards();
        },

        _renderCards: async function () {
            let currentCard;
            for (let i = 1; i <= this.cardsToInitialise; i++) {
                currentCard = new Card(this, {
                    variant: 'card',
                    srcFace: `/meditative_cards/static/src/img/cards/${i}.jpg`,
                    srcBack: `/meditative_cards/static/src/img/card-back.jpg`
                })
                this.cards.push(currentCard);
                currentCard.appendTo(this.cardsContainer);
            }
            for (let i = 1; i <= this.cardsToInitialise; i++) {
                currentCard = new Card(this, {
                    variant: 'message',
                    srcFace: `/meditative_cards/static/src/img/messages/${i}.jpg`,
                    srcBack: `/meditative_cards/static/src/img/message-back.jpg`
                })
                this.messages.push(currentCard);
                currentCard.appendTo(this.messagesContainer);
            }
        },

        _onClickShuffle: function (e) {
            e.preventDefault();
            let card;
            for (card of this.cards) {
                card.resetDisplay();
            }
            for (card of this.messages) {
                card.resetDisplay();
            }
        },

        _onClickToggleMusic: function (e) {
            const toggleButton = this.$(e.currentTarget);
            this.$el.find('#cards-music-popover').removeClass('show');
            if (toggleButton.hasClass('fa-volume-down')) {
                toggleButton.removeClass('fa-volume-down').addClass('fa-volume-up');
                this.audioObject.play();
            } else {
                toggleButton.removeClass('fa-volume-up').addClass('fa-volume-down');
                this.audioObject.pause();
            }
        },

        _onClickTooltipMusic: function (e) {
            this.$(e.currentTarget).removeClass('show').addClass('d-none');
        },

        _onMouseUpCard: function (e) {
            e.data.card.css('z-index', this.cardsRefZIndex);
            this.cardsRefZIndex++;
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
