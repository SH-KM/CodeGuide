<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

// 菜单是否折叠
const isCollapse = ref()

// 使用路由模式
const router = useRouter();
const screenWidth = ref(window.innerWidth);

const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  isCollapse.value = screenWidth.value < 1200;
});

watch(screenWidth, (newValue, oldValue) => {
  if (newValue < 1200) {
    isCollapse.value = true;
  } else {
    isCollapse.value = false;
  }
});

</script>
<template>
  <el-aside class="aside">
    <el-row class="tac">
      <el-col>
        <el-menu default-active="/tree" class="el-menu-vertical-demo" router
          :collapse="isCollapse" >
          <el-menu-item index="/tree">
            <el-icon>
              <location />
            </el-icon>
            <span>el-tree</span>
          </el-menu-item>
          <el-menu-item index="/treetable">
            <el-icon>
              <location />
            </el-icon>
            <span>行政区划代码</span>
          </el-menu-item>
          <el-menu-item index="/user">
            <el-icon>
              <document />
            </el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/get">
            <el-icon>
              <document />
            </el-icon>
            <span>资源下载</span>
          </el-menu-item>
          
        </el-menu>

      </el-col>
    </el-row>
  </el-aside>

</template>
<style scoped>
.aside {
  /* flex: 0 0 auto; */
  /* 不放大、不缩小、基础大小为auto */
  width: 100%;
  /* 设置你希望的宽度 */
  height: 100%;
  /* 占据父元素的全高 */
  background-color: #fff;
  /* 其他样式 */
}

.el-menu {
  background-color: #fff;
  border: #fff;
}
</style>
