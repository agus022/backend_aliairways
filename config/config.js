// config.js

let config = {
  APP_DB_HOST: "",
  APP_DB_USER: "",
  APP_DB_PASSWORD: "",
  APP_DB_NAME: "",
  APP_DB_PORT: "5432" // puerto por defecto de PostgreSQL
};

var AWS = require('aws-sdk');
var client = new AWS.SecretsManager({
  region: "us-east-1"
});

const secretName = "Mydbsecret";

client.getSecretValue({ SecretId: secretName }, function (err, data) {
  if (err) {
    // fallback a variables de entorno
    config.APP_DB_HOST = process.env.APP_DB_HOST;
    config.APP_DB_NAME = process.env.APP_DB_NAME;
    config.APP_DB_PASSWORD = process.env.APP_DB_PASSWORD;
    config.APP_DB_USER = process.env.APP_DB_USER;
    config.APP_DB_PORT = process.env.APP_DB_PORT || "5432";
    console.log('Secrets not found. Reading from environment variables...');
  } else {
    if ('SecretString' in data) {
      const secret = JSON.parse(data.SecretString);
      for (const envKey of Object.keys(secret)) {
        process.env[envKey] = secret[envKey];
        if (envKey === 'user') {
          config.APP_DB_USER = secret[envKey];
        } else if (envKey === 'password') {
          config.APP_DB_PASSWORD = secret[envKey];
        } else if (envKey === 'host') {
          config.APP_DB_HOST = secret[envKey];
        } else if (envKey === 'db') {
          config.APP_DB_NAME = secret[envKey];
        } else if (envKey === 'port') {
          config.APP_DB_PORT = secret[envKey];
        }
      }
    }
  }
});

Object.keys(config).forEach(key => {
  if (process.env[key] === undefined) {
    console.log(`[NOTICE] Value for key '${key}' not found in ENV, using default value.`);
  } else {
    config[key] = process.env[key];
  }
});

module.exports = config;
