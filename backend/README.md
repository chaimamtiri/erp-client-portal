# Flask Backend

## Setup
`ash
cp .env.example .env
make install-dev
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
make run
``n
