# Performance

## Reducer logging

One source of blocking lag is when the main process runs slow code in reducers. To look for this, enable reducer runtime logs by running Brave with the env variable `REDUCER_TIME_LOG_THRESHOLD={time in ns}`.

Log runtimes slower than 5 ms in development:

```sh
REDUCER_TIME_LOG_THRESHOLD=5000000 npm run start
```

In a MacOS packaged build:

```
REDUCER_TIME_LOG_THRESHOLD=5000000 {path to Brave.app}/Contents/MacOS/Brave
```

Logs are written to `{userProfile}/reducer-time-{ISO datetime}.log` by default. You can override this with the env var `REDUCER_TIME_LOG_PATH={path}`.

Log format is `{unix timestamp (ms)},{label},{run time (ns)}`, one event per line:

```
1500588837179,app-add-site,231026979
1500588855676,app-frame-changed,16606127
1500588909915,window-set-popup-window-detail,7043392
```
