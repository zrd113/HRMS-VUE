<template>
  <div>
    <div style="display: flex;justify-content: space-between;">
      <el-button icon="el-icon-plus" type="primary" @click="showAddSalaryView">添加工资账套</el-button>
      <el-button icon="el-icon-refresh" type="success"></el-button>
    </div>
    <div style="margin-top: 10px;">
      <el-table :data="salaries" border stripe>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column width="120" prop="name" label="账套名称"></el-table-column>
        <el-table-column width="70" prop="basicSalary" label="基本工资"></el-table-column>
        <el-table-column width="70" prop="trafficSalary" label="交通补助"></el-table-column>
        <el-table-column width="70" prop="lunchSalary" label="午餐补助"></el-table-column>
        <el-table-column width="70" prop="bonus" label="奖金"></el-table-column>
        <el-table-column width="100" prop="createDate" label="启用时间"></el-table-column>
        <el-table-column label="养老金" align="center">
          <el-table-column width="70" prop="pensionPer" label="比率"></el-table-column>
          <el-table-column width="70" prop="pensionBase" label="基数"></el-table-column>
        </el-table-column>
        <el-table-column label="医疗保险" align="center">
          <el-table-column width="70" prop="medicalPer" label="比率"></el-table-column>
          <el-table-column width="70" prop="medicalBase" label="基数"></el-table-column>
        </el-table-column>
        <el-table-column label="公积金" align="center">
          <el-table-column width="70" prop="accumulationFundPer" label="比率"></el-table-column>
          <el-table-column width="70" prop="accumulationFundBase" label="基数"></el-table-column>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button>编辑</el-button>
            <el-button type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
        title="添加工资账套"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
      <div style="display: flex;justify-content: space-around;align-items: center;">
        <el-steps direction="vertical" :active="activeItemIndex">
          <el-step :title="item" v-for="(item, index) in salaryItemName" :key="index"></el-step>
        </el-steps>
        <el-input style="width: 200px;" v-show="activeItemIndex==index" :placeholder="'请输入' + item + '...'" v-for="(item, index) in salaryItemName" :key="index"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="preStep">{{activeItemIndex==9?'取消':'上一步'}}</el-button>
        <el-button type="primary" @click="nextStep">{{activeItemIndex==9?'完成':'下一步'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getRequest, postRequest, putRequest, deleteRequest} from "@/utils/api";

export default {
  name: "SalSob",
  data() {
    return {
      salaries: [],
      dialogVisible: false,
      activeItemIndex: 1,
      salaryItemName: [
          '基本工资',
          '交通补助',
          '午餐补助',
          '奖金',
          '养老金比率',
          '养老金基数',
          '医疗保险比率',
          '医疗保险基数',
          '公积金比率',
          '公积金基数'
      ]
    }
  },
  mounted() {
    this.initSalaries();
  },
  methods: {
    initSalaries() {
      getRequest("/salary/sob/").then(resp => {
        if (resp) {
          this.salaries = resp;
        }
      })
    },
    showAddSalaryView() {
      this.dialogVisible = true;
    },
    nextStep() {
      if (this.activeItemIndex == 9) {
        return;
      }
      this.activeItemIndex++;
    },
    preStep() {
      if (this.activeItemIndex == 0) {
        return;
      } else if (this.activeItemIndex == 9) {
        this.dialogVisible = false;
        return;
      }
      this.activeItemIndex--;
    }
  }
}
</script>

<style scoped>

</style>









