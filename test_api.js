fetch('http://localhost:3000/api/architect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ problem: 'detect objects' })
}).then(async r => {
  console.log(r.status);
  console.log(await r.text());
}).catch(console.error);
