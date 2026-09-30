# G2Bulk Top-up Integration Guide — Nepal Game Top-up Web App

Sep 28, 2026 · @dev works

## Overview

Your app sits between Nepali customers and G2Bulk: the customer pays you in NPR (eSewa, bank), and your server then buys the top-up from G2Bulk using your prepaid G2Bulk wallet balance. G2Bulk never sees the customer or the payment; it only receives an order from your server with the player's game ID.

Three ideas drive the whole design:

1. **You own the catalog.** You sync G2Bulk's games and packages into your own database, then choose which few games are visible and set your own NPR selling price per package. The storefront reads only from your database, never from G2Bulk directly.
2. **Payment first, top-up second.** A top-up order is sent to G2Bulk only after your payment step confirms success. For now that step is a dummy function; later you swap in eSewa or bank verification without touching the rest.
3. **Your server holds the G2Bulk API key.** The browser never calls G2Bulk. All G2Bulk calls happen on the backend, so the key and your wallet stay safe.

Endpoints and fields below follow the G2Bulk API v1 docs you shared (last updated June 19, 2026). A few response fields the docs don't show are marked "confirm".

## Architecture and order flow

The app has four parts: a storefront (Next.js or React), a backend API (Node/Express, Laravel or Django), a database (PostgreSQL or MySQL) and a background worker that talks to G2Bulk. An admin panel sits on the same backend.

&#91;embedded content: order flow · payment gate before G2Bulk\]

The payment gate is the only thing that changes when you go live: today the dummy function answers "paid", later eSewa's verification answers it. Everything to its right already works for real.

## G2Bulk API: the calls you use

You use the Direct Game Top-Ups endpoints only; the voucher/product endpoints are for gift-card codes and can be ignored for now. Base URL is `https://api.g2bulk.com/v1/`, and protected calls send `X-API-Key: <key>`. API keys and wallet funding are managed through the Telegram bot `@G2BULKBOT`.

| Purpose | Call | Auth | Used by |
| --- | --- | --- | --- |
| Wallet balance (USD) | `GET /v1/getMe` → `balance` | Key | Admin wallet screen, pre-order check |
| List games | `GET /v1/games` | None | Catalog sync |
| Required player fields | `POST /v1/games/fields` `{"game":"mlbb"}` | None | Catalog sync, checkout form |
| Server list | `POST /v1/games/servers` `{"game":"mlbb"}` (403 = no server needed) | None | Checkout server dropdown |
| Packages and cost | `GET /v1/games/:code/catalogue` | None | Catalog sync |
| Validate player | `POST /v1/games/checkPlayerId` → `name` | None | Checkout: show "Is this you?" |
| Delivery estimate | `POST /v1/games/eta` | None | Optional, product page |
| Place top-up | `POST /v1/games/:code/order` + `X-Idempotency-Key` | Key | Fulfillment worker |
| Result | Webhook POST to your `callback_url` (`COMPLETED` / `FAILED`) | — | Webhook route |
| Order lookup | `GET /v1/orders/:id` | Key | Fallback check, admin |

The order body is `catalogue_name` (e.g. "60 UC"), `player_id`, plus `server_id` and `charname` when the game needs them, an optional `remark` and `callback_url`. Packages are identified by `catalogue_name`, not a numeric ID. The response returns G2Bulk's `order_id`, your cost `price` and `status: "PENDING"`.

Five rules from the docs shape the code:

- **Idempotency:** send a 36-character UUID in `X-Idempotency-Key`; a repeat within 30 minutes will not buy twice. Store one key per order and reuse it on every retry.
- **Webhook retries once only** and needs a 2xx within 10 seconds. Answer fast, then process; also keep a poll fallback in case both deliveries are missed.
- **410 Gone** means terminal failure and the cost is auto-refunded to your G2Bulk wallet. You still owe the customer an NPR refund.
- **Repeated failed auth = permanent IP ban.** On a 401, stop all calls and alert yourself; never retry with a bad key in a loop.
- **Rate limit** is 1,000 requests per 10 seconds per key; on 429 back off exponentially.

Confirm: the docs don't show the fields inside `/games/:code/catalogue`, or whether `GET /v1/orders/:id` returns top-up orders (its example shows voucher orders). Log one real response of each before finalising the sync and fallback code.

## Database design

Four tables let you show only the games you pick and sell at your own NPR prices. The sync job copies G2Bulk data in; your columns (`is_active`, `sell_price_npr`, `sort_order`) are never overwritten by it.

```sql
-- Games from GET /v1/games; you switch on only the ones to show
CREATE TABLE games (
  id              SERIAL PRIMARY KEY,
  g2bulk_code     VARCHAR(100) UNIQUE NOT NULL,   -- e.g. 'mlbb', 'pubgm'
  name            VARCHAR(200) NOT NULL,
  image_url       TEXT,
  required_fields JSONB NOT NULL DEFAULT '["player_id"]', -- from POST /v1/games/fields
  needs_server    BOOLEAN NOT NULL DEFAULT FALSE, -- false when /games/servers returns 403
  is_active       BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Packages from GET /v1/games/:code/catalogue, keyed by catalogue_name
CREATE TABLE packages (
  id              SERIAL PRIMARY KEY,
  game_id         INT NOT NULL REFERENCES games(id),
  catalogue_name  VARCHAR(200) NOT NULL,         -- sent as-is in the order, e.g. '60 UC'
  display_name    VARCHAR(200),                  -- your label, optional
  cost_price_usd  NUMERIC(10,4) NOT NULL,
  sell_price_npr  NUMERIC(10,2),                 -- set by you in admin
  is_active       BOOLEAN NOT NULL DEFAULT FALSE,
  available       BOOLEAN NOT NULL DEFAULT TRUE, -- false if G2Bulk drops it
  UNIQUE (game_id, catalogue_name)
);

-- One row per customer purchase
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- also the idempotency key
  package_id       INT NOT NULL REFERENCES packages(id),
  player_id        VARCHAR(100) NOT NULL,
  server_id        VARCHAR(100),
  charname         VARCHAR(100),
  player_name      VARCHAR(200),                -- from checkPlayerId, shown to customer
  amount_npr       NUMERIC(10,2) NOT NULL,      -- price locked at order time
  status           VARCHAR(30) NOT NULL DEFAULT 'PENDING_PAYMENT',
  g2bulk_order_id  INT UNIQUE,
  g2bulk_price_usd NUMERIC(10,4),               -- actual cost charged
  failure_reason   TEXT,
  attempts         INT NOT NULL DEFAULT 0,
  submitted_at     TIMESTAMP,                   -- first order POST (30-min idempotency window)
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- One row per payment attempt (dummy today, eSewa/bank later)
CREATE TABLE payments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES orders(id),
  method       VARCHAR(20) NOT NULL,    -- 'dummy' | 'esewa' | 'bank'
  amount_npr   NUMERIC(10,2) NOT NULL,
  status       VARCHAR(20) NOT NULL DEFAULT 'INITIATED', -- SUCCESS | FAILED | REFUNDED
  provider_ref VARCHAR(200),
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);
```

Order statuses move one way: `PENDING_PAYMENT` → `PAID` → `SUBMITTED` (sent to G2Bulk, G2Bulk says `PENDING`) → `DELIVERED` (G2Bulk `COMPLETED`). Side exits are `CANCELLED` (payment failed) and `FAILED` (G2Bulk `FAILED` or 410; your G2Bulk wallet is refunded, the customer's NPR refund is due) and NEEDS\_REVIEW (outcome unknown, check by hand). The storefront shows a package only when the game and package are active, `sell_price_npr` is set and `available` is true.

## Backend implementation

The examples use Node.js with Express and PostgreSQL; the same shape works in Laravel or Django. Keep G2Bulk and payment behind small modules so the rest of the app never knows which provider is in use.

### 1. Environment

```bash
G2BULK_API_KEY=your_key_here          # from @G2BULKBOT, server only
G2BULK_WEBHOOK_TOKEN=long_random_str  # protects your webhook URL
PUBLIC_URL=https://your-domain.com    # G2Bulk must reach this for webhooks
PAYMENT_PROVIDER=dummy                # later: esewa
DATABASE_URL=postgres://...
```

### 2. G2Bulk client (`services/g2bulk.js`)

One file owns every G2Bulk call. It stops all authenticated calls after a 401, because repeated failed auth gets your server IP banned permanently.

```javascript
const axios = require('axios');
const api = axios.create({ baseURL: 'https://api.g2bulk.com/v1', timeout: 20000 });
const key = () => ({ 'X-API-Key': process.env.G2BULK_API_KEY });

let authBlocked = false;
function guard() {
  if (authBlocked) throw new Error('G2Bulk paused after 401 - fix API key, then restart');
}
api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    authBlocked = true;
    alertAdmin('G2Bulk returned 401. All calls stopped to avoid an IP ban.');
  }
  return Promise.reject(err);
});

module.exports = {
  getMe: async () => { guard(); return (await api.get('/getMe', { headers: key() })).data; },

  // Public catalog (no key)
  listGames:    async ()     => (await api.get('/games')).data,
  getFields:    async game   => (await api.post('/games/fields', { game })).data,
  getCatalogue: async code   => (await api.get(`/games/${code}/catalogue`)).data,
  checkPlayer:  async body   => (await api.post('/games/checkPlayerId', body)).data,
  getServers:   async game   => {
    try { return (await api.post('/games/servers', { game })).data; }
    catch (e) { if (e.response?.status === 403) return null; throw e; } // 403 = no server needed
  },

  // Place order: returns the raw response so the worker can branch on status code
  placeOrder: async (code, body, idempotencyKey) => {
    guard();
    return api.post(`/games/${code}/order`, body, {
      headers: { ...key(), 'X-Idempotency-Key': idempotencyKey },
      validateStatus: () => true,
    });
  },
  getOrder: async id => { guard(); return (await api.get(`/orders/${id}`, { headers: key() })).data; },
};
```

### 3. Payment layer with a dummy provider (`services/payment/`)

Every provider exposes the same two functions. Today `dummy` always succeeds; later you add `esewa.js` with the same interface and flip `PAYMENT_PROVIDER`.

```javascript
// services/payment/dummy.js
module.exports = {
  async initiate(order) {
    return { redirectUrl: `/pay/dummy?order=${order.id}` }; // eSewa: signed redirect
  },
  async verify(order, params) {
    const ok = params.simulate !== 'fail'; // add ?simulate=fail to test failures
    return { success: ok, providerRef: `DUMMY-${Date.now()}`, amount: order.amount_npr };
  },
};

// services/payment/index.js
const providers = { dummy: require('./dummy') /*, esewa: require('./esewa') */ };
module.exports = providers[process.env.PAYMENT_PROVIDER || 'dummy'];
```

### 4. Checkout routes (`routes/checkout.js`)

The form asks for the fields stored per game, shows a server dropdown when needed, and confirms the player's in-game name before payment. The price always comes from your database, never from the browser.

```javascript
// Server dropdown (only for games with needs_server)
router.get('/api/games/:id/servers', async (req, res) => {
  const g = await db.one('SELECT g2bulk_code FROM games WHERE id = $1 AND is_active', [req.params.id]);
  res.json(await g2bulk.getServers(g.g2bulk_code));
});

// "Is this you?" check - rate-limit this route per IP
router.post('/api/check-player', async (req, res) => {
  const { gameId, player_id, server_id, charname } = req.body;
  const g = await db.one('SELECT g2bulk_code FROM games WHERE id = $1 AND is_active', [gameId]);
  const r = await g2bulk.checkPlayer({ game: g.g2bulk_code, user_id: player_id, server_id, charname });
  res.json({ valid: r.valid === 'valid', name: r.name });
});

router.post('/api/orders', async (req, res) => {
  const { packageId, player_id, server_id, charname } = req.body;
  const pkg = await db.one(`
    SELECT p.*, g.g2bulk_code, g.needs_server FROM packages p
    JOIN games g ON g.id = p.game_id
    WHERE p.id = $1 AND p.is_active AND p.available AND g.is_active
      AND p.sell_price_npr IS NOT NULL`, [packageId]);
  if (!player_id || (pkg.needs_server && !server_id))
    return res.status(400).json({ error: 'Player ID and server are required' });

  // Re-check on the server: never take payment for an invalid player
  const check = await g2bulk.checkPlayer({ game: pkg.g2bulk_code, user_id: player_id, server_id, charname });
  if (check.valid !== 'valid') return res.status(400).json({ error: 'Player not found' });

  const order = await db.one(`
    INSERT INTO orders (package_id, player_id, server_id, charname, player_name, amount_npr)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [pkg.id, player_id, server_id, charname, check.name, pkg.sell_price_npr]);

  const { redirectUrl } = await payment.initiate(order);
  res.json({ orderId: order.id, redirectUrl });
});

// Customer returns from the payment page
router.get('/payments/callback', async (req, res) => {
  const order = await db.one('SELECT * FROM orders WHERE id = $1', [req.query.order]);
  if (order.status !== 'PENDING_PAYMENT') return res.redirect(`/orders/${order.id}`);

  const result = await payment.verify(order, req.query);
  const paid = result.success && Number(result.amount) === Number(order.amount_npr);
  await db.tx(async t => {
    await t.none(`INSERT INTO payments (order_id, method, amount_npr, status, provider_ref)
      VALUES ($1, $2, $3, $4, $5)`, [order.id, process.env.PAYMENT_PROVIDER,
      order.amount_npr, paid ? 'SUCCESS' : 'FAILED', result.providerRef]);
    await t.none('UPDATE orders SET status = $2, updated_at = NOW() WHERE id = $1',
      [order.id, paid ? 'PAID' : 'CANCELLED']);
  });
  if (paid) await queue.add('submit', { orderId: order.id }); // BullMQ job
  res.redirect(`/orders/${order.id}`);
});
```

### 5. Submit worker (`workers/submit.js`)

The worker is the only code that spends your G2Bulk balance. The order's own UUID is the `X-Idempotency-Key`, so every retry reuses it and G2Bulk won't charge twice. Retries stop at 25 minutes, safely inside the 30-minute idempotency window; after that the order goes to `NEEDS_REVIEW` for you to check by hand in G2Bulk's order list (search by remark).

```javascript
async function submit(orderId) {
  // Claim the order atomically: only one worker can move PAID -> SUBMITTED
  const order = await db.oneOrNone(`
    UPDATE orders SET status = 'SUBMITTED', attempts = attempts + 1,
      submitted_at = COALESCE(submitted_at, NOW()), updated_at = NOW()
    WHERE id = $1 AND status = 'PAID' RETURNING *`, [orderId]);
  if (!order) return;

  const pkg = await db.one(`SELECT p.*, g.g2bulk_code FROM packages p
    JOIN games g ON g.id = p.game_id WHERE p.id = $1`, [order.package_id]);

  // Low wallet: hold the order, don't fail it
  const me = await g2bulk.getMe();
  if (Number(me.balance) < Number(pkg.cost_price_usd)) {
    await db.none(`UPDATE orders SET status = 'PAID' WHERE id = $1`, [order.id]);
    alertAdmin(`G2Bulk balance $${me.balance} too low - top up via @G2BULKBOT`);
    return queue.add('submit', { orderId }, { delay: 5 * 60 * 1000 });
  }

  const body = {
    catalogue_name: pkg.catalogue_name,
    player_id: order.player_id,
    ...(order.server_id && { server_id: order.server_id }),
    ...(order.charname && { charname: order.charname }),
    remark: order.id, // lets you find it in G2Bulk and in the webhook
    callback_url: `${process.env.PUBLIC_URL}/webhooks/g2bulk?token=${process.env.G2BULK_WEBHOOK_TOKEN}`,
  };

  let res;
  try {
    res = await g2bulk.placeOrder(pkg.g2bulk_code, body, order.id);
  } catch (e) {
    return retryLater(order, `network: ${e.message}`); // timeout = unknown, retry same key
  }

  if (res.status === 200 && res.data.success) {
    await db.none(`UPDATE orders SET g2bulk_order_id = $2, g2bulk_price_usd = $3 WHERE id = $1`,
      [order.id, res.data.order.order_id, res.data.order.price]);
    return queue.add('fallback-check', { orderId }, { delay: 10 * 60 * 1000 });
  }
  if (res.status === 410) return markFailed(order, res.data?.message || 'G2Bulk 410, wallet refunded');
  if (res.status === 429 || res.status >= 500) return retryLater(order, `HTTP ${res.status}`);
  return markFailed(order, `HTTP ${res.status}: ${JSON.stringify(res.data)}`); // 400, 404: bad data
}

async function retryLater(order, reason) {
  const ageMin = (Date.now() - new Date(order.submitted_at)) / 60000;
  if (ageMin > 25) {
    return db.none(`UPDATE orders SET status = 'NEEDS_REVIEW', failure_reason = $2 WHERE id = $1`,
      [order.id, reason]);
  }
  await db.none(`UPDATE orders SET status = 'PAID', failure_reason = $2 WHERE id = $1`, [order.id, reason]);
  const delay = Math.min(2 ** order.attempts * 5000, 5 * 60 * 1000); // exponential backoff
  await queue.add('submit', { orderId: order.id }, { delay });
}

async function markFailed(order, reason) {
  await db.none(`UPDATE orders SET status = 'FAILED', failure_reason = $2, updated_at = NOW()
    WHERE id = $1`, [order.id, reason]);
  // Customer NPR refund is due: shows in admin; later call eSewa refund here
}
```

### 6. Webhook and fallback (`routes/webhooks.js`, `workers/fallback.js`)

G2Bulk posts once when the order is `COMPLETED` or `FAILED`, retries only once, and needs a 2xx within 10 seconds. So the route checks the token, answers 200 at once, then updates the order. The fallback job catches any webhook that never arrives.

```javascript
router.post('/webhooks/g2bulk', express.json(), async (req, res) => {
  if (req.query.token !== process.env.G2BULK_WEBHOOK_TOKEN) return res.sendStatus(403);
  res.sendStatus(200); // reply first, process after

  const p = req.body; // { order_id, status, message, remark, price, ... }
  const order = await db.oneOrNone(
    'SELECT * FROM orders WHERE g2bulk_order_id = $1 AND id::text = $2', [p.order_id, p.remark]);
  if (order) await applyResult(order, p.status, p.message);
});

async function applyResult(order, status, message) {
  if (order.status !== 'SUBMITTED') return; // already final: ignore duplicates
  if (status === 'COMPLETED')
    await db.none(`UPDATE orders SET status = 'DELIVERED', updated_at = NOW() WHERE id = $1`, [order.id]);
  else if (status === 'FAILED')
    await markFailed(order, message || 'G2Bulk FAILED');
}

// Fallback: runs 10 min after submit, then every 10 min, gives up after 24 h
async function fallbackCheck(orderId) {
  const order = await db.one('SELECT * FROM orders WHERE id = $1', [orderId]);
  if (order.status !== 'SUBMITTED') return;
  const r = await g2bulk.getOrder(order.g2bulk_order_id); // confirm top-up orders appear here
  const status = r.orders?.[0]?.status ?? r.status;
  if (status === 'COMPLETED' || status === 'FAILED') return applyResult(order, status, r.message);
  const ageH = (Date.now() - new Date(order.submitted_at)) / 3600000;
  if (ageH > 24) return db.none(`UPDATE orders SET status = 'NEEDS_REVIEW' WHERE id = $1`, [order.id]);
  await queue.add('fallback-check', { orderId }, { delay: 10 * 60 * 1000 });
}
```

Note the final webhook check needs both `order_id` and `remark` to match, so a forged call can't touch a different order. The token keeps strangers out; keep it long and never log it.

### 7. Storefront API

The frontend calls only your API: `GET /api/games` (active games, sorted), `GET /api/games/:id/packages` (active packages with `sell_price_npr`), `GET /api/games/:id/servers`, `POST /api/check-player`, `POST /api/orders`, and `GET /api/orders/:id` to poll status on a "Processing your top-up" page. Never send `cost_price_usd` or the G2Bulk key to the browser.

## Admin panel: pick games and set prices

The admin panel is where you control what customers see and what they pay, at any time, with no code change.

| Screen | What you do | Backend endpoint |
| --- | --- | --- |
| Catalog sync | Click "Sync from G2Bulk" (or run it nightly) | `POST /admin/sync` |
| Games | Toggle `is_active` on the few games to show, set order and image | `PATCH /admin/games/:id` |
| Packages | Set `sell_price_npr`, toggle `is_active`, see cost and margin | `PATCH /admin/packages/:id` |
| Bulk pricing | Apply a rule to all packages of a game, then fine-tune | `POST /admin/games/:id/reprice` |
| Orders | Filter by status, retry `FAILED`, mark refunded | `POST /admin/orders/:id/retry` |
| Wallet | See G2Bulk balance, warn when low | `GET /admin/balance` |

### Sync job

The sync inserts new games and packages as inactive and updates cost prices, but never touches your prices or toggles. It fetches fields, servers and catalogue only for games you have switched on, so it stays well under the rate limit. A package G2Bulk removes is marked unavailable, so it leaves the store without losing your settings.

```javascript
async function syncCatalog() {
  const { games = [] } = await g2bulk.listGames(); // confirm list key and field names
  for (const g of games) {
    const game = await db.one(`
      INSERT INTO games (g2bulk_code, name, image_url) VALUES ($1, $2, $3)
      ON CONFLICT (g2bulk_code) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()
      RETURNING id, is_active`, [g.code, g.name, g.image_url]);
    if (!game.is_active) continue;

    const fields  = await g2bulk.getFields(g.code);   // which of player_id / server_id / charname
    const servers = await g2bulk.getServers(g.code);  // null when 403 (no server needed)
    await db.none(`UPDATE games SET required_fields = $2, needs_server = $3 WHERE id = $1`,
      [game.id, JSON.stringify(fields), servers !== null]);

    const cat = await g2bulk.getCatalogue(g.code);
    const items = cat.catalogues || cat.catalogue || []; // confirm shape from a real response
    for (const it of items) {
      await db.none(`
        INSERT INTO packages (game_id, catalogue_name, cost_price_usd) VALUES ($1, $2, $3)
        ON CONFLICT (game_id, catalogue_name) DO UPDATE
          SET cost_price_usd = EXCLUDED.cost_price_usd, available = TRUE`,
        [game.id, it.name, it.amount ?? it.price]);
    }
    await db.none(`UPDATE packages SET available = FALSE
      WHERE game_id = $1 AND catalogue_name <> ALL($2)`, [game.id, items.map(i => i.name)]);
  }
}
```

The Wallet screen reads `GET /v1/getMe` for the live USD `balance`; funding itself happens in `@G2BULKBOT` on Telegram. The Orders screen should list `NEEDS_REVIEW` and `FAILED` first, since those need your action.

### Pricing rule

A simple starting rule: selling price = cost in USD × your USD→NPR rate × (1 + margin), rounded up to the nearest 5 NPR. For example, a $1.20 package at 137 NPR/USD with 15% margin gives 1.20 × 137 × 1.15 = 189.06, rounded to **190 NPR**. Store the result in `sell_price_npr`; you can then override any single package by hand.

Add a safety check: when a sync raises `cost_price_usd` above what your NPR price covers, flag the package in admin (or auto-deactivate it) so you never sell at a loss. Protect all `/admin` routes with login and a role check.

## Security, reliability and going live

Most money is lost through double top-ups and trusting the browser, so these rules matter more than the UI.

- **Never trust the redirect alone.** When you add eSewa, verify every payment server-to-server and compare amount and order ID before marking `PAID`.
- **One top-up per order.** The atomic `PAID → SUBMITTED` claim plus the order UUID as `X-Idempotency-Key` stops duplicates from retries and double clicks.
- **Timeouts are unknown, not failed.** Retry with the same idempotency key only within 25 minutes; after that, mark `NEEDS_REVIEW`.
- **Protect against the IP ban.** Stop all G2Bulk calls on the first 401 and alert yourself; keep the key in env vars only.
- **Keep the wallet funded.** Check `getMe` balance before each order; hold orders as `PAID` when it is low instead of failing them.
- **Secure the webhook** with a secret token in the `callback_url` and require `order_id` and `remark` to match.
- **Log every G2Bulk request and response** (without the key) with your order ID, for disputes.
- **Rate-limit** `/api/check-player` and `/api/orders` per IP to stop abuse.

### Swapping the dummy for eSewa

1. Register as an eSewa merchant and get test credentials from eSewa's developer portal.
2. Create `services/payment/esewa.js` with the same `initiate` (build the signed form/redirect) and `verify` (call eSewa's verification) functions.
3. Set `PAYMENT_PROVIDER=esewa`. Routes, worker, admin and database stay unchanged.
4. Test the full path in eSewa's sandbox, including a failed and a cancelled payment.
5. For bank payments (connectIPS, Khalti, or a bank gateway), add one more provider file the same way.

### Build order

- [ ] Get your API key and fund a small USD balance through `@G2BULKBOT`
- [ ] Create the four tables; run the sync, then log one real `/games` and `/catalogue` response and adjust field names
- [ ] Build admin: activate a few games, set NPR prices, wallet screen
- [ ] Build storefront: game list, package list, player ID + server form with name check
- [ ] Wire checkout with the dummy payment, submit worker, webhook and fallback
- [ ] Deploy to a public HTTPS URL (webhooks need it) and test a real top-up on a cheap package with your own account
- [ ] Add eSewa, then bank payments

Open question: does `GET /v1/orders/:id` return direct top-up orders? If not, ask G2Bulk support how to check a top-up's status, and rely on the webhook plus `NEEDS_REVIEW`.
