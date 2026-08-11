import pytest

from app import create_app
from app.extensions import db


@pytest.fixture
def test_app():
    app = create_app('testing')
    app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI='sqlite:///:memory:'
    )
    with app.app_context():
        db.drop_all()
        db.create_all()
    yield app
    with app.app_context():
        db.drop_all()


def test_admin_can_create_user_accounts(test_app):
    client = test_app.test_client()

    login_response = client.post('/api/v1/auth/login', json={
        'email': 'admin@erp.local',
        'password': 'Admin123!'
    })

    assert login_response.status_code == 200
    token = login_response.get_json()['access_token']

    create_response = client.post('/api/v1/auth/register', headers={
        'Authorization': f'Bearer {token}'
    }, json={
        'email': 'client@erp.local',
        'password': 'Client123!',
        'nom': 'Client Admin',
        'roles': ['ROLE_CLIENT']
    })

    assert create_response.status_code == 201
    body = create_response.get_json()
    assert body['user_id'] is not None
