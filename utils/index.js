'use strict';

/**
 * @desc  函数防抖---“立即执行版本” 和 “非立即执行版本” 的组合版本
 * @param  fn 需要执行的函数
 * @param  delay 延迟执行时间（毫秒）
 * @param  immediate---true 表立即执行[触发事件后函数不会立即执行，而是在 n 秒后执行，如果在 n 秒内又触发了事件，则会重新计算函数执行时间]，
 *                     false 表非立即执行[触发事件后函数会立即执行，然后 n 秒内不触发事件才能继续执行函数的效果]
 **/
function debounce(fn, delay, immediate) {
    let timer;
    return function() {
        let self = this;
        let args = arguments;
        if (timer) {
            clearTimeout(timer)
        };
        if (immediate) {
            var callNow = !timer;
            timer = setTimeout(() => {
                timer = null;
            }, delay);
            if (callNow) {
                fn.apply(self, args);
            }
        } else {
            timer = setTimeout(function() {
                fn.apply(self, args)
            }, delay);
        }
    }
}

function getClientIp(req, proxyType) {
    let ip = req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
    // 如果使用了nginx代理

    if (proxyType === 'nginx') {
        // headers上的信息容易被伪造,但是我不care,自有办法过滤,例如'x-nginx-proxy'和'x-real-ip'我在nginx配置里做了一层拦截把他们设置成了'true'和真实ip,所以不用担心被伪造
        // 如果没用代理的话,我直接通过req.connection.remoteAddress获取到的也是真实ip,所以我不care
        ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || ip;
    }
    const ipArr = ip.split(',');
    // 如果使用了nginx代理,如果没配置'x-real-ip'只配置了'x-forwarded-for'为$proxy_add_x_forwarded_for,如果客户端也设置了'x-forwarded-for'进行伪造ip
    // 则req.headers['x-forwarded-for']的格式为ip1,ip2只有最后一个才是真实的ip
    if (proxyType === 'nginx') {
        ip = ipArr[ipArr.length - 1];
    }
    if (ip.indexOf('::ffff:') !== -1) {
        ip = ip.substring(7);
    }
    return ip;
}

function isLocal() {
    var host = window.location.host;
    return host.indexOf('127.0.0.1') > -1 || host.indexOf('localhost') > -1 || host.indexOf('192.168.1.15') > -1;
}
const allow = ['/api/login'];
function checkLogin(ctx, temple) {
    let url = ctx.originalUrl;
    if (allow.indexOf(url) > -1) {
        logger.info('当前地址可直接访问')
    } else {
        ctx.render('login', {
            title: '请登录',
            isConsole: false
        });

        if (ctx.isAuthenticated()) {
            //授权
            if (url === '/') {
                //ctx.redirect('/projectList')

            }
            console.log('login status validate success')
        } else {

            if (!ctx.cookies.get('userToken') || ctx.cookies.get('userToken') == '') {
                ctx.render('login', {
                    title: '请登录',
                    isConsole: false
                });
            }
        }
    }
}

module.exports = {
    debounce: debounce,
    isLocal: isLocal,
    getClientIp: getClientIp,
    checkLogin: checkLogin
};