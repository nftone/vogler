# Front-end

Refer to [front-end README](front-end/README.md)

# Indexer

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

Example service file

```bash
[Unit]
Description=Gunicorn instance for Vogler Indexer API
After=network.target

[Service]
User=<user>
Group=www-data
WorkingDirectory=/srv/vogler/indexer
Environment="PATH=/srv/vogler/indexer/venv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ExecStart=/srv/vogler/indexer/venv/bin/gunicorn --workers 3 --bind unix:/srv/vogler/indexer/api/app.sock api.app:app

[Install]
WantedBy=multi-user.target
```

### Indexer

The indexer is ran using cron

```bash
sudo apt-get install cron
crontab -e
*/2 * * * * /usr/bin/python3 /path/to/main.py
```
