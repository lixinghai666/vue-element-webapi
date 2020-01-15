<template>
  <div id="app">
    <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'sid', order: 'age'}" >
        <el-table-column
                prop="sid"
                label="编号"
                sortable
                width="180">
        </el-table-column>
        <el-table-column
                prop="sname"
                label="姓名"
                sortable
                width="180">
        </el-table-column>
        <el-table-column
                prop="age"
                label="年龄"
                sortable
                width="180">
        </el-table-column>
    </el-table>
</div>
</template>
<script>
import axios from 'axios';
    export default {
        data: {
          
                tableData: []
        },
         methods: {

        },
        mounted: function () {
            var _this = this   //很重要！！
            axios.get('/api/test1.json')
                .then(function (res) {
                    console.log(res);
                    _this.tableData = res.data
                })
                .catch(function (error) {
                    console.log(error);
                });
        
        }
    }
</script>