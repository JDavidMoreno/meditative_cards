from odoo import http


class cardBoard(http.Controller):
    @http.route('/meditative_cards', auth='public')
    # @http.route('/meditative_cards', type='http', methods=['GET'], auth="public", website=True, sitemap=False)
    def index(self, **kw):
        return http.request.render("meditative_cards.cards_board")
