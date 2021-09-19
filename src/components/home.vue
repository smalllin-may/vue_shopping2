<template>
  <el-container class="container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/header.png" alt="" />
        <span>孙浩佳的管理系统</span>
      </div>
      <el-button type="danger" @click="loginOut">退出</el-button></el-header
    >
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠栏区域 -->
        <div class="totalChange" @click="totalChange">|||</div>
        <!-- 导航栏 -->
        <el-menu
          unique-opened
          background-color="#303642"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          collapse-transition
          router
          :default-active="higthLight"
        >
          <!-- 第一级导航栏 -->
          <el-submenu
            :index="value.id + ''"
            v-for="value in asideList"
            :key="value.id"
          >
            <!-- 第一级导航栏模板 -->
            <template slot="title">
              <!-- 第一导航栏图标 -->
              <i :class="fontLogo[value.id]"></i>
              <span>{{ value.authName }}</span>
            </template>
            <!-- 第二导航栏 -->
            <el-menu-item
              :index="child.path"
              v-for="child in value.children"
              :key="child.id"
              @click="light(child.path)"
            >
              <!-- 第二导航栏模板 -->
              <template slot="title">
                <!-- 第二导航栏图标 -->
                <i class="el-icon-menu"></i>
                <span>{{ child.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "home",
  /* 一进入home页面就调用后台获取的数据的函数 */
  created() {
    this.menuList();
    this.higthLight = window.sessionStorage.getItem("higthLight");
  },
  data() {
    return {
      /* 储存侧边栏从数据库获取的数据 */
      asideList: [],
      /* 储存侧边栏的字体图标 */
      fontLogo: {
        125: "iconfont icon-users",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isCollapse: false,
      higthLight: "",
    };
  },
  methods: {
    /* 退出按钮功能 */
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    /* 获取侧边栏的数据 */
    async menuList() {
      const { data: res } = await this.$http.get("menus");
      /* 如果获取数据失败，就显示获取数据失败 */
      if (res.meta.status != 200) return this.$Message.error(res.meta.msg);
      this.asideList = res.data;
      // console.log(res);
    },
    /* 侧边栏缩放的函数 */
    totalChange() {
      this.isCollapse = !this.isCollapse;
    },
    /* 设置侧边栏导航高亮的效果 保存链接的激活状态*/
    light(m) {
      window.sessionStorage.setItem("higthLight", m);
      this.higthLight = m;
    },
  },
};
</script>
<style lang="less" scoped>
.el-header {
  display: flex;
  background-color: #32393c;
  padding: 0;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    height: 100%;
    align-items: center;
    img {
      height: 100%;
    }
  }
}
.el-aside {
  background-color: #303642;
  .el-menu {
    border: 0;
  }
  span {
    margin-left: 8px;
  }
  .totalChange {
    background-color: #32393c;
    text-align: center;
  }
}
.el-main {
  background-color: #e1e6e9;
}
.container {
  height: 100%;
}
</style>