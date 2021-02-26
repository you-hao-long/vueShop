<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片视图 -->
		<el-card>
			<!-- 提示 -->
			<el-alert title="添加商品信息" type="info" center="" show-icon="" :closable="false"></el-alert>
			
			
			<el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
			  <el-step title="基本信息"></el-step>
			  <el-step title="商品参数"></el-step>
			  <el-step title="商品属性"></el-step>
			  <el-step title="商品图片"></el-step>
			  <el-step title="商品内容"></el-step>
			  <el-step title="完成"></el-step>
			</el-steps>
			
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
				<el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTableave" @tab-click="tabClicked"> 
					<el-tab-pane label="基本信息" name="0">
						<el-form-item label="商品名称" prop="goods_name"><el-input v-model="addForm.goods_name"></el-input></el-form-item>
						<el-form-item label="商品价格" prop="goods_price"><el-input v-model="addForm.goods_price" type="number"></el-input></el-form-item>
						<el-form-item label="商品重量" prop="goods_weight"><el-input v-model="addForm.goods_weight" type="number"></el-input></el-form-item>
						<el-form-item label="商品数量" prop="goods_number"><el-input v-model="addForm.goods_number" type="number"></el-input></el-form-item>
						<el-form-item label="商品分类" prop="goods_cat">
						 <el-cascader
						    expand-trigger="hover"
						    :options="catelist"
							:props="cateProps"
						    v-model="addForm.goods_cat"
						    @change="handleChange">
						  </el-cascader>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品参数" name="1">
						<!-- 渲染表单item项 -->
						<el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
							<el-checkbox-group v-model="item.attr_vals">
								<el-checkbox :label="cd" v-for="(cd, i) in item.attr_vals" :key="i" border></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
						  
					</el-tab-pane>
					<el-tab-pane label="商品属性" name="2">
						<el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
							<el-input v-model="item.attr_vals"></el-input>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品图片" name="3">
						<!-- action表示图片要上传的后台api地址 -->
						<el-upload
						  :action="uploadURL"
						  :on-preview="handlePreview"
						  :on-remove="handleRemove"
						  list-type="picture"
						  :headers="headerObj"
						  :on-success="handleSuccess"
						>
						  <el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-tab-pane>
					<el-tab-pane label="商品内容" name="4">
						<!-- 富文本编辑器组件 -->
						<quill-editor v-model="addForm.goods_introduce"></quill-editor>
						<el-button type="primary" style="margin-top: 15px;" @click="add">添加商品</el-button>
					</el-tab-pane>
					
					
				</el-tabs>
			</el-form>
			
			<!-- 图片预览 -->
			<el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
			  
			  <img :src="previewPath" alt="" class="previewImg">
			  
			</el-dialog>
			
		</el-card>
		
		
		
		
	</div>
</template>

<script>
	import _ from 'lodash';//使用深拷贝
	
	export default {
		data(){ 
			return {
				activeIndex:0,
				addForm:{//添加商品的表单数据对象
					goods_name:'',
					goods_price:0,
					goods_weight:0,
					goods_number:0,
					goods_cat:[],//商品所属的分类数组
					pics:[],//图片的数组
					goods_introduce:'',//商品的详情描述
					attrs:[],
				},
				addFormRules:{
					goods_name:[
						{ required: true, message: '请输入商品名称', trigger: 'blur' },
					],
					goods_price:[
						{ required: true, message: '请输入商品价格', trigger: 'blur' },
					],
					goods_weight:[
						{ required: true, message: '请输入商品重量', trigger: 'blur' },
					],
					goods_number:[
						{ required: true, message: '请输入商品数量', trigger: 'blur' },
					],
					goods_cat:[
						{ required: true, message: '请输入商品分类', trigger: 'blur' },
					]
				},
				catelist:[],
				cateProps:{
					value:'cat_id',
					label:'cat_name',
					children:'children'
				},
				manyTableData:[],//动态参数列表数据
				onlyTableData:[],//静态属性列表数据
				uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
				headerObj:{Authorization:window.sessionStorage.getItem('token')},//图片上传组件的headers请求头,因为上传组件自己封装了了请求,没有使用axios
				
				previewPath:'',
				previewVisible:false,
			}
		},
		created(){
			this.getCateList()
		},
		methods:{
			async getCateList(){
				const {data : res} = await this.$http.get('categories')
				if(res.meta.status !== 200){
					return this.$message.error('获取商品分类数据失败')
				}
				this.catelist = res.data
				
				console.log(this.catelist)
			},
			handleChange(){//级联选择器选中时会触发的事件
				if(this.addForm.goods_cat.length !== 3){//只允许选择三级分类
					this.addForm.goods_cat.length = []
				}
			},
			beforeTableave(activeName, oldActiveName){//标签页的切换逻辑
				// console.log('即将离开' + oldActiveName)
				// console.log('即将进入' + activeName)
				if(oldActiveName === '0'  && this.addForm.goods_cat.length !== 3){//如果oldActiveName等于0并且没有选择三级分类,标签页不发生切换
					this.$message.error('请先选择商品分类')
					return false
				}
				
			},

			async tabClicked(){//	tab 被选中时触发
				// console.log(this.activeIndex)
				
				if(this.activeIndex === '1'){
					const {data:res}  = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
					if(res.meta.status !== 200){
						return this.$message.error('获取动态参数列表失败!')
					}
		
					//将字符串转化为数组,如果为空直接返回空数组,否则就先分割,然后返回
					res.data.forEach(item => {item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')}) 
					
					this.manyTableData = res.data
					console.log(res.data)
				}else if(this.activeIndex === '2'){
					
					const {data:res}  = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
					if(res.meta.status !== 200){
						return this.$message.error('获取静态属性失败!')
					}
					
					this.onlyTableData = res.data
					
					console.log(res.data)
				}
				
			},
			
			handlePreview(file){//处理图片预览事件
				console.log(file)
				this.previewPath = file.response.data.url
				this.previewVisible = true
			},
			handleRemove(file){//处理移除图片的操作
				//1.获取将要删除的图片的临时路径
				const filePath = file.response.data.tmp_path
				//2.从pics数组中,找到图片对应的索引值
				const i = this.addForm.pics.findIndex(x => x.pic ===filePath)
				//3.调用数组的splice方法,把图片信息对象,从pics数组中移除
				this.addForm.pics.splice(i,1)
				console.log(this.addForm)
			},
			handleSuccess(response){//监听图片上传成功的事件
				console.log(response)
				// 1.拼接得到一个图片对象
				const picInfo = {pic:response.data.tmp_path}

				//2.将图片信息对象,push到pics数组中
				this.addForm.pics.push(picInfo)
			},
			add(){
				this.$refs.addFormRef.validate(async valid => {
					if(!valid){
						return this.$message.error('请填写必要的表单项')
					}
					//执行添加的业务逻辑
					//lodash cloneDeep(obj)
					const form = _.cloneDeep(this.addForm)//深拷贝
					form.goods_cat = form.goods_cat.join(',')//数组转为字符串
					
					//处理动态参数
					this.manyTableData.forEach(item => {
						const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
						this.addForm.attrs.push(newInfo)
					})
					//处理静态参数
					this.onlyTableData.forEach(item => {
						const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
						this.addForm.attrs.push(newInfo)
					})
					
					form.attrs = this.addForm.attrs
					console.log(form)
					
					//发起网络请求
					//商品名称必须是唯一的
					const {data:res} = await this.$http.post('goods',form)
					
					if(res.meta.status !== 201){
						return this.$message.error('添加商品失败')
					}
					this.$message.success('添加商品成功')
					
					this.$router.push('/goods')//成功后跳转goods页面
					
					
				})
			}
			
		},
		computed:{
			cateId(){
				if(this.addForm.goods_cat.length === 3){
					return this.addForm.goods_cat[2]
				}
				return null
			}
		}
		
		
	}
</script>

<style>
	.el-checkbox{
		margin:0 10px 0 0 !important
	}
	.previewImg{
		width: 100%;
	}
</style>
