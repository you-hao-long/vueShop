<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>参数列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区域 -->
		<el-card>
			<!-- 警告区域 -->
			<el-alert show-icon title="注意:只允许为第三级分类设置相关参数!" type="warning" :closable="false"></el-alert>
			
			<!-- 选择商品分类区域 -->
			<el-row class="cat_opt">
				<el-col>
					<span>选择商品分类：</span>
					
					<!-- 选择商品分类的级联选择框 -->
					<el-cascader
					    :options="catelist"
						:props="cateProps"
					    v-model="selectedCateKeys"
					    @change="handleChange">
					  </el-cascader>
				</el-col>
			</el-row>
			
			  <el-tabs v-model="activeName" @tab-click="handleTabClick">
				<!-- 添加动态参数的面板 -->
			    <el-tab-pane label="动态参数" name="many">
					<el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
					<!-- 动态参数表格 -->
					<el-table :data="manyTableData" border stripe>
						<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								
								<el-tag v-for="(item , i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">
									{{item}}
								</el-tag>
								
								
								<el-input
								  class="input-new-tag"
								  v-if="scope.row.inputVisible"
								  v-model="scope.row.inputValue"
								  ref="saveTagInput"
								  size="small"
								  @keyup.enter.native="handleInputConfirm(scope.row)"
								  @blur="handleInputConfirm(scope.row)"
								>
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<!-- 索引列 -->
						<el-table-column type="index"></el-table-column>
						<el-table-column label="参数名称" prop="attr_name"></el-table-column>
						
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
								<el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			    <!-- 添加静态属性的面板 -->
				<el-tab-pane label="静态属性" name="only">
					<el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
					<!-- 静态属性表格 -->
					<el-table :data="onlyTableData" border stripe>
						<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								
								<el-tag v-for="(item , i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">
									{{item}}
								</el-tag>
								
								
								<el-input
								  class="input-new-tag"
								  v-if="scope.row.inputVisible"
								  v-model="scope.row.inputValue"
								  ref="saveTagInput"
								  size="small"
								  @keyup.enter.native="handleInputConfirm(scope.row)"
								  @blur="handleInputConfirm(scope.row)"
								>
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						
						<!-- 索引列 -->
						<el-table-column type="index"></el-table-column>
						<el-table-column label="参数名称" prop="attr_name"></el-table-column>
						
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
								<el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			  </el-tabs>
		 
		</el-card>
		
		<!-- 添加动态参数对话框 -->
		<el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
			
			<!-- 添加参数对话框 -->
		  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
		    <el-form-item :label="titleText" prop="attr_name">
		      <el-input v-model="addForm.attr_name"></el-input>
		    </el-form-item>
		 </el-form>
		 
		  <span slot="footer" class="dialog-footer">
			<el-button @click="addDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="addParams">确 定</el-button>
		  </span>
		</el-dialog>
	
		<!--修改参数对话框 -->
		<el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
			
			<!-- 添加参数对话框 -->
		  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
			<el-form-item :label="titleText" prop="attr_name">
			  <el-input v-model="editForm.attr_name"></el-input>
			</el-form-item>
		 </el-form>
		 
		  <span slot="footer" class="dialog-footer">
			<el-button @click="editDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="editParams">确 定</el-button>
		  </span>
		</el-dialog>
	
	
	</div>
</template>

<script>
	export default {
		data() {
			return {
				catelist:[],//商品分类列表
				cateProps:{//级联选择框的配置对象
					value:'cat_id',
					label:'cat_name',
					children:'children'
				},
				selectedCateKeys:[],//级联选择框双向绑定
				
				activeName: 'many',
				manyTableData:[],//动态参数的数据
				onlyTableData:[],//静态属性的数据
				addDialogVisible:false,//控制添加对话框的显示与隐藏
				addForm:{attr_name:''},//添加表单数据对象
				addFormRules:{//添加表单的验证规则对象
					attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'},
					]},
				editDialogVisible:false,//控制修改对话框的显示与隐藏
				editForm:{},//修改的表单数据对象
				editFormRules:{//修改表单的验证规则对象
					attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'},
					]},
			
			}
		},
		created(){
			this.getCateList()
		},
		methods:{
			async getCateList(){//获取所有的商品分类列表
				const {data:res} = await this.$http.get('categories')
				if(res.meta.status !== 200){
					return this.$message.error('获取商品分类失败!')
				}
				this.catelist = res.data
				console.log(res.data)
			},
			handleChange(){//级联选择框选中项变化，会触发这个函数
				// if(this.selectedCateKeys.length !== 3){//证明选中的不是三级分类
				// 	this.selectedCateKeys = []
				// 	return0
				// }
				
				// //根据所选分类的id和当前所处的面板，获取对应的参数
				// const {data:res} = await this.$http.get(
				// `categories/${this.cateId}/attributes`,
				// {params:{sel:this.activeName}}
				// )
				
				// if(res.meta.status !== 200){
				// 	return this.$message.error('获取参数列表失败！')
				// }
				// console.log(res.data)
				
				this.getParamsData()
			},
			handleTabClick(){
				console.log(this.activeName)
				this.getParamsData()
			},
			async getParamsData(){//获取参数的列表数据
				if(this.selectedCateKeys.length !== 3){//证明选中的不是三级分类
					this.selectedCateKeys = []
					this.manyTableData = []
					this.onlyTableData = []
					return
				}
				
				//根据所选分类的id和当前所处的面板，获取对应的参数
				const {data:res} = await this.$http.get(
				`categories/${this.cateId}/attributes`,
				{params:{sel:this.activeName}}
				)
				
				if(res.meta.status !== 200){
					return this.$message.error('获取参数列表失败!')
				}
				
				
				res.data.forEach(item => {
					//判断attr_vals值是否为空,如果不为空则正常分割字符串,否则返回空白的数组
					item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [],
					
					//控制文本框的显示与隐藏
					item.inputVisible = false
					//文本框输入的值
					item.inputValue = ''
				})
				
				console.log(res.data)
				
				if(this.activeName === 'many'){//如果当前是动态参数页面
					this.manyTableData = res.data
				}else{
					this.onlyTableData = res.data
				}
			},
			addDialogClosed(){//监听对话框的关闭事件
				this.$refs.addFormRef.resetFields()
			},
			addParams(){//点击按钮添加参数
				this.$refs.addFormRef.validate(async valid => {
					if(!valid) return
					const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
						attr_name:this.addForm.attr_name,
						attr_sel:this.activeName
					})
					if(res.meta.status !== 201){
						return this.$message.error('添加参数失败')
					}
					this.$message.success('添加参数成功')
					this.addDialogVisible = false
					this.getParamsData()
				})
			},
			async showEditDialog(attr_id){//点击按钮,展示修改的对话框
				//查询当前参数的信息
				const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{params:{attr_sel:this.activeName}})
				if(res.meta.status !== 200){
					return this.$message.error('获取参数信息失败')
				}
				this.editForm = res.data
				this.editDialogVisible = true
			},
			editDialogClosed(){//重置修改的表单
				this.$refs.editFormRef.resetFields()
			},
			editParams(){//点击按钮修改参数信息
				this.$refs.editFormRef.validate(async vaild => {
					if (!vaild) return
					const {data : res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
					{attr_name:this.editForm.attr_name,attr_sel:this.activeName})
					if (res.meta.status !== 200){
						return this.$message.error('修改参数失败')
					}
					this.$message.success('修改参数成功')
					this.getParamsData()
					this.editDialogVisible = false
					
				})
			},
			async removeParams(attr_id){//根据id删除对应的参数项
				const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).catch(err => err)
						
						
				if (confirmResult !== 'confirm') {//当用户取消删除的操作
					return this.$message.info('已取消删除')
				}		
				const {data : res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
				
				if (res.meta.status !== 200) {
					return this.$message.error('删除参数失败!')
				}
				
				this.$message.success('删除参数成功')
				this.getParamsData()
			},
			async handleInputConfirm(row) {//文本框失去焦点或者摁下了 enter 都会触发
				if(row.inputValue.trim().length === 0){//清空空格并判断是否有内容
					row.inputValue = ''
					row.inputVisible = false
					return
				}
				
				//如果没有return,则证明输入内容,需要做后续处理
				row.attr_vals.push(row.inputValue.trim())
				row.inputValue = ''
				row.inputVisible = false
				
				//需发起请求 保存这次操作
				this.saveAttrVals(row)
				
				
			},
			showInput(row){//点击按钮,展示文本输入框
				 row.inputVisible = true
				 
				 // $nextTick 的方法作用,就是当页面上元素被重新渲染之后,才会指定回调函数中的代码
				  this.$nextTick(_ => { //让文本自动获得焦点
				           this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			
			async saveAttrVals(row){
				//需发起请求 保存这次操作
				const {data : res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
				{attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(' ')})
				
				if(res.meta.status !== 200){
					return this.$message.error('操作失败!')
				}
				this.$message.success('操作成功!')
			
			},
			async handleClose(i,row){//删除对应的参数可选项
				row.attr_vals.splice(i,1)
				//需发起请求 保存这次操作
				this.saveAttrVals(row)
			}
			
		},
		computed:{
			//如果按钮需要被禁用，则返回true，否则返回false
			isBtnDisabled(){
				if(this.selectedCateKeys.length !== 3){
					return true
				}
				return false
			},
			cateId(){//当前选中的三级分类的id
				if(this.selectedCateKeys.length === 3){
					
					return this.selectedCateKeys[2]
					
				}
				return null
			},
			titleText(){
				//动态计算标题的文本
				if(this.activeName === 'many'){
					return '动态参数'
				}
				return '静态属性'
			}
		}
	}
</script>

<style lang="less" scoped>
 .cat_opt{
	 margin:15px 0;
 }
 .el-tag {
    margin: 10px;
  }
 .input-new-tag {
      width: 120px;
    }

</style>

