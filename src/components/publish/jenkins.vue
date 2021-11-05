<template>
  <div>
    <!--<el-breadcrumb separator="/" style="margin-top:10px;margin-bottom: 20px;">-->
      <!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
      <!--<el-breadcrumb-item :to="{ path: '/publish/Appname' }">服务管理</el-breadcrumb-item>-->
      <div>发布流水线页面</div>
    <!--</el-breadcrumb>-->
    <el-button type="primary" class="btnName" @click="refreshBtn">刷新</el-button>
    <iframe  policy="SAMEORIGIN"
      ref="pipeline" 
      :src="targetUrl2"
      frameborder="0"
      style="margin-top:-70px;height:800px"
      :class="clsName || 'frame'"
    />
  </div>
</template>
<script>
window.onload = function(){
  console.log(1111)
 var test = document.getElementById('pipeline').contentWindow.document.getElementsByClassName('Header-topNav');
 console.log(test);
　test.style.display = 'none';
}
export default {
  name: 'BuildPipeline',
  pipelineReload: '',
  components: {},
  props: {
    jobName: String,
    buildId: Number,
    clsName: String
  },
  data() {
    return {
      num: '',
      instanceVisiable: false,
      appInfo: {},
      deployType: 0,
      url: ''
    }
  },
  computed: {
    targetUrl2() {
      console.log('这是返回地址')
      console.log(decodeURIComponent(localStorage.getItem('iframeUrl')))
      let url = this.$store.state.app.url.replaceAll('xiavan/','xiavan%2F')
      console.log(url)
          
      return url
    }
  },
  created() {
    this.url = this.$store.state.app.url;
    console.log(this.url,'dasd')
     console.log(localStorage.getItem('iframeUrl'),'22222222')
  },
  methods: {
    refreshBtn() {
      location.reload();
    }
  }
}
</script>
  <style scoped>
  .frame {
    width: calc(100vw - 225px);
    height: calc(75vh - 108px);
  }
  .btnName{
    position: fixed;
    right: 90px;
    top:150px;
  }
</style>
