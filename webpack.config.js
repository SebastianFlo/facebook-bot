path = require('path');

module.exports = {
    entry: {
        app: ['./public/src/main']
    },
    output: {
        path: path.join(__dirname, './public/dist'),
        filename: "app.js"
    },
    module: {
        loaders: [
            { test: /\.js?$/, loaders: ['babel'], include: path.join(__dirname, 'public/src'), exclude: /node_modules/ },
        ]
    }
};