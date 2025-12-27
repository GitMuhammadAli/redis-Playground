const client = require('./client');

async function init() {
  const result = await client.get('bike:1');
  console.log(result);
}
init();