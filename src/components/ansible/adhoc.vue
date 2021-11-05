<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
        <hr
          style="height: 1px; border-top: 1px dashed rgb(0, 102, 204); border-right: none; border-bottom: none; border-left: none; border-image: initial;"
        >
        <el-row>
          <el-col :span="6">

            <label class="el-form-item__label">主机</label>
            <el-select v-model="ansibleForm.chooes" filterable multiple placeholder="请选择主机">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.instanceip"
                :value="item.instanceip"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <label class="el-form-item__label">模块</label>
            <el-select v-model="ansibleForm.command" filterable collapse-tags placeholder="请选择模块">
              <el-option
                v-for="item in options02"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-col>

          <el-col :span="6">
            <label class="el-form-item__label">命令</label>
            <el-input
              v-model="ansibleForm.args"
              multiple
              collapse-tags
              placeholder="请输入命令"
              style="width:200px"
            />

            <el-button type="primary" :disabled="loading" :loading="loading" @click="ansiblePushData"> 执行</el-button>
          </el-col>

        </el-row>
      </div>
    </div>
    <div class="el-alert__content"><span class="el-alert__title is-bold" />
      <p class="el-alert__description" /><!----><i class="el-alert__closebtn el-icon-close" /></div>
    <hr
      style="height: 1px; border-top: 1px dashed rgb(0, 102, 204); border-right: none; border-bottom: none; border-left: none; border-image: initial;"
    >

    <div v-if="ansibleResult.code">
      <el-collapse v-model="activeNames">
        <el-collapse-item v-if="ansibleResult.success.length>0" title="成功" name="1">
          <pre>
            <el-alert v-for="(item, index) in ansibleResult.success" :key="index" :title="JSON.stringify(item,null, 4)" type="success" />
           </pre>
        </el-collapse-item>

        <el-collapse-item v-if="ansibleResult.unreachable.length" title="失败" name="2">
          <pre>
            <el-alert v-for="item in ansibleResult.unreachable" :title="JSON.stringify(item)" type="error" />
          </pre>
        </el-collapse-item>
        
        <el-collapse-item v-if="ansibleResult.failed.length" title="未知" name="3">
          <pre>
              <el-alert v-for="item in ansibleResult.failed" :title="JSON.stringify(item)" type="warning" />
            </pre>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          value: i,
          desc: `备选项 ${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }
    return {
      options: [],
      options02: [],
      ansibleForm: {
        instance_ip: '',
        chooes: [],
        command: '',
        channelID: 'c5655f1c-1cea-11ec-b4f2-00163e158a73',
        args: ''
      },
      form: {
        name: ''
      },
      listQuery: {
        page: 1,
        limit: 20,
        page_size: 1000,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      data: generateData(),
      instance_ip: [],
      command: '',
      args: '',
      channelID: 'c5655f1c-1cea-11ec-b4f2-00163e158a73', 
      ansibleResult: {
        code: false,
        unreachable: [],
        success: [],
        failed: []
      },
      activeNames: ['1'],
      loading: false
    }
  },
  created() {
    this.getHostList()
    this.getmodList()
  },
  methods: {
    getHostList() {
      this.$http.get('/api/ansible/host/v1',{
                    params: this.listQuery
                }).then((response) => {
        this.options = response.data.data
        this.total = response.data.data.total
        this.listLoading = false
        console.log(response.data)
      }).catch((response) => {
        console.log(response)
      })
    },
    getmodList() {
      const that = this
       this.$http.get('/api/ansible/module/v1',{
                }).then((response) => {
        that.options02 = response.data.data
        console.log(response.data)
        that.listLoading = false
      }).catch((response) => {
        console.log(response)
      })
    },
    ansiblePushData: function() {
      var that = this
      that.loading = true
      that.ansibleForm.instance_ip = that.ansibleForm.chooes.join(',')
      postAnsibleApi(that.ansibleForm).then(function(response) {
        let code = response.code
        let data = response.data
            console.log('code',code)
            console.log('data',data)
        if (code == 0) {
          that.ansibleResult.code = true
          for (var x in data.success) {
            let success = data.success[x]
            that.ansibleResult.success.push(success)
            //console.log(that.ansibleResult.success.push(success))
          }
          for (var y in data.failed) {
            let failed = data.failed[y]
            that.ansibleResult.failed.push(failed)
          }
          for (var z in data.unreachable) {
            let unreachable = data.unreachable[z]
            that.ansibleResult.unreachable.push(unreachable)
          }
        }
        that.loading = false
      }).catch(function(error) {
        console.log(error)
      })
    }
  }
}
</script>
