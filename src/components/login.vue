<template>
	<div class="login_container">
		<div class="login_box">
				<!-- 头像区域 -->
			<div class="acatar_box">
				<img src="../assets/myTouxiang.jpg" alt="">
			</div>
			<!-- 表单区域 -->
			<el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
			  <el-form-item prop="username">
			    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
			  </el-form-item>
				<el-form-item prop="password">
				  <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
				</el-form-item>
				<el-form-item class="btns">
				  <el-button type="primary" @click="login">登录</el-button>
					<el-button type="infor" @click="resetLoginFrom">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				// 登录表单数据绑定
				loginForm:{
					username:'admin',
					password:'123456'
				},
				//表单验证
				loginFormRules:{
					username: [
									{ required: true, message: '请输入登录名称', trigger: 'blur' },
									{ min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
					      ],
					password: [
									{ required: true, message: '请输登录密码', trigger: 'blur' },
									{ min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }   
								],
				}
				
			}
		},
		methods:{
			//重置登录表单
			resetLoginFrom(){
				this.$refs.loginFormRef.resetFields();
			},
			login(){
				this.$refs.loginFormRef.validate( async valid => {
					if (!valid) return;//登录预验证，验证不通过不发起请求
					const { data : res } = await this.$http.post('login',this.loginForm);//解构data属性
					console.log(res);
					if(res.meta.status !== 200){
						this.$message.error(res.meta.msg)
					} else {
						this.$message.success(res.meta.msg)
						
						
					}
					
					//1.0 将登录成功之后的token保存到客户端 sessionStorage 中
					//1.1 项目中除了登录之外的其他API接口,必须在登录之后才能访问
					//1.2 token只应在当前网站打开期间生效,所以将token保存在 sessionStorage 中
					window.sessionStorage.setItem('token', res.data.token)
				
					// 通过编程式导航跳转到后台主页
					this.$router.push('/home')
					
					
				});
			}
		}
	}
</script>

<style lang="less" scoped>
.login_container{
	background-color: #2b4b6b;
	color:#800080;
	height: 100%;
}
.login_box{
	width: 450px;
	height: 300px;
	background-color: #fff;
	border:3px;
	position:absolute;
	left:50%;
	top:50%;
	transform:translate(-50%,-50%);
}
.acatar_box{
	width: 130px;
	height:130px;
	border:1px solid #eee;
	border-radius:50%;
	padding: 10px;
	box-shadow: 0 0 10px #ddd;
	left:50%;
	position:absolute;
	transform:translate(-50%,-50%);
	background-color: #fff;
	img{
		width: 100%;
		height: 100%;
		border-radius:50%;
		background-color: #eee;
	}
}
.login_form{
	position:absolute;
	bottom:0;
	width: 100%;
	padding:0 20px;
	box-sizing:border-box;
}
.btns{
	display: flex;
	justify-content: flex-end;
}

</style>


