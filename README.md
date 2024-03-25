# Indexer

## Description

Only the indexer is supposed to work
The front-end i

## Initial setup

```bash
cd indexer
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Dev

### Start the Flask server

```bash
cd indexer
make run
```

## Production

### Flask app

```bash
cd indexer
gunicorn -w 4 -b 0.0.0.0:8000 api.app:app
```

### Indexer

The indexer is ran using cron

```bash
sudo apt-get install cron
crontab -e
*/2 * * * * /usr/bin/python3 /path/to/main.py
```
