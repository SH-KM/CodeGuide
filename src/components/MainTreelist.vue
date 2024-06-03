<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { ElMessage, ElTree } from 'element-plus';
import { getRegionListService, getRegionListApi } from '@/api/tree';
import "@/utils/mockTree";

const treeData = ref([]); // 初始树形数据，只包含顶级节点 

const defaultProps = {
  children: 'children',
  label: 'regionName',
  isLeaf: (node: any) => !node.hasChildren, // 是否为叶子节点
}
const loadNode = (node: any, resolve: any) => {
  console.log('node.level', node.level);

  if (node.level === 0) {
    const result = getRegionListApi(node.level);
    return result.then(resolve)
  }
  // if (node.level >= 1 && node.level <= 2) {
  //   const result = getRegionListService(node.data.pkId);
  //   return result.then(resolve)
  // }
  if (node.level >= 1) {
    const result = getRegionListApi(node.data.pkId);
    return result.then(resolve)
  }
  setTimeout(() => {
    ElMessage.warning('请求超时')
  }, 1000)
}

const filterText = ref('')
// 将 ElTree 的实例赋值给 treeRef.value
const treeRef = ref<InstanceType<typeof ElTree>>()

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.regionName.indexOf(value) !== -1
}
</script>


<template>
  <el-main>
    <el-input v-model="filterText" style="width: 240px" placeholder="请输入筛选关键词" />

    <el-tree ref="treeRef" style="max-width: 600px" class="filter-tree" :data="treeData" :props="defaultProps"
      node-key="pkId" :load="loadNode" lazy :filter-node-method="filterNode" />
  </el-main>

</template>

<style scoped></style>
