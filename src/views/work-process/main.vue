<template>
  <div class="warp-main">
    <el-row :span="24" v-loading="loading" element-loading-text="拼命加载中">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="请输入企业名称" auto-complete="off" @keyup.enter.native="fetchData"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" v-on:click="fetchData">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table ref="multipleTable" :data="tableData"  border style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="eNumber" label="序号" width="100" sortable></el-table-column>
        <el-table-column prop="eName" label="终端编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="eIndustry" label="温度" width="120"></el-table-column>
        <el-table-column prop="eRange" label="湿度" width="120"></el-table-column>
        <el-table-column prop="eModel" label="照度" width="120"></el-table-column>
        <el-table-column prop="createTime" label="噪音" width="120"></el-table-column>
        <el-table-column prop="updateTime" label="PM0.5" width="120"></el-table-column>
        <el-table-column prop="recordStatus" label="PM5.0" width="120"></el-table-column>
        <el-table-column prop="time" label="更新时间" width="220"></el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="toggleSelection([tableData3[1], tableData3[2]])">切换第二、第三行的选中状态</el-button>
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>
      <el-col :span="24" class="toolbar">
        <el-pagination background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 50, 100, 200]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import API from '../../api/api_enterprise'
  export default {
    data() {
      return {
        loading: false,
        keyword: "集团",
        total: 5,
        currentPage: 1,
        pageSize: 10,
         tableData: [
         {
          eNumber: 'A10001',
          eName: 'tj3543ab001',
          eIndustry: '23.5',
          eRange: '45.3',
          eModel: '345',
          createTime: '56',
          updateTime: '987',
          recordStatus: '1',
          time: '2019-10-31 12:22:21'
        },



        {
          eNumber: 'A10001',
          eName: 'tj3543ab001',
          eIndustry: '23.5',
          eRange: '45.3',
          eModel: '345',
          createTime: '56',
          updateTime: '987',
          recordStatus: '1',
          time: '2019-10-31 12:22:21'
        },
     
        ],
        multipleSelection: [],
        filters: {
          name: ''
        }
      }
    },
    created: function(){
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
     // this.fetchData();  //调用接口获取动态数据

    },
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(function(row) {
            this.$refs.multipleTable.toggleRowSelection(row);
        });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      fetchData(){ //获取数据
        let that = this;
        let params = {
          curr: that.currentPage,
          pageSize: that.pageSize,
          keywords: that.filters.name
        };
        that.loading = true;
        API.findList(water).then(function(result){
          that.loading = false;
          that.total = result.count;
          that.currentPage = result.curr;
          that.tableData = result.data;
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
        });
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.currentPage = 1;
        this.fetchData();
//        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.fetchData();
//        console.log(`当前页: ${val}`);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  }
</script>
<style>
  .el-table th {
    text-align: center;
  }

  .el-table tbody tr td  /*:first-child */ {
    text-align: center;
  }
</style>
