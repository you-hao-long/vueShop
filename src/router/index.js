import Vue from 'vue'
import VueRouter from 'vue-router'

 
// const login = () => import ('../components/login.vue')
// const home = () => import ('../components/home.vue')
// const welcome = () => import ('../components/welcome.vue')
// const users = () => import ('../components/user/users.vue')
// const rights = () => import ('../components/power/rights.vue')
// const roles = () => import ('../components/power/roles.vue')
// const cate = () => import ('../components/goods/cate.vue')
// const params = () => import ('../components/goods/params.vue')
// const goodslist = () => import ('../components/goods/goodslist.vue')
// const add = () => import ('../components/goods/add.vue')
// const order = () => import ('../components/order/orders.vue')
// const reports = () => import ('../components/report/reports.vue')



const login = () => import (/* webpackChunkName: "lhw" */ '../components/login.vue')
const home = () => import (/* webpackChunkName: "lhw" */ '../components/home.vue')
const welcome = () => import (/* webpackChunkName: "lhw" */ '../components/welcome.vue')

const users = () => import (/* webpackChunkName: "urr" */ '../components/user/users.vue')
const rights = () => import (/* webpackChunkName: "urr" */ '../components/power/rights.vue')
const roles = () => import (/* webpackChunkName: "urr" */ '../components/power/roles.vue')

const cate = () => import (/* webpackChunkName: "cp" */ '../components/goods/cate.vue')
const params = () => import (/* webpackChunkName: "cp" */ '../components/goods/params.vue')

const goodslist = () => import (/* webpackChunkName: "ga" */ '../components/goods/goodslist.vue')
const add = () => import (/* webpackChunkName: "ga" */ '../components/goods/add.vue')

const order = () => import (/* webpackChunkName: "or" */ '../components/order/orders.vue')
const reports = () => import (/* webpackChunkName: "or" */ '../components/report/reports.vue')



Vue.use(VueRouter)

  const routes = [
		{ path: '/',redirect:'login' },
		{ path: '/login',component:login },
		{ path: '/home',component:home,redirect:'/welcome',
		children:[
			{ path: '/welcome',component:welcome },
			{ path: '/users',component:users },
			{ path: '/rights',component:rights },
			{ path: '/roles',component:roles },
			{ path: '/categories',component:cate },
			{ path: '/params',component:params },
			{ path: '/goods',component:goodslist },
			{ path: '/goods/add',component:add },
			{ path: '/reports',component:reports },
			]},
		
	]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next) => {
	//to 代表将要访问的路径
	//from 代表从哪个路径跳转进来
	//next 是一个函数，表示放行 
	//next() 放行  next('/login') 强制跳转
	
	//如何跳转的是登录页直接放行
	if(to.path === '/login') return next();
	
	const tokenStr = window.sessionStorage.getItem('token')
	//如果没有token,跳回登录页，否则放行
	if (!tokenStr) return next('/login')
	next()
})



export default router
