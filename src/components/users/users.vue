<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="boxCard">
      <!-- 栅格系统布局 -->
      <el-row :gutter="20">
        <!-- 搜索与添加区域 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="userQuery.query"
            clearable
          >
            <!-- 查询对应用户并展示出来 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUser"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户，使用dialog -->
        <el-col :span="2">
          <el-button type="primary" @click="AdddialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 展示数据的表格 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <!-- 使用作用域插槽来显示状态 slot-scope="scope"可以获取当前组件的信息-->
        <el-table-column prop="ma_state" label="状态">
          <template slot-scope="scope">
            <!-- {{scope.row}} 获取当前组件的所有信息-->
            <!-- 显示用户状态的组件按钮 -->
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="scope.row.mg_state"
              @change="changeState(scope.row)"
            >
              <!-- changeState改变用户的状态，并且反馈给服务器 -->
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改组件按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="修改用户信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="small"
                @click="userInformation(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除组件按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="small"
                @click="deleteUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 修改用户状态组件按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="用户状态"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-star-off"
                circle
                size="small"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userQuery.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="userQuery.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 1用户添加信息弹出框 -->
    <!-- 添加用户提示框头部 -->
    <el-dialog
      title="提示"
      :visible.sync="AdddialogVisible"
      width="30%"
      @close="dialogRestForm"
    >
      <!--添加用户提示框主体  -->
      <span>
        <!-- 添加用户提交信息的表单展示区 -->
        <el-form
          :model="UserRuleForm"
          status-icon
          :rules="UserRuleFormRules"
          ref="ruleForm"
          label-width="200px"
          label-position="top"
          class="demo-ruleForm"
        >
          <!-- 用户名 -->
          <el-form-item label="用户名" prop="username">
            <el-input
              type="text"
              v-model="UserRuleForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- 用户密码 -->
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="UserRuleForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- 用户手机号码 -->
          <el-form-item label="手机号码" prop="mobile">
            <el-input
              type="text"
              v-model="UserRuleForm.mobile"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- 用户邮箱 -->
          <el-form-item label="邮箱" prop="email">
            <el-input
              type="text"
              v-model="UserRuleForm.email"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 添加用户提示框尾部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="AdddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 2修改用户信息的弹出框 -->
    <el-dialog
      title="提示"
      :visible.sync="userDialogVisible"
      width="30%"
      @close="editDialogRest"
    >
      <!-- 2需要修改的信息展示 -->
      <span>
        <!-- 修改的用戶名 -->
        <el-form
          label-position="top"
          label-width="80px"
          :model="userEdit"
          :rules="editRules"
          ref="editRef"
        >
          <el-form-item label="用户名" prop="username">
            <el-input :placeholder="userEdit.username" :disabled="true">
            </el-input>
          </el-form-item>
          <!-- 修改的郵箱 -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userEdit.email"></el-input>
          </el-form-item>
          <!-- 修改的手機號 -->
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="userEdit.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 3需要修改的信息展示尾部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit(userEdit)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "users",
  created() {
    this.getUser();
  },
  data() {
    /* 邮箱的验证规则 */
    var checkEmail = (rule, value, callback) => {
      const regEmail =
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      if (regEmail.test(value)) {
        /* 邮箱合法 */
        return callback();
      }
      /* 邮箱不合法 */
      return callback(new Error("邮箱不合法"));
    };
    /* 手机的验证规则 */
    var checkPhone = (rule, value, callback) => {
      const regPhone =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regPhone.test(value)) {
        /* 邮箱合法 */
        return callback();
      }
      /* 邮箱不合法 */
      return callback(new Error("手机号码不合法"));
    };
    return {
      userQuery: {
        query: "",
        /* 当前页数时多少 */
        pagenum: 1,
        /* 每页显示数据的条数 */
        pagesize: 2,
      },
      /* 储存用户的数据 */
      userList: [],
      /* 记录有多少条数据 */
      total: 0,
      /* 用户添加信息框的显示和隐藏 */
      AdddialogVisible: false,
      /*添加用户时的用户框显示的数据 */
      UserRuleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      /*添加用户时的验证规则 */
      UserRuleFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在6到 12 密码", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
      },
      /* 用户信息修改时dialog框的显示和隐藏 */
      userDialogVisible: false,
      /* 储存修改用户的信息 */
      userEdit: {},
      /* 修改用户的验证规则 */
      editRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        moblie: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },
      /* 删除用户的提示框的显示和隐藏 */
      DeleteDialogVisible: false,
    };
  },
  methods: {
    /* 获取用户信息的请求函数 */
    async getUser() {
      const { data: res } = await this.$http.get("users", {
        params: this.userQuery,
      });
      if (res.meta.status !== 200) {
        return this.$Message.error(res.meta.msg);
      }
      // console.log(res);
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    /* 每页要显示的总数据条目改变时触发 */
    handleSizeChange(val) {
      this.userQuery.pagesize = val;
      this.getUser();
    },
    /* 页码变换时，页面数据的变化 */
    handleCurrentChange(val) {
      this.userQuery.pagenum = val;
      this.getUser();
    },
    /* 用户状态的改变 */
    async changeState(userState) {
      // console.log(userState);
      const { data: res } = await this.$http.put(
        `users/${userState.id}/state/${userState.mg_state}`
      );
      if (res.meta.status !== 200) {
        userState.mg_state = !userState.mg_state;
        this.$Message.error(res.meta.msg);
      }
      this.$Message.success(res.meta.msg);
    },
    /* 填加用户框消失时对表单进行重置 */
    dialogRestForm() {
      this.$refs.ruleForm.resetFields();
    },
    /*提交用户信息时用户的预验证 */
    addUser() {
      /* 表单的预验证 */
      this.$refs.ruleForm.validate(async (value) => {
        if (value != value) return;
        /* 获取创建用户的信息 */
        const { data: userInfo } = await this.$http.post(
          "users",
          this.UserRuleForm
        );
        console.log(userInfo);
        if (userInfo.meta.status !== 201) {
          this.$Message.error("用户添加失败");
          return;
        }
        this.$Message.success(`${userInfo.meta.msg}`);
        /* 添加完用户信息后隐藏dialog */
        this.AdddialogVisible = false;
        /* 重新渲染数据 */
        this.getUser();
      });
    },
    /* 用户信息修改 */
    async userInformation(value) {
      // console.log(value); /* id */
      this.userDialogVisible = true;
      const { data: userInformationChange } = await this.$http.get(
        `users/${value}`
      );
      if (userInformationChange.meta.status !== 200) {
        this.$Message.error("用户信息修改失败");
        return;
      }
      this.userEdit = userInformationChange.data;
      // console.log(this.userEdit); /* 当前用户的信息 */
    },
    /* 监视修改用户框改变的事件 */
    editDialogRest() {
      this.$refs.editRef.resetFields();
    },

    /* 用户修改后信息的预验证和提交 */
    submitEdit() {
      this.$refs.editRef.validate(async (valid) => {
        if (!valid) {
          this.$Message.error("预验证失败");
          return;
        }
        /* 预验证通过 */
        const { data: realUserIfon } = await this.$http.put(
          "users/" + this.userEdit.id,
          {
            email: this.userEdit.email,
            mobile: this.userEdit.mobile,
          }
        );
        if (realUserIfon.meta.status !== 200) {
          this.$Message.error("用户信息修改失败");
          return;
        }
        this.userDialogVisible = false;
        this.$Message.success(`${realUserIfon.meta.msg}`);
        this.getUser();
      });
    },
    /* 删除用户 ,如果用户点击删除返回
      cancel，如果点击确认返回confirm    
    */
    deleteUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async (value) => {
          // this.$message({
          //   type: "success",
          //   message: "删除成功!",
          // });
          // console.log(value);
          const { data: deleteIfo } = await this.$http.delete("users/" + id);
          // console.log(id);
          // console.log(deleteIfo);
          if (deleteIfo.meta.status !== 200) {
            this.$Message.error("删除失败");
          }
          this.$Message.success("删除成功");
          this.getUser();
        })
        .catch((err) => {
          // console.log(err);
          // this.$message({
          //   type: "info",
          //   message: "已取消删除",
          // });
          this.$Message.info("已取消删除");
        });
    },
  },
};
</script>
<style lang="less" scoped>
.boxCard {
  margin-top: 10px;
  .el-input {
    width: 300px;
  }
}
.el-table {
  margin-top: 20px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 10px;
}
</style>