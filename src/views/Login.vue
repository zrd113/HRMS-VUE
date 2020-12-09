<template>
  <div>
    <el-form
        class="loginContainer"
        v-loading="loading"
        element-loading-text="正在登陆..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0,0,0,0.8)"
        ref="loginForm"
        :rules="rules"
        :model="loginForm">
      <h3 class="loginTitle">系统登陆</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="text" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input style="width: 250px;" type="text" v-model="loginForm.code" auto-complete="off" placeholder="点击图片更换验证码"></el-input>
        <img :src="vcUrl" @click="updateVerifyCode" />
      </el-form-item>
      <el-checkbox class="loginRemember" v-model="checked">记住密码</el-checkbox>
      <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import {postKeyValue} from "@/utils/api";

export default {
  name: "Login",
  data() {
    return {
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'}],
      },
      checked: true,
      loginForm: {
        username: 'admin',
        password: '123',
        code: ''
      },
      loading: false,
      vcUrl: '/verifyCode?time=' + new Date()
    }
  },
  methods: {
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          postKeyValue('/doLogin', this.loginForm).then(resp => {
            this.loading = false;
            if (resp) {
              this.$store.commit('INIT_CURRENTHR', resp.obj);
              window.sessionStorage.setItem("user", JSON.stringify(resp.obj));
              let path = this.$route.query.redirect;
              this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
            } else {
              this.updateVerifyCode();
            }
          })
        } else {
          this.$message.error('请输入所有字段');
          return false;
        }
      })
    },
    updateVerifyCode() {
      this.vcUrl = '/verifyCode?time=' + new Date();
    }
  }
}
</script>

<style>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 15px auto 20px auto;
  text-align: center;
  color: #505458;
}

.loginRemember {
  text-align: left;
  margin: 0px 0px 20px 0px;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}
</style>