const test = require('node:test');
const assert = require('node:assert/strict');
const server = require('../src/server');

test('GET / returns the welcome message', async () => {
  const address = server.address();
  const response = await fetch(`http://localhost:${address.port}/`);

  assert.equal(response.status, 200);

  const body = await response.json();
  assert.equal(body.message, 'Welcome to StoreOps API');
  assert.equal(body.version, '1.0.0');
});

test('GET /health returns healthy status', async () => {
  const address = server.address();
  const response = await fetch(`http://localhost:${address.port}/health`);

  assert.equal(response.status, 200);

  const body = await response.json();
  assert.equal(body.status, 'healthy');
  assert.equal(body.service, 'storeops-api');
});

test('GET /unknown returns 404', async () => {
  const address = server.address();
  const response = await fetch(`http://localhost:${address.port}/unknown`);

  assert.equal(response.status, 404);

  const body = await response.json();
  assert.equal(body.error, 'Not Found');
});

test('GET /version returns service version', async () => {
  const address = server.address();
  const response = await fetch(`http://localhost:${address.port}/version`);

  assert.equal(response.status, 200);

  const body = await response.json();
  assert.equal(body.service, 'storeops-api');
  assert.equal(body.version, '1.0.0');
});

test.after(() => {
  server.close();
});
