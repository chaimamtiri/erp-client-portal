.PHONY: run test migrate upgrade shell install install-dev

run:
	python run.py

test:
	pytest app/tests -v

migrate:
	flask db migrate -m "$(msg)"

upgrade:
	flask db upgrade

shell:
	flask shell

install:
	pip install -r requirements/base.txt

install-dev:
	pip install -r requirements/dev.txt

