<template>
  <div class="app-container">
    <div class="filter-container">
    <el-form :model="listQuery" :inline="true" ref="listQuery">
        <el-form-item prop="username">
           <el-input
            v-model="listQuery.username"
            placeholder="登录用户名称"
            style="width: 180px;"
            class="filter-item"
            clearable
          />
        </el-form-item>
         <el-form-item prop="name">
           <el-input
            v-model="listQuery.name"
            placeholder="用户全名"
            style="width: 180px;"
            class="filter-item"
            clearable
          />
        </el-form-item>
         <el-form-item prop="mail">
           <el-input
            v-model="listQuery.mail"
            placeholder="用户邮箱"
            style="width: 180px;"
            class="filter-item"
            clearable
          />
        </el-form-item>
        <el-form-item>
           <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchBtn">
            搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="has_permission('system_ldap_add')" 
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreate"
          >
            新建
          </el-button>
        </el-form-item>

      </el-form>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="testData"
      border
      highlight-current-row
      style="width: 100%;"
    >

      <el-table-column v-for="(item,index) in columns" :key="index" :label="item.alias" :prop="item.name" align="center" />
      <el-table-column label="操作"  v-if="has_permission('system_ldap_view|system_ldap_add|system_ldap_edit')" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.status!='deleted' && has_permission('system_ldap_del')"   size="mini" type="danger" @click="delLdap(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <br >
    <div class="block">
      <span class="demonstration" />
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[1, 5, 10, 100]"
        :page-size="listQuery.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="hostTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form
        ref="dataFormdataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >

        <el-form-item label="登录名" prop="username" >
          <el-input v-model="temp.username" placeholder="请输入登录用户"  />
        </el-form-item>

        <el-form-item label="全名" prop="fullname">
          <el-input v-model="temp.name" placeholder="请输入ldap用户全名" />

        </el-form-item>

       <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.mail" placeholder="请注意邮箱是接受密码的地址,不要随便填" />
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="postListLdap()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const calendarTypeOptions = [
  { key: 'dev', display_name: '开发环境' },
  { key: 'test', display_name: '测试环境' },
  { key: 'test2', display_name: '测试环境2' },
  { key: 'pre', display_name: '预生产环境' },
  { key: 'pro', display_name: '生产环境' }
]
export default {
  data() {
    return {
      hostTotal: 0,
      currentPage: 1,
      pageSize: 5,
      testData: [],
      columns: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        username: '',
        name: '',
        mail: ''
      },
      appList: [],
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      clearValidate: '',
      showReviewer: false,
      temp: {
        id:'',
        username: '',
        name: '',
        mail: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Add'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        username: [{ required: true, message: 'type is required', trigger: 'change' },{ min: 4, max: 30, message: '长度在 4 到 25 个字符', trigger: 'blur'}],
        fullname:[{ required: true, message: 'type is required', trigger: 'change' },{ min: 5, max: 30, message: '长度在 5 到 28 个字符', trigger: 'blur'}],
        email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' },{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getListLdap()
  },
  methods: {
    searchBtn() {
      this.listQuery.page = 1;
      this.getListLdap();
    },
    handleSizeChange: function(val) {
      this.listQuery.page_size = val
      this.getListLdap()
    },
    handleCurrentChange: function(val) {
      this.listQuery.page = val
      this.getListLdap()
    },
    getListLdap() {
       this.$http.get('/api/ldap/api/v1', {
                    params: this.listQuery
                }).then(response => {
        this.columns = response.data.columns
        this.testData = response.data.data
        this.hostTotal = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getListLdap()
    },
    postListLdap() {
      this.$http.post('/api/ldap/api/v1',this.temp).then(response => {
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
        this.getListLdap()
      })
    },
    
    delLdap(row) {    
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         this.$http.delete('/api/ldap/api/v1',{data:row}).then(response =>{
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          }) 
        
          this.getListLdap()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataFormdataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        id:'',
        usernmae: '',
        name: '',
        mail: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    }
  }
}
</script>