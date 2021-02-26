import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'


//-----------------------------------------------------
import VueQuillEditor from 'vue-quill-editor' //富文本编辑器
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme


// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'

// 导入第三方树形插件
import ZkTable from 'vue-table-with-tree-grid'
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme


import axios from 'axios'
//配置请求的根路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

axios.interceptors.request.use( config => {//通过axios请求拦截器添加token,保证拥有获取数据权限
	console.log(config);
	// 为请求头对象,添加Token验证的Authorizetion
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config
})

Vue.prototype.$http = axios


Vue.config.productionTip = false

Vue.component('tree-table',ZkTable)//注册为全局可用组件

Vue.use(VueQuillEditor)//将富文本编辑器注册为全局可用的组件

Vue.filter('dateFormat',function(originVal){//时间转换
	const dt = new Date(originVal)
	const y = dt.getFullYear()
	const m = (dt.getMonth() + 1 + '').padStart(2,'0')
	const d = (dt.getDate() + '').padStart(2,'0')
	const hh = (dt.getHours() + '').padStart(2,'0')
	const mm = (dt.getMinutes() + '').padStart(2,'0')
	const ss = (dt.getSeconds() + '').padStart(2,'0')
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
