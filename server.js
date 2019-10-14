var Koa = require('koa');
var app = new Koa();
const bodyparser = require('koa-bodyparser');
const proxy = require('http-proxy-middleware');
const path = require('path');
const views = require('koa-views');
const static = require('koa-static');
const router = require('./routes/index');
var serverName = process.env.NAME || 'Unknown';
var port = process.env.port || 3030;
var url = `http://127.0.0.1:${port}`;

app.use(bodyparser({
	enableTypes: ['json', 'form', 'text']
}))
app.use(static(__dirname, './public'));

// 加载模板引擎,文件会自动拼接此后缀
app.use(views(path.join(__dirname, './views'), {
	extension: 'ejs'
}))

var reg = /^[\/][0-9]{1,5}\.(js)$/;
app.proxy = true;
app.use(async (ctx, next) => {
	//以api开头的异步请求接口都会被转发
	//console.log(ctx.header.host)
	//react-loadable打包后js组件拆分，访问根目录下
	if (ctx.url.endsWith('.js') && reg.test(ctx.url)) {
		//console.log(ctx.url)
		ctx.respond = false; // 绕过koa内置对象response ，写入原始res对象，而不是koa处理过的response
		return proxy({
			target: 'http://'+ctx.header.host, // 服务器地址
            changeOrigin: true,
            secure: false,
            pathRewrite: {
                '^/': '/public/build/'
            }
        })(ctx.req, ctx.res, next)
	}
	return next();
});

// 加载路由中间件
app.use(router.routes());
// 监听端口
app.listen(port, () => {
	console.log('Server listening at port %d', port);
	console.log('Hello, I\'m %s, how can I help?', serverName);
});