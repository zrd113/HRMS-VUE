<template>
  <div>
    <div class="permissManaTool">
      <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input size="small" placeholder="请输入角色中文名" v-model="role.nameZh"></el-input>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
    </div>
    <div style="margin-top: 10px;width: 800px;">
      <el-collapse v-model="activeName" accordion @change="change">
        <el-collapse-item :title="r.nameZh" :name="r.id" :key="index" v-for="(r, index) in roles">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问的资源</span>
              <el-button @click="deleteRole(r)" style="float: right;padding: 3px 0;color: #ff0000" icon="el-icon-delete" type="text"></el-button>
            </div>
            <div>
              <el-tree
                  show-checkbox
                  node-key="id"
                  ref="tree"
                  :key="index"
                  :default-checked-keys="selectedMenus"
                  :data="allMenus" :props="defaultProps"></el-tree>
              <div style="display: flex;justify-content: flex-end;">
                <el-button @click="cancelUpdate">取消修改</el-button>
                <el-button @click="doUpdate(r.id, index)" type="primary">确认修改</el-button>
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import {getRequest, postRequest, putRequest, deleteRequest} from "@/utils/api";

export default {
  name: "PermissMana",
  data() {
    return {
      role: {
        name: '',
        nameZh: ''
      },
      roles: [],
      allMenus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectedMenus: [],
      activeName: -1
    }
  },
  methods: {
    initRoles() {
      getRequest("/system/basic/permiss/").then(resp => {
        if (resp) {
          this.roles = resp;
        }
      })
    },
    initSelectedMenus(rid) {
      getRequest("/system/basic/permiss/mids/" + rid).then(resp => {
        if (resp) {
          this.selectedMenus = resp;
        }
      })
    },
    initAllMenus() {
      getRequest("/system/basic/permiss/menus/").then(resp => {
        if (resp) {
          this.allMenus = resp;
        }
      })
    },
    change(rid) {
      if (rid) {
        this.initAllMenus();
        this.initSelectedMenus(rid);
      }
    },
    doUpdate(rid, index) {
      let tree = this.$refs.tree[index];
      let selectedKeys = tree.getCheckedKeys(true);
      let url = '/system/basic/permiss/?rid=' + rid;
      selectedKeys.forEach(key => {
        url += '&mids=' + key;
      })
      putRequest(url).then(resp => {
        if (resp) {
          this.activeName = -1;
        }
      })
    },
    cancelUpdate() {
      this.activeName = -1;
    },
    doAddRole() {
      if (this.role.nameZh && this.role.name) {
        postRequest("/system/basic/permiss/role", this.role).then(resp => {
          if (resp) {
            this.role.name = '';
            this.role.nameZh = '';
            this.initRoles();
          }
        })
      } else {
        this.$message.error("数据不可为空");
      }
    },
    deleteRole(role) {
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRequest("/system/basic/permiss/role/" + role.id).then(resp => {
          if (resp) {
            this.initRoles();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  mounted() {
    this.initRoles();
  }
}
</script>

<style>
.permissManaTool {
  display: flex;
  width: 800px;
}
</style>






















