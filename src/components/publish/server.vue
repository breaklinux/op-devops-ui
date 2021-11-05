<template>
<span>
    <el-button type="success" size="mini" style=margin-right:10px; @click="openDialog">服务管理
    </el-button>
   <el-dialog title="Run" :visible.sync="isShow" >
      <el-form
        :model="service"
        label-position="right"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
      >
        <el-form-item label="操作环境">
          <el-input v-model="temp.env" placeholder="请选择服务" disabled />
        </el-form-item>
        <el-form-item label="服务名称">
          <el-input v-model="temp.appname" placeholder="请选择服务" disabled />
        </el-form-item>
         <el-form-item label="实例地址"> 
          <el-checkbox-group
          v-model="checkedCities"
         :min="0"
         :max="10">
          <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>
        </el-form-item>
       <el-form-item label="服务操作">
        <el-row style="margin-left:10px;" v-model="temp.operate">
          <el-button type="success" @click="sendMsg('start')" plain>服务启动</el-button>
          <el-button type="warning" @click="sendMsg('restart')" plain>服务重启</el-button>
          <el-button type="danger" @click="sendMsg('stop')" plain>服务停止</el-button>
        </el-row>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="closeDialogfun">
          关闭
        </el-button>
        <el-button type="primary" @click=ansiblePushData()>
          操作
      </el-button>
      </div>
    </el-dialog>

</span>
</template>

<script>
//import {getSeriveList, postSerivceList, putEditService, deleteService} from '@/api/service'
export default {
    name: 'server',
    props:{
      temp:{
        type: Object,
        default: ''
      },
    },
    data:()=>(
      {
        isIndeterminate: true,
        isShow:false,
        checkAll: false,
        checkedCities: [],
        cities:[],
        service: {
        app_name: '',
        env: '',
        app_ip: [],
        app_operation: ''
      },
      }
    ),
    mounted(){
      
    },
    methods:{
      openDialog() {
        this.cities = this.temp.ip.split(',')
        this.isShow = true
      },
      sendMsg(type){
        console.log(type)
      this.temp.operate = type
      },
       closeDialogfun() {
      this.isShow = false
      this.cities = []
    },
      handleCheckAllChange(val) {
        this.checkedCities = val ? this.cities : [];
        this.isIndeterminate = false;
      },
     ansiblePushData() {
      var _this50 = this
      console.log(_this50.temp)
      this.service.env = this.temp.env
      this.service.app_name = this.temp.appname
      this.service.app_ip = this.checkedCities
      this.service.app_operation = this.temp.operate
      console.log(this.service)
      postSerivceList(this.service).then(function(response) {
      
        _this50.dialogFormVisible = false
        _this50.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(function(error) {
        console.log(error)
      })
    },
    }
  }

</script>