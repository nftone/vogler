# Vogler

Static site presenting Stephan Vogler's artworks, with ownership data anchored
on the Bitcoin blockchain. The asset set almost never changes (~30 works), so
the data is **baked into the front-end build** rather than fetched at runtime.

## Architecture (and why it's reliable now)

```
indexer/main.py  ──(reads)──>  indexer/constants/Creations.json   (source of truth: the works)
       │                                                          + Bitcoin owner/history (blockstream.info)
       │  fail-closed + atomic write (only a COMPLETE set is ever published)
       ▼
front-end/src/data/creations.json   ──(bundled at build time)──>  front-end/dist  ──>  GitHub Pages
```

The front-end has **no runtime dependency** on any API. It cannot show a partial
list or a spurious "asset not found", because the complete, validated data set
is compiled into the JS bundle that ships with each release.

> Previously the front-end fetched the data live from a Flask API whose
> `output.json` was rewritten by a cron job every 2 minutes. Any transient
> blockstream.info failure dropped assets and overwrote the good data with a
> partial set — the cause of the intermittent "half the assets" / "not found"
> bugs. That live API and its cron are no longer used and should be retired.

## Front-end

See [front-end/README.md](front-end/README.md). Local dev:

```bash
cd front-end
npm ci
npm run dev
```

## Refreshing the data (only when assets/owners actually change)

```bash
cd indexer
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python main.py            # writes ../front-end/src/data/creations.json
```

`main.py` is **fail-closed**: it retries blockstream.info with backoff and only
writes if it successfully indexes ALL works. On a partial/failed run it exits
non-zero and leaves the existing data untouched. Then commit + deploy:

```bash
git add front-end/src/data/creations.json
git commit -m "data: refresh creations"
# then deploy (see below)
```

## Deploying

Deploy is triggered by pushing a **git tag**. The `CI/CD` GitHub Action
(`.github/workflows/deploy.yml`) builds `front-end` and publishes `dist/` to the
`gh-pages` branch, which GitHub Pages serves at `vogler.hnft.wtf` (CNAME).

```bash
# bump front-end/package.json "version" to match, then:
git tag 0.4.0
git push origin 0.4.0
```

Requires the `ACTIONS_DEPLOY_ACCESS_TOKEN` repo secret (already configured). The
deploy step copies `index.html` to `404.html` so SPA deep links resolve.
