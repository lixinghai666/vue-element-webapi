<template>
  <div class="warp-main">
    <div>
      <div>
        <el-dialog
          title="添加用户"
          @close="addDialogClose"
          :visible.sync="dialogTableVisible"
          :close-on-click-modal="false"
        >
          <el-form ref="addFormRef" :rules="rulesAddUser" :model="addUser" label-width="100px">
            <el-form-item prop="constructionUnit" label="建设单位">
              <el-input v-model="addUser.constructionUnit"></el-input>
            </el-form-item>
            <el-form-item prop="projectName" label="项目名称">
              <el-input v-model="addUser.projectName"></el-input>
            </el-form-item>
            <el-form-item prop="projectPlace" label="项目地点">
              <el-input v-model="addUser.projectPlace"></el-input>
            </el-form-item>
            <el-form-item prop="contract" label="合同编号">
              <el-input v-model="addUser.contract"></el-input>
            </el-form-item>
            <el-form-item prop="projectProgress" label="项目进度">
              <el-radio-group v-model="addUser.projectProgress">
                <el-radio label="收集资料"></el-radio>
                <el-radio label="签订合同"></el-radio>
                <el-radio label="开始安装"></el-radio>
                <el-radio label="安装完成"></el-radio>
                <el-radio label="验收完成"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="installNum" label="安装数量">
              <el-radio-group v-model="addUser.installNum">
                <el-radio label="1"></el-radio>
                <el-radio label="2"></el-radio>
                <el-radio label="3"></el-radio>
                <el-radio label="4"></el-radio>
                <el-radio label="5"></el-radio>
                <el-radio label="6"></el-radio>
                <el-radio label="7"></el-radio>
                <el-radio label="8"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="payback" label="回款情况">
              <el-radio-group v-model="addUser.payback">
                <el-radio label="未收款"></el-radio>
                <el-radio label="已收款"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogTableVisible = false">取消</el-button>
              <el-button type="primary" @click="onAddUser">确定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <el-table
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        border
        style="width: 100%; margin-top: 10px"
        :max-height="tableHeight"
        :row-class-name="tableRowClassName"@row-click ="onRowClick"
      >
        <el-table-column prop="number" label="序号" width="80" sortable></el-table-column>
        <el-table-column prop="constructionUnit" label="建设单位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="projectPlace" label="项目地点" show-overflow-tooltip></el-table-column>
        <el-table-column prop="contract" label="合同编号" width="100"></el-table-column>
        <el-table-column prop="projectProgress" label="项目进度" width="100"></el-table-column>
        <el-table-column prop="installNum" label="安装数量" width="90"></el-table-column>
        <el-table-column prop="payback" label="回款情况" width="90"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              icon="el-icon-edit"
              @click="dialogFormVisible = true"
            ></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="open"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <div style="float:left;padding-top:15px;">
          <el-button @click="dialogTableVisible = true">新增数据</el-button>
          <el-button @click="update()">导出excel</el-button>
        </div>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="pagesize"
            layout="total, sizes,prev, pager, next"
            :total="tableData.length"
            prev-text="上一页"
            next-text="下一页"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "app",
  data() {
    return {
      dialogTableVisible: false, // 添加用户弹框
      // 添加用户
      addUser: {
        constructionUnit: "",
        projectName: "",
        projectPlace: "",
        contract: "",
        projectProgress: "",
        installNum: "",
        payback: ""
      },
      // 验证规则
      rulesAddUser: {
        constructionUnit: [
          { required: true, message: "请输入建设单位名称", trigger: "blur" }
        ],
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        projectPlace: [
          { required: true, message: "请输入项目地点", trigger: "blur" }
        ],
        contract: [
          { required: true, message: "请输入合同编号", trigger: "blur" }
        ]
      },
      tableHeight: "600",
      currentPage: 1, //默认显示页面为1
      pagesize: 10, //    每页的数据条数
      tableData: [] //需要data定义一些，tableData定义一个空数组，请求的数据都是存放这里面
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    addDialogClose() {
      this.$refs.addFormRef.resetFields(); // 清空表单
    },
    onAddUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return null  // 如果验证失败就不往下继续执行
        const { data: res } = await this.$http.post('/api/Insert', this.addUser)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加成功')
        this.dialogTableVisible = false  // 关闭弹框
        this.$refs.addFormRef.resetFields() // 清空表单
        this.getUserList() // 重新调用，刷新表单
      })
    },
    getData() {
      axios.get("/api/").then(
        response => {
          console.log(response.data);
          var obj = JSON.parse(response.data);     
          this.tableData = obj;
        },
        response => {
          console.log("error");
        }
      );
    },
    tableRowClassName ({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
      onRowClick (row, event, column) {
        //行点击消除new标记
        var index = row.index;
        var deleteIndex = Array.indexOf(this.showIndexArr, index);
        if (deleteIndex != -1) {
         this.showIndexArr.splice(deleteIndex,1);  
       }
     },
    //每页下拉显示数据
    handleSizeChange: function(size) {
      this.pagesize = size;
      /*console.log(this.pagesize) */
    },
    //点击第几页
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      /*console.log(this.currentPage) */
    },
    handleEdit(index, row) {
      this.$set(row, "isEgdit", false);
    },
    handleSave(index, row) {
      console.log(index, row);
    },
    open() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {          
          axios.get("/api/delete?id=4").then(
             response => {
         if(response.data=1)
         {
            this.$message({
            type: "success",
            message: "删除成功!"
          });
         }
         else{
           this.$message({
            type: "success",
            message: "删除失败!"
          });
         }
        },
        response => {
          this.$message({
            type: "success",
            message: "删除失败!"
          });
        }
      );          
         
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    add() {
      dialogVisible: true;
    }
  },
  table: {}
};
</script>
<style>
.el-table th {
  text-align: center;
}

.el-table tbody tr td  /*:first-child */ {
  text-align: center;
}
</style>