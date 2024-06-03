<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { ElMessage, ElTree } from 'element-plus';
  
import rawData from '@/utils/3级行政区划.json';  

interface Tree {
  label: string
  children?: Tree[]
}
// 创建一个映射，用于快速查找具有给定 pkId 的节点  
const map = new Map(rawData.map(item => [item.pkId, { ...item, children: [] }]));

// 递归函数，用于构建树形结构  
function buildTree(parentId = 0):Tree[] {  
  return rawData  
    .filter(item => item.parentId === parentId)  
    .map(item => ({  
      ...item, // 使用原始数据的所有字段（除了 children）  
      label: item.regionName, // 用 regionName 作为节点的标签  
      children: buildTree(item.pkId), // 递归地为每个节点构建子节点  
    }));  
}  
  
// 调用函数来构建树形结构  
const treeData = buildTree();  
console.log('tree',treeData);

const filterText = ref('')
// 将 ElTree 的实例赋值给 treeRef.value
const treeRef = ref<InstanceType<typeof ElTree>>()

const defaultProps = {
  children: 'children',
  label: 'regionName',
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.label.includes(value)
}


</script>

<template>
  <el-main>
    <el-input v-model="filterText" style="width: 240px" placeholder="请输入筛选关键词" />

    <el-tree ref="treeRef" style="max-width: 600px" class="filter-tree" :data="treeData" :props="defaultProps"
      :filter-node-method="filterNode" />
  </el-main>

</template>

<style scoped></style>
