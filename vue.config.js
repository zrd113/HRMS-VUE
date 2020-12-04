let proxyObj = {};

proxyObj['/'] = {
    ws: false,
    target: 'http://localhost:8080',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}

proxyObj['/ws'] = {
    ws: true,
    target: "ws://localhost:8080"
}

module.exports = {
    devServer: {
        host: 'localhost',
        port: 8081,
        proxy: proxyObj
    }
}