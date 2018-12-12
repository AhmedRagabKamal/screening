module.exports = {
    devServer: {
      proxy: {
        '': {
          target: process.env.VUE_APP_BASEURL,
          changeOrigin: true,
        },
      },
    },
};