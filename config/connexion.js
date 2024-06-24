const { MongoClient } = require("mongodb");

let client = null;

function connecting(url, callback) {
  if (client == null) {
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    client.connect((error) => {
      if (error) {
        client = null;
        callback(error);
      } else {
        callback();
      }
    });
  } else {
    callback();
  }
}

function config() {
  if (client) {
    return client.db("NodeJS_MVC_MongoDB");
  } else {
    throw new Error("Client not connected");
  }
}

function close() {
  if (client) {
    client.close();
    client = null;
  }
}

module.exports = { connecting, config, close };
