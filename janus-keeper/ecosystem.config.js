module.exports = {
  apps: [
    {
      name: "janus-keeper",
      script: "./keeper.js",
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "janus-treasury",
      script: "./treasury.js",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
