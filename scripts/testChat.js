import http from 'http';

function post(path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 8787,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      },
      res => {
        let chunks = '';
        res.on('data', d => (chunks += d));
        res.on('end', () => {
          try {
            resolve(JSON.parse(chunks));
          } catch (e) {
            resolve({ raw: chunks });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const payload = {
    roleId: 'harry-potter',
    messages: [{ role: 'user', content: '你好，霍格沃茨今天有什么新鲜事？' }]
  };
  const resp = await post('/api/chat', payload);
  console.log('Chat response:', resp);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


