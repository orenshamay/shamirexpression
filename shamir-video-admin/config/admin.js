module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '3419fe563db995ac7cb4afe4376d7d6a'),
  },
});
