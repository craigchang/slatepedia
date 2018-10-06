const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const PORT = process.env.PORT || 5000;

const materialsJson = require('./rest/materials');
const recipesJson = require('./rest/recipes');
const armorJson = require('./rest/armor');
const foodJson = require('./rest/food');
const monstersJson = require('./rest/monsters');
const shieldsJson = require('./rest/shields');
const weaponsJson = require('./rest/weapons');
const bowsJson = require('./rest/bows');

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  //
  const obj = {
    message: "Hello from the custom server!",
    test: {
      one: "nested message"
    }
  }

  // Answer API requests.
  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(obj));
  });

  // Materials API
  app.get('/api/materials', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(materialsJson);
  });
  // Materials Detail API
  app.get('/api/materials/:id', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(materialsJson[Number(req.params.id) - 1]);
  });

  // Recipes API
  app.get('/api/recipes', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(recipesJson);
  })
  // Recipes Detail API
  app.get('/api/recipes/:id', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(recipesJson[Number(req.params.id) - 1]);
  });

  // Armor API
  app.get('/api/armor', function(req, res) {
    res.set('Content-Type', 'application/json');
    res.send(armorJson);
  })
  // Armor Detail API
  app.get('/api/armor/:id', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(armorJson[Number(req.params.id) - 1]);
  });

  // Food API
  app.get('/api/food', function(req, res) {
    res.set('Content-Type', 'application/json');
    res.send(foodJson);
  })
  // Food Detail API
  app.get('/api/food/:id', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(foodJson[Number(req.params.id) - 1]);
  });

  // Monsters API
  app.get('/api/monsters', function(req, res) {
    res.set('Content-Type', 'application/json');
    res.send(monstersJson);
  })
  // Monsters Detail API
  app.get('/api/monsters/:id', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(monstersJson[Number(req.params.id) - 1]);
  });

  // Shields API
  app.get('/api/shields', function(req, res) {
    res.set('Content-Type', 'application/json');
    res.send(shieldsJson);
  })
  // Shields Detail API
  app.get('/api/shields/:id', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(shieldsJson[Number(req.params.id) - 1]);
  });

  // Weapons API
  app.get('/api/weapons', function(req, res) {
    res.set('Content-Type', 'application/json');
    res.send(weaponsJson);
  })
  // Weapons Detail API
  app.get('/api/weapons/:id', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(weaponsJson[Number(req.params.id) - 1]);
  });

   // Bows API
  app.get('/api/bows', function(req, res) {
    res.set('Content-Type', 'application/json');
    res.send(bowsJson);
  })
  // Bows Detail API
  app.get('/api/bows/:id', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(bowsJson[Number(req.params.id) - 1]);
  });
  

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
}
