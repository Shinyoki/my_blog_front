const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: true,
  devServer: {
    proxy: {
        "/api": {
          target: "http://localhost:8888",
          changeOrigin: true,
          pathRewrite: {
            "^/api": ""
          }
        }
    }
  }
})
