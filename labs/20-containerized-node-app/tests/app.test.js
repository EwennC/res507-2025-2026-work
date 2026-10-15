import test from 'node:test'
import assert from 'node:assert'
import { buildApp } from '../app/app.js'

test('GET / responds with a page', async () => {
  const app = await buildApp()
  
  try {
    const response = await app.inject({
      method: 'GET',
      url: '/'
    })
    
    assert.strictEqual(response.statusCode, 200)
    
  } finally {
    await app.close()
  }
})
test("GET /health responds with 200 and { ok: true }", async () => {
  const app = await buildApp();
  try {
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });
    assert.strictEqual(response.statusCode, 200);
    assert.deepStrictEqual(JSON.parse(response.payload), { ok: true });
  } finally {
    await app.close();
  }
});
test("GET /unknown-route returns 404", async () => {
  const app = await buildApp();
  try {
    const response = await app.inject({
      method: "GET",
      url: "/route-qui-n-existe-pas",
    });
    assert.strictEqual(response.statusCode, 404);
  } finally {
    await app.close();
  }
});