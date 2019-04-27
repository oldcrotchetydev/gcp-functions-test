const httpOperations = require('./operations');

exports.helloHttp = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  (async () => {
    if (req.method === 'POST') {
      const result = await httpOperations.post(req);
      res.send(JSON.stringify(result));
    }
    if (req.method === 'GET') {
      const result = await httpOperations.get(req);
      res.send(JSON.stringify(result));
    }
    if (req.method === 'DELETE') {
      const result = await httpOperations.delete(req);
      res.send(JSON.stringify(result));
    }
  })().catch(err => {
    console.log("ERROR: " + err);
    console.error(err);
    res.send(JSON.stringify({ success: false, error: err.toString() }));
  });
};
