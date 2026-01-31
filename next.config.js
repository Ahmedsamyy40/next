module.exports = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/map.html',
      },
    ];
  },
};
