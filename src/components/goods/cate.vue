<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区域 -->
		<el-card>
			
			<!-- 按钮 -->
			<el-row>
				<el-col>
					<el-button type="primary" @click="showAddCatDialog">添加分类</el-button>
				</el-col>
			</el-row>
			
			<!-- 表格 -->
			<!-- 安装 运行依赖 vue-table-with-tree-grid 第三方树形插件 -->
			<tree-table class="trueTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" 
			show-index index-text="#" border :show-row-hover="false">
			
				<!-- 是否有效 -->
				<template slot="isok" slot-scope="scope">
					<i class="el-icon-success" 
					v-if="scope.row.cat_deleted === false" 
					style="color:lightgreen"></i>
					<i class="el-icon-error" v-else style="color:red"></i>
				</template>
				
				<!-- 排序 -->
				<template slot="order" slot-scope="scope">
					<el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
					<el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
					<el-tag type="warning" size="mini" v-else>三级</el-tag>
				</template>
				
				<!-- 操作 -->
				<template slot="opt" slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
				</template>
				
			</tree-table>
			

			<!-- 分页区域 -->
			<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="queryInfo.pagenum"
			      :page-sizes="[1, 2, 5, 10]"
			      :page-size="queryInfo.pagesize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			</el-pagination>
			
		</el-card>
		
		<!-- 添加分类的对话框 -->
		<el-dialog title="添加分类" :visible.sync="addCateDialogVisble" width="50%" @close="addCateDialogClose">
		  <!-- 添加分类的表单 -->
		  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
		    <el-form-item label="分类名称" prop="cat_name">
		      <el-input v-model="addCateForm.cat_name"></el-input>
		    </el-form-item>
				
		  	<el-form-item label="父级分类">
					<!-- options用来指定数据源 -->
					<!-- props用来指定配置对象 -->
						<el-cascader 
						v-model="selectedKeys" 
						:options="parentCateList" :props="cascaderProps" clearable change-on-select
						@change="parentCateChanged"></el-cascader>
						
		  	</el-form-item>
		  </el-form>
			
			<!-- 底部区域 -->
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addCateDialogVisble = false">取 消</el-button>
		    <el-button type="primary" @click="addCate">确 定</el-button>
		  </span>
		</el-dialog>
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				queryInfo:{//查询条件
					type:3,
					pagenum:1,
					pagesize:5
				},
				catelist:[],//商品分类的数据列表，默认为空
				total:0,//总数据条数
				columns:[{//为table指定列的定义
					label:'分类名称',
					prop:'cat_name'
				},{
					label:'是否有效',
					type:'template',//表示将当前列定义为模板列
					template:'isok',//表示当前这一列使用模板名称
				},{
					label:'排序',
					type:'template',//表示将当前列定义为模板列
					template:'order',//表示当前这一列使用模板名称
				},{
					label:'操作',
					type:'template',//表示将当前列定义为模板列
					template:'opt',//表示当前这一列使用模板名称
				}],
				addCateDialogVisble:false,//控制添加分类对话框的显示
				addCateForm:{//添加分类的表单数据对象
					cat_name:'',//将要添加的分类的名称
					cat_pid:0,//父级分类的id
					cat_level:0,//分类的等级,默认要添加的是一级分类
				},
				addCateFormRules:{//添加分类表单验证规则对象
					cat_name:[
						{ required: true, message: '请输入分类名称', trigger: 'blur' },
					]
				},
				
				parentCateList:[],// 父级分类的数据列表
				
				cascaderProps:{ //用来指定父级分类配置对象
					value:'cat_id',
					label:'cat_name',
					children:'children'
				},
				selectedKeys:[],//选中的父级分类的id数组

			
			}
		},
		created() {
			this.getCateList()
		},
		methods:{
			
			async getCateList(){//获取商品分类数据
				const {data : res} = await this.$http.get('categories',{ params:this.queryInfo })
				
				if(res.meta.status !== 200){
					return this.$message.error("获取商品分类数据失败");
				}
				
				console.log(res.data)
				this.catelist = res.data.result //把数据列表，赋值给catelist
				this.total = res.data.total //为总数据条数赋值
			},
			handleSizeChange(newSize) {//监听 pagesize 改变事件
			        console.log(`每页 ${newSize} 条`);
							this.queryInfo.pagesize = newSize
							this.getCateList()
			},
			handleCurrentChange(newPage) {//监听 页码值 改变事件
			        console.log(`当前页: ${newPage}`);
							this.queryInfo.pagenum = newPage
							this.getCateList()
			},
			showAddCatDialog(){//点击按钮显示添加分类的对话框
				this.getParentCateList();//先获取父级分类数据列表
				//再展示出对话框
				this.addCateDialogVisble= true
				
			},
			async getParentCateList(){//获取父级分类的数据列表
				const {data : res} = await this.$http.get('categories',{ params:{type:2}})
				if(res.meta.status !== 200){
					return this.$message.error('获取父级分类的数据失败')
				}
				console.log(res.data)
				this.parentCateList = res.data
	
			},
			parentCateChanged(){//选择项变化触发这个函数
				console.log(this.selectedKeys)
				//如果selectedKeys数组中的length大于0,证明选中的父级分类
				//反之,就说明没有选中任何父级分类
				if(this.selectedKeys.length > 0){
					this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length -1]
					//为当前的分类的等级赋值
					this.addCateForm.cat_level = this.selectedKeys.length
					return
				} else {
				//父级分类的等级赋值
				this.addCateForm.cat_pid = 0
				//为当前分类的等级赋值
				this.addCateForm.cat_level = 0
				
				}
				
			},
			addCate(){//点击按钮添加新的分类
				console.log(this.addCateForm)
				this.$refs.addCateFormRef.validate(async valid => {
					if (!valid) return
					const {data:res} = await this.$http.post('categories',this.addCateForm)
					if(res.meta.status !== 201){
						return this.$message.error('添加分类失败')
					}
					this.$message.success('添加分类成功')
					this.getCateList()
					this.addCateDialogVisble = false
				})
			},
			addCateDialogClose(){//监听对话框的关闭事件，重置表单数据
				this.$refs.addCateFormRef.resetFields()
				this.selectedKeys = []
				this.addCateForm().cat_level = 0
				this.addCateForm().cat_pid = 0
				
			}

			
			
			
		}
	}
</script>

<style lang="less" scoped>
	.trueTable{
		margin-top:15px;
	}
</style>
