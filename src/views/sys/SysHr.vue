<template>
  <div>
    <div style="margin-top:10px;display: flex;justify-content: center;">
      <el-input v-model="keywords" style="width: 400px;margin-right: 10px;" placeholder="通过用户名搜索用户..."
                prefix-icon="el-icon-search"></el-input>
      <el-button icon="el-icon-search" type="primary" @click="doSearch">搜索</el-button>
    </div>
    <div class="hr-container">
      <el-card class="hr-card" v-for="(hr, index) in hrs" :key="index">
        <div slot="header" class="clearfix">
          <span>{{ hr.name }}</span>
          <el-button @click="deleteHr(hr)" style="float: right; padding: 3px 0;color: #ff0000;" type="text" icon="el-icon-delete"></el-button>
        </div>
        <div>
          <div class="img-container">
            <img :src="hr.userface" :alt="hr.name" :title="hr.name" class="userface-img">
          </div>
          <div class="userinfo-container">
            <div>用户名：{{ hr.name }}</div>
            <div>手机号码：{{ hr.phone }}</div>
            <div>电话号码：{{ hr.telephone }}</div>
            <div>地址：{{ hr.address }}</div>
            <div>用户状态：
              <el-switch
                  v-model="hr.enabled"
                  @change="enabledChange(hr)"
                  active-text="启用"
                  inactive-text="禁用"></el-switch>
            </div>
            <div>用户角色：
              <el-tag type="success" style="margin-right: 4px;" v-for="(item, indexj) in hr.roles" :key="indexj">
                {{ item.nameZh }}
              </el-tag>
              <el-popover
                  placement="right"
                  title="角色列表"
                  width="200"
                  @show="showPop(hr)"
                  @hide="hidePop(hr)"
                  trigger="click">
                <el-select v-model="selectedroles" multiple placeholder="请选择">
                  <el-option
                      v-for="(r, index) in allroles"
                      :key="index"
                      :label="r.nameZh"
                      :value="r.id">
                  </el-option>
                </el-select>
                <el-button slot="reference" icon="el-icon-more" type="text"></el-button>
              </el-popover>
            </div>
            <div>备注：{{ hr.remark }}</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {getRequest, postRequest, putRequest, deleteRequest} from "@/utils/api";

export default {
  name: "SysHr",
  data() {
    return {
      keywords: '',
      hrs: [],
      allroles: [],
      selectedroles: []
    }
  },
  methods: {
    initHrs() {
      getRequest("/system/hr/?keywords="+this.keywords).then(resp => {
        if (resp) {
          this.hrs = resp;
        }
      })
    },
    initAllRoles() {
      getRequest("/system/hr/roles").then(resp => {
        if (resp) {
          this.allroles = resp;
        }
      })
    },
    enabledChange(hr) {
      delete hr.roles;
      putRequest("/system/hr/", hr).then(resp => {
        if (resp) {
          this.initHrs();
        }
      })
    },
    showPop(hr) {
      this.selectedroles = hr.roles.map(item => item.id);
      this.initAllRoles();
    },
    hidePop(hr) {
      let roles = [];
      Object.assign(roles, hr.roles);
      let flag = false;
      if (roles.length != this.selectedroles.length) {
        flag = true;
      } else {
        for (let i = 0; i < roles.length; i++) {
          let role = roles[i];
          for (let j = 0; j < this.selectedroles.length; j++) {
            let sr = this.selectedroles[j];
            if (role.id == sr) {
              roles.splice(i, 1);
              i--;
              break;
            }
          }
        }
        if (roles.length != 0) {
          flag = true;
        }
      }
      if (flag) {
        let url = "/system/hr/role?hrid=" + hr.id;
        this.selectedroles.forEach(sr => {
          url += '&rids=' + sr;
        })
        putRequest(url).then(resp => {
          if (resp) {
            this.initHrs();
          }
        })
      }
    },
    doSearch() {
      this.initHrs();
    },
    deleteHr(hr) {
      this.$confirm('此操作将删除该Hr, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRequest("/system/hr/" + hr.id).then(resp => {
          if (resp) {
            this.initHrs();
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
    this.initHrs();
  }
}
</script>

<style>
.hr-card {
  width: 350px;
  margin-bottom: 20px;
}

.hr-container {
  display: flex;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: space-around;
}

.userface-img {
  width: 72px;
  height: 72px;
  border-radius: 72px;
}

.img-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.userinfo-container {
  margin-top: 20px;
}

.userinfo-container div {
  font-size: 12px;
  color: #409eff;
}
</style>























