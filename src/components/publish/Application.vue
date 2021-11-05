<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="listQuery" :inline="true" ref="listQuery">
        <el-form-item prop="appname">
           <el-input
            v-model="listQuery.appname"
            placeholder="应用名称"
            style="width: 180px;"
            class="filter-item"
            clearable
          />
        </el-form-item>
         <el-form-item prop="group">
           <el-input
            v-model="listQuery.group"
            placeholder="小组名称"
            style="width: 180px;"
            class="filter-item"
            clearable
          />
        </el-form-item>
         <el-form-item prop="level">
           <el-input
            v-model="listQuery.level"
            placeholder="应用级别"
            style="width: 180px;"
            class="filter-item"
            clearable
          />
        </el-form-item>
         <el-form-item prop="port">
           <el-input
            v-model="listQuery.port"
            placeholder="服务端口"
            style="width: 180px;"
            class="filter-item"
            clearable
          />
        </el-form-item>
         <el-form-item prop="owner">
           <el-input
            v-model="listQuery.owner"
            placeholder="应用负责人"
            style="width: 180px;"
            class="filter-item"
            clearable
          />
        </el-form-item>
         <el-form-item prop="giturl">
           <el-input
            v-model="listQuery.giturl"
            placeholder="git地址"
            style="width: 180px;"
            class="filter-item"
            clearable
          />
        </el-form-item>
         <el-form-item prop="apptype">
           <el-input
            v-model="listQuery.apptype"
            placeholder="应用类型"
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
          <el-button
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
      <el-table-column v-for="(item,index) in columns" :key="index" v-bind:label="item.alias" v-bind:prop="item.name" align="center" />
      <el-table-column label="操作" v-if="has_permission('apps_appname_view|apps_appname_add|apps_appname_edit')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">

          <el-button type="success" size="mini" @click="cicdRun(row)">
            发布
          </el-button>
          <el-button type="primary"   size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='deleted' && has_permission('apps_appname_del')" size="mini" type="danger" @click="delHost(row)">
            删除
          </el-button>
        </template>

      </el-table-column>
    </el-table>
    <br>
    <div class="block">
      <span class="demonstration" />
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[1, 5, 10, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="hostTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogCicdFormVisible">
      <el-form
        ref="dataFormdataForm"
        :model="cicd"
        label-position="right"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
      >

        <el-form-item label="发布环境" 
          prop="env"   
          :rules="[
          { required: true, message: '发布环境不能为空'}
        ]">
          <el-select v-model="cicd.env" class="filter-Itemcicd" placeholder="请选择发布环境">
            <el-option v-for="item in envList" :key="item.name" :label="item.identify" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="应用名称">
          <el-input v-model="temp.appname" placeholder="请选择服务" disabled />
        </el-form-item>
        <el-form-item label="发布分支" 
          prop="branch"   
          :rules="[
          { required: true, message: '发布分支不能为空'}
        ]">
          <el-select v-model="cicd.branch" class="filter-Itemcicd" placeholder="应用发布分支" @change="get_softpackage()">
            <el-option
              v-for="releaseitem in releaseList"
              :key="releaseitem.key"
              :label="releaseitem.display_name"
              :value="releaseitem.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="应用版本" 
          prop="appversion"   
          :rules="[
          { required: true, message: '应用版本不能为空'}
        ]">
          <el-select v-model="cicd.appversion" filterable class="filter-Itemcicd" placeholder="请选择应用版本号" @change="selectChange()">
            <el-option
              v-for="appversion in appversionList"
              :key="appversion"
              :label="appversion"
              :value="appversion"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发布类型">
          <el-radio v-model="cicd.release_type" label="VM" border size="medium">VM</el-radio>
          <el-radio v-model="cicd.release_type" label="K8S" border size="medium">K8S</el-radio>
        </el-form-item>

        <el-form-item label="实例IP"  
          prop="instance_ip"   
          :rules="[
          { required: true, message: '实例IP不能为空'}
        ]">
          <el-select v-model="cicd.instance_ip" multiple placeholder="请选择" class="filter-Itemcicd">
            <el-option
              v-for="instance_ip in options"
              :key="instance_ip.key"
              :value="instance_ip"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="GIT地址">
          <el-input v-model="temp.giturl" placeholder="GIT地址" disabled />
        </el-form-item>
        <el-form-item label="语言类型"  prop="language_type"   
          :rules="[
          { required: true, message: '语言类型不能为空'}
        ]">
          <el-select v-model="cicd.language_type" class="filter-Itemcicd" placeholder="请选择应用名称">
            <el-option v-for="item in languageList" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item label="发布原因" prop="release_reason"   
          :rules="[
          { required: true, message: '发布原因不能为空'}
        ]">
          <el-input v-model="cicd.release_reason" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="closeDialogfun">
          取消
        </el-button>
        <el-button type="primary" @click="deployCicdPushData('dataFormdataForm')">
          发布
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataFormdataForm"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="小组名称">
          <el-input v-model="temp.group" placeholder="请输入小组名称" clearable />
        </el-form-item>

        <el-form-item label="应用名称">
          <el-input v-model="temp.appname" placeholder="选择服务名称" clearable />
        </el-form-item>

        <el-form-item label="应用类型">
          <el-input v-model="temp.apptype" placeholder="应用python,java,php,vue" />
        </el-form-item>

        <el-form-item label="应用级别">
          <el-input v-model="temp.level" placeholder="请输入级别(高,中,低)" />
        </el-form-item>

        <el-form-item label="业务线" >
          <el-input v-model="temp.business" placeholder="请输入业务线" clearable />
        </el-form-item>

        <el-form-item label="GIT地址">
          <el-input v-model="temp.giturl" placeholder="请输入GIT地址" clearable />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="temp.owner" placeholder="请输入负责人" clearable />
        </el-form-item>

        <el-form-item label="服务端口">
          <el-input v-model="temp.port" placeholder="请输入服务监听端口" clearable />
        </el-form-item>

        <el-form-item label="用途">
          <el-input v-model="temp.used" placeholder="服务用途" clearable />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?postList():updateHost() ">
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
export default {
  data() {
    return {
      options:[],
      releaseList: [],
      radio2: '1',
      value1: [],
      value2: [],
      envList: [],
      languageList: [],
      number: 1,
      hostTotal: 0,
      currentPage: 1,
      pageSize: 10,
      testData: [],
      columns: [],
      item: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        appname: '',
        group: '',
        level: '',
        port: '',
        owner: '',
        giturl: '',
        apptype: '',
      },
      appversionList: [],
      elBreadcrumb: '',
      importanceOptions: [1, 2, 3],
      showReviewer: false,
      temp: {
        group: '',
        appname: '',
        business: '',
        apptype: '',
        level: '',
        owner: '',
        used: '',
        giturl: '',
        port: ''
      },
      cicd: {
        appversion: '',
        giturl: '',
        appname: '',
        env: '',
        branch: '',
        language_type: '',
        release_type: 'VM',
        release_reason: '',
        instance_ip: []
      },
      dialogFormVisible: false,
      dialogCicdFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Add',
        cicdrun: 'Run'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        use: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  mounted() {
    this.getList()
    this.get_envList()
    this.get_releaseList()
    this.get_developmentLanguageList()
  },
  methods: {
    searchBtn() {
      this.page = 1;
      this.getList()
    },
    closeDialogfun() {
      this.dialogCicdFormVisible = false
    },
    handleSizeChange: function(val) {
      this.pageSize = val
      this.getList()
    },
    confirmCicd: function() {
      if (this.dialogStatus === 'create') {
        this.postList()
      } else {
        this.deployCicdPushData()
      }
      this.deployCicdPushData()
    },

    handleCurrentChange: function(val) {
      this.currentPage = val
      this.getList()
    },
    deployCicdPushData: function(formName) {
      this.cicd.giturl = this.temp.giturl
       this.$refs[formName].validate((valid) => {
          if (valid) {
               this.$http.post('/api/jenkins/api/v1',this.cicd).then((response) => {
                console.log('发布发送请求成功')
                console.log(response)
                if (response.callbackUrl) {
                  this.$router.push({ path: '/publish/Jenkins', query: {
                    a:1
                  }})
                  localStorage.setItem('iframeUrl',response.callbackUrl)
                  this.$store.dispatch('app/setUrl', response.callbackUrl)
                } else {
                  alert('发布异常,调用接口失败')
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
   
    },
    get_envList() {
      this.$http.get('/api/configuration/environments/').then(response => {
        this.envList = response.data.data
      })
    },
    get_releaseList() {
      this.$http.get('/api/app/release/v1').then((response) => {
        this.releaseList = response.data.data
      })
    },
    get_developmentLanguageList() {
      this.$http.get('/api/app/langlist/v1').then((response) => {
      this.languageList = response.data.data
      })
    },
    get_softpackage() {
      this.cicd.appname = this.temp.appname
      this.$http.post('/api/app/searchpack/v1',this.cicd).then((response) => {
        var status = response.data.status
        var data = response.data.data
        if (status === 'true') {
          let arr = data[0].display_name
          this.appversionList = arr
        } else {
          let arr = '版本不存在'
          this.appversionList = arr
        }
      }).catch((response) => {
        console.log(response)
      })
    },
    getList() {
      this.listLoading = true;
      let obj = {
        page: this.currentPage,
        page_size: this.pageSize,
        
      };
      this.$http.get('/api/app/api/v1', {
                    params: this.obj}).then(response=> {
        this.columns = response.data.columns
        this.testData = response.data.data
        this.hostTotal = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    postList() {
      var _this50 = this
      _this50.$http.post('/api/app/api/v1',this.temp).then(function(response) {
        _this50.dialogFormVisible = false
        _this50.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
        _this50.getList()
      }).catch(function(error) {
        console.log(error)
      })
    },
    delHost(row) {
      var _this51 = this
      _this51.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/api/app/api/v1',{data:row}).then(function(response) {
          _this51.dialogFormVisible = false
          _this51.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          _this51.getList()
        }).catch(function(error) {
          console.log(error)
        })
        /* this.$message({
                type: 'success',
                message: '删除成功!'
              });*/
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    updateHost() {
      var _this52 = this
      // debugger;
      _this52.$confirm('此操作将修改该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this52.$http.put(`/api/app/api/v1`,_this52.temp).then(function(response) {
          console.log(response)
          _this52.dialogFormVisible = false
          _this52.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
          _this52.getList()
        }).catch(function(error) {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },

    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.cicd.appname = this.temp.appname
      this.temp.timestamp = new Date()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataFormdataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        group: '',
        appname: '',
        business: '',
        apptype: '',
        level: '',
        owner: '',
        used: '',
        port: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    cicdRun(row) {
      console.log(row)
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date()
      this.dialogStatus = 'cicdrun'
      this.dialogCicdFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataFormdataForm'].clearValidate()
      })
    },
    selectChange(val) {
      let instanceObj = {
        appname:  this.temp.appname,
        env: this.cicd.env,
      };
      console.log(val,this.temp.appname)
      this.$http.get('/api/instance/query/api/v1',
     {params: instanceObj}).then(res => {
        var msg = res.data.msg
        let ipList = res.data.data;
        console.log("+++")
        console.log(ipList)
         if(msg === 'success') {
           this.options = ipList[0].ip.split(",");
        } else {
          this.options = '数据不存在'   
        }
      })
    }
  }
}
</script>


