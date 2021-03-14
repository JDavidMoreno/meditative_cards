from odoo import http


class cardBoard(http.Controller):
    @http.route('/meditative_cards', type='http', auth="public", website=True)
    def index(self, **kw):
        return http.request.render("meditative_cards.cards_board")
