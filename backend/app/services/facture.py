from flask import Blueprint, Response, jsonify, request

from app.models.ArticleFacture import ArticleFacture
from app.models.Client import Client
from app.models.Facture import Facture
from app.services.auth import token_required

facture_bp = Blueprint('facture', __name__)


def _load_weasyprint_html():
    module = __import__('weasyprint', fromlist=['HTML'])
    return module.HTML


def _serialize_facture(facture: Facture) -> dict:
    return {
        'id': facture.id,
        'numero': facture.numero,
        'date_facture': facture.date_facture.isoformat() if facture.date_facture else None,
        'date_piece': facture.date_piece.isoformat() if facture.date_piece else None,
        'date_echeance': facture.date_echeance.isoformat() if facture.date_echeance else None,
        'total_ht': float(facture.total_ht) if facture.total_ht is not None else 0,
        'total_tva': float(facture.total_tva) if facture.total_tva is not None else 0,
        'total_ttc': float(facture.total_ttc) if facture.total_ttc is not None else 0,
        'montant_regle': float(facture.montant_regle) if facture.montant_regle is not None else 0,
        'solde_du': float(facture.solde_du) if facture.solde_du is not None else 0,
        'est_valider': facture.est_valider,
        'est_solder': facture.est_solder,
        'est_supprime': facture.est_supprime,
        'client_id': facture.client_id,
        'status_id': facture.status_id,
        'cree_par_id': facture.cree_par_id,
        'customer': facture.client.nom if facture.client else None,
        'amount': f"€{float(facture.total_ttc) if facture.total_ttc is not None else 0:.2f}",
        'issued': facture.date_facture.isoformat() if facture.date_facture else None,
        'status': 'Payée' if facture.est_solder else 'En attente',
        'statusLibelle': 'Payée' if facture.est_solder else 'En attente',
    }


def _serialize_facture_line(line: ArticleFacture) -> dict:
    return {
        'id': line.id,
        'commande_id': line.piece_id,
        'article_id': line.article_id,
        'designation': line.nom_article,
        'reference': line.reference,
        'quantite': float(line.quantite) if line.quantite is not None else 0,
        'prix_unitaire_ht': float(line.prix_ht) if line.prix_ht is not None else 0,
        'total_ht': float(line.total_prix_ht) if line.total_prix_ht is not None else 0,
        'image': None,
        'est_supprime': line.est_supprime,
    }


@facture_bp.route('', methods=['GET'])
@token_required
def list_factures():
    client_id = request.args.get('client_id', type=int)
    query = Facture.query.filter_by(est_supprime=False)
    if client_id:
        query = query.filter_by(client_id=client_id)
    factures = query.order_by(Facture.date_facture.desc()).all()
    return jsonify([_serialize_facture(facture) for facture in factures]), 200


@facture_bp.route('/<int:facture_id>', methods=['GET'])
@token_required
def get_facture(facture_id: int):
    facture = Facture.query.get_or_404(facture_id)
    payload = _serialize_facture(facture)
    payload['lignes'] = [
        _serialize_facture_line(line)
        for line in ArticleFacture.query.filter_by(piece_id=facture_id, est_supprime=False).order_by(ArticleFacture.ordre.asc()).all()
    ]
    return jsonify(payload), 200


@facture_bp.route('/<int:facture_id>/pdf', methods=['GET'])
@token_required
def facture_pdf(facture_id: int):
    HTML = _load_weasyprint_html()

    facture = Facture.query.get_or_404(facture_id)
    client = Client.query.get(facture.client_id)
    lignes = ArticleFacture.query.filter_by(piece_id=facture_id, est_supprime=False).order_by(ArticleFacture.ordre.asc()).all()

    html = f"""
    <!doctype html>
    <html lang="fr">
    <head>
      <meta charset="utf-8" />
      <style>
        body {{ font-family: Arial, sans-serif; color: #0f172a; margin: 32px; }}
        h1 {{ margin: 0 0 8px 0; }}
        .meta {{ margin-bottom: 24px; color: #475569; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
        th, td {{ border-bottom: 1px solid #e2e8f0; padding: 10px 8px; text-align: left; }}
        th {{ background: #f8fafc; }}
        .totals {{ margin-top: 24px; }}
        .totals td {{ border: none; padding: 4px 0; }}
        .right {{ text-align: right; }}
      </style>
    </head>
    <body>
      <h1>Facture {facture.numero or ''}</h1>
      <div class="meta">
        <div>Client: {client.nom if client else ''}</div>
        <div>Date: {facture.date_facture.isoformat() if facture.date_facture else ''}</div>
        <div>Échéance: {facture.date_echeance.isoformat() if facture.date_echeance else ''}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Désignation</th>
            <th>Référence</th>
            <th>Qté</th>
            <th>PU HT</th>
            <th>Total HT</th>
          </tr>
        </thead>
        <tbody>
          {''.join(f'<tr><td>{line.nom_article or ""}</td><td>{line.reference or ""}</td><td>{float(line.quantite) if line.quantite is not None else 0}</td><td>{float(line.prix_ht) if line.prix_ht is not None else 0:.2f}</td><td>{float(line.total_prix_ht) if line.total_prix_ht is not None else 0:.2f}</td></tr>' for line in lignes)}
        </tbody>
      </table>
      <table class="totals">
        <tr><td class="right"><strong>Total HT:</strong> {float(facture.total_ht) if facture.total_ht is not None else 0:.2f} EUR</td></tr>
        <tr><td class="right"><strong>TVA:</strong> {float(facture.total_tva) if facture.total_tva is not None else 0:.2f} EUR</td></tr>
        <tr><td class="right"><strong>Total TTC:</strong> {float(facture.total_ttc) if facture.total_ttc is not None else 0:.2f} EUR</td></tr>
        <tr><td class="right"><strong>Solde dû:</strong> {float(facture.solde_du) if facture.solde_du is not None else 0:.2f} EUR</td></tr>
      </table>
    </body>
    </html>
    """

    pdf = HTML(string=html).write_pdf()
    return Response(pdf, mimetype='application/pdf', headers={
        'Content-Disposition': f'attachment; filename=facture-{facture.numero or facture.id}.pdf'
    })
