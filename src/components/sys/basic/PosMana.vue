<template>
  <div>
    <div>
      <el-input
          class="addPosInput"
          style="width: 300px;margin-right: 8px;"
          size="small"
          placeholder="添加职位..."
          prefix-icon="el-icon-plus"
          v-model="pos.name">
      </el-input>
      <el-button @click="addPosition" icon="el-icon-plus" size="small" type="primary">
        添加
      </el-button>
    </div>
    <div class="posManaMain">
      <el-table
          :data="positions"
          border
          stripe
          size="small"
          style="width: 70%"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职位名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="createDate"
            width="150"
            label="创建时间">
        </el-table-column>
        <el-table-column
            label="是否启用">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.enabled">已启用</el-tag>
            <el-tag size="small" type="danger" v-else>未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="deleteMany" :disabled="multipleSelection.length==0" type="danger" size="small" style="margin-top: 8px;">批量删除</el-button>
    </div>
    <el-dialog
        title="编辑职位"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <div>
          <el-tag>职位名称</el-tag>
          <el-input class="updatePosInput" v-model="updatePos.name" size="small"></el-input>
        </div>
        <div>
          <el-tag>是否启用</el-tag>
          <el-switch
            v-model="updatePos.enabled"
            active-text="启用"
            inactive-text="禁用">
          </el-switch>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getRequest, postRequest, deleteRequest, putRequest} from "@/utils/api";

export default {
  name: "PosMana",
  data() {
    return {
      pos: {
        name: ''
      },
      positions: [],
      dialogVisible: false,
      multipleSelection: [],
      updatePos: {
        name: '',
        enabled: false
      }
    }
  },
  mounted() {
    this.initPositions();
  },
  methods: {
    initPositions() {
      getRequest("/system/basic/pos/").then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
    },
    handleEdit(index, data) {
      Object.assign(this.updatePos, data);
      this.dialogVisible = true;
    },
    handleDelete(index, data) {
      this.$confirm('此操作将删除' + data.name + '职位，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRequest("/system/basic/pos/" + data.id).then(resp => {
          if (resp) {
            this.initPositions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addPosition() {
      if (this.pos.name) {
        postRequest("/system/basic/pos/", this.pos).then(resp => {
          if (resp) {
            this.initPositions();
            this.pos.name = '';
          }
        })
      } else {
        this.$message.error("职位名称不可为空");
      }
    },
    doUpdate() {
      putRequest("/system/basic/pos/", this.updatePos).then(resp => {
        if (resp) {
          this.initPositions();
          this.updatePos.name = '';
          this.dialogVisible = false;
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteMany() {
      this.$confirm('此操作将删除' + this.multipleSelection.length + '条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        })
        deleteRequest("/system/basic/pos/" + ids).then(resp => {
          if (resp) {
            this.initPositions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style>
.updatePosInput {
  width: 200px;
  margin-left: 8px;
}

.addPosInput {
  width: 300px;
  margin-right: 8px;
}

.posManaMain {
  margin-top: 10px;
}

</style>