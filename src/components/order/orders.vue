<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>
		
		<el-card>
			<el-row>
				<el-col :span="8">
					<el-input placeholder="请输入内容">
					    <el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
			</el-row>
			
			<!-- 订单列表数据 -->
			<el-table :data="orderlist"  border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column type="订单编号" prop="order_number"></el-table-column>
				<el-table-column type="订单价格" prop="order_price"></el-table-column>
				<el-table-column type="是否付款" prop="pay_status">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
						<el-tag type="danger"  v-else>未付款</el-tag>
					</template>
				</el-table-column>
				<el-table-column type="是否发货" prop="is_send"></el-table-column>
				<el-table-column type="下单时间" prop="create_time" >
					<template slot-scope='scope'>
						<!-- 使用分割线调用过滤器函数 -->
						{{scope.row.create_time | dateFormat}}
					</template>
				</el-table-column>
				<el-table-column type="操作">
					<template slot-scope="scope">
						<el-button size="min" type="primary" icon="el-icon-edit"></el-button>
						<el-button size="min" type="success" icon="el-icon-location"></el-button>
					</template>
				</el-table-column>
				
			</el-table>
			<!-- 分页区域 -->
			<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="queryInfo.pagenum"
			      :page-sizes="[1, 2, 5, 10]"
			      :page-size="queryInfo.pagesize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total" background>
			</el-pagination>
		</el-card>
		
		
		
	</div>
</template>

<script>
	export default {
		data(){
			return {
				queryInfo:{
					query:'',
					pagenum:1,
					pagesize:10
				},
				total:0,
				orderlist:[],
			}
		},
		created(){
			this.getOrderList()
		},
		methods:{
			async getOrderList(){
				const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
				if(res.meta.status !== 200){
					return this.$message.error('获取订单数据失败')
				}
				this.$message.success('获取订单数据成功')
				console.log(res)
				this.total = res.data.total
				this.orderlist = res.data.goods
				
			},
			handleSizeChange(newSize) {//监听 pagesize 改变事件
			        console.log(`每页 ${newSize} 条`);
							this.queryInfo.pagesize = newSize
							this.getOrderList()
			      },
			
			handleCurrentChange(newPage) {//监听 页码值 改变事件
			        console.log(`当前页: ${newPage}`);
							this.queryInfo.pagenum = newPage
							this.getOrderList()
			      },
		},
		computed:{}
		
	}
</script>

<style lang="less" scoped>
</style>
