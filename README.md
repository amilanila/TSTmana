# Single Page Checkout

## Build Distribution

```js
gulp dist
```

## Local Development Live Reload

```js
gulp dev
```

Open browser on `https://localhost:8010/`

## Local Development using Hybris

Proxying non `/tmana` traffic to https://localhost:9002

```js
gulp dev --hybris
```

Open browser on `https://localhost:8010/`

## Test Suite & Lint

```js
gulp test
gulp lint
```

## Local Test Suite Live Reload

```js
gulp test:dev
gulp dev:test
```