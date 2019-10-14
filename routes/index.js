const Router = require('koa-router');
const Tools = require('../utils/index');
const http = require('../utils/http');


// 首页路由
let router = new Router();
router.get('/', async ctx => {

	let title = '首页';
	await ctx.render('index', {
		title,
		pageType:'index'
	});
});

router.get('/test', async (ctx, next) => {
	let title = '测试';
	await ctx.render('index', {
		title,
		pageType:'index'
	});
});

module.exports = router;