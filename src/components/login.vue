<template>
  <div class="container_login">
    <div class="container_box">
      <!-- 头部区域 -->
      <div class="container_logo">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        label-width="0px"
        class="form_login"
        :model="formData"
        :rules="rules"
        ref="formId"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-news"
            v-model="formData.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-edit-outline"
            v-model="formData.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按鈕區域 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="formComfirm">登录</el-button>
          <el-button type="primary" @click="formRest">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      /* 表单用户名和密码 */
      formData: {
        username: "admin",
        password: "123456",
      },
      /* 表单验证规则 */
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /* 表单的重置 */
    formRest() {
      this.$refs.formId.resetFields();
    },
    /* 表单数据格式的预验证 */
    formComfirm() {
      this.$refs.formId.validate(async (valid) => {
        if (!valid) return;
        /* 返回的是promise对象 */
        const { data } = await this.$http.post("login", this.formData);
        console.log(data);
        if (data.meta.status != 200)
          return this.$Message.error("用户名或密码错误");
        this.$Message.success("登录成功");
        /* 设置token，实现会话登录后才能访问接下来的所有页面，作用类似于cookie */
        window.sessionStorage.setItem("token", data.data.token);
        this.$router.push("/home");
      });
    },
  },
};
</script>
<style lang="less" scoped>
.container_login {
  background-color: #2b4b6b;
}
.container_box {
  width: 450px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-225px, -150px);
  background-color: #fff;
  .container_logo {
    position: absolute;
    width: 130px;
    height: 130px;
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    left: 50%;
    transform: translate(-75px, -75px);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .btn {
    display: flex;
    justify-content: flex-end;
  }
  .form_login {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
  }
}
</style>
