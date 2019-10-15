const Router = require('koa-router');

const canVisit = [{
	path: '/',
	pageType: 'index',
	title: '首页',
	source: 'index'
}, {
	path: '/test',
	pageType: 'index',
	title: '测试',
	source: 'index'
}];
// 所有路由匹配
let router = new Router();
router.get('*', async ctx => {
	let canLoad = true;
	if (ctx.url.endsWith('.js') || ctx.url.endsWith('.js.map')) {

	} else {
		console.log('当前访问的路由:', ctx.url)
		for (let item of canVisit) {
			//console.log(item)
			if (ctx.url == item.path) {
				await ctx.render(item.pageType, {
					title: item.title,
					pageType: item.source
				});
				canLoad = true;
				break;
			} else {
				canLoad = false;
			}
		}
		if (!canLoad) {
			await ctx.render('error', {
				title:'当前访问的资源不存在:Not Found',
				pageType:'index'
			});
		}
		console.log("this's sourse * Not Found", canLoad)
	}
});

// router.get('/', async ctx => {
// 	let title = '首页';
// 	await ctx.render('index', {
// 		title,
// 		pageType: 'index'
// 	});
// });

// router.get('/test', async (ctx, next) => {
// 	let title = '测试';
// 	await ctx.render('index', {
// 		title,
// 		pageType: 'index'
// 	});
// });

module.exports = router;