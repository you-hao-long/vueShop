<template>
	<div>
		<el-card>
				<!-- 第二步 为ECharts准备一个具备大小（宽高）的Dom -->
		    <div id="main" style="width: 1000px;height:600px;"></div>
		</el-card>
		
	</div>
</template>

<script>
	import * as echarts from 'echarts';//第一步 导入echarts
	import _ from 'lodash';//使用深拷贝
	export default {
		data(){
			return {
				options: {//需要合并的数据
				        title: {
				          text: '用户来源'
				        },
				        tooltip: {
				          trigger: 'axis',
				          axisPointer: {
				            type: 'cross',
				            label: {
				              backgroundColor: '#E9EEF3'
				            }
				          }
				        },
				        grid: {
				          left: '3%',
				          right: '4%',
				          bottom: '3%',
				          containLabel: true
				        },
				        xAxis: [
				          {
				            boundaryGap: false
				          }
				        ],
				        yAxis: [
				          {
				            type: 'value'
				          }
				        ]
				      }
			}
		},
		created(){},
		async mounted(){
			//mounted 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作
			
			// 第三步 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main'));
			
			const {data:res} = await this.$http.get('reports/type/1')
			
			const result = _.merge(res.data , this.options);//将获取到的数据和需要合并的数据两个对象组成一个新对象
			
			
			// 第四步 指定图表的配置项和数据
			        // var option = {
			        //     title: {
			        //         text: 'ECharts 入门示例'
			        //     },
			        //     tooltip: {},
			        //     legend: {
			        //         data:['销量']
			        //     },
			        //     xAxis: {
			        //         data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
			        //     },
			        //     yAxis: {},
			        //     series: [{
			        //         name: '销量',
			        //         type: 'bar',
			        //         data: [5, 20, 36, 10, 10, 20]
			        //     }]
			        // };
			
			// 第五步 使用刚指定的配置项和数据显示图表。
			myChart.setOption(result);
			
			
		},
		methods:{
			

		},
		computed:{}
	}
</script>

<style>
</style>
