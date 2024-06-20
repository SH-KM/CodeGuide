<script setup lang="ts">
import { ref, watch } from "vue";
import { ElMessage, ElTree } from 'element-plus';
import { getRegionsService, appendNodeService, removeNodeService } from '@/api/tree';
import type Node from 'element-plus/es/components/tree/src/model/node';

// 树形数据和筛选文本
const treeData = ref([]);
const filterText = ref('')

// 树节点的默认属性配置
const defaultProps = {
  children: 'children',
  label: 'regionName',
  isLeaf: (node: any) => !node.hasChildren, // 是否为叶子节点
}

// 加载节点数据
const loadNode = (node: any, resolve: any) => {
  const fetchNodes = node.level === 0 ? getRegionsService(0) : getRegionsService(node.data.pkId);

  // 设定一个超时时间
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('请求超时')), 500);
  });

  Promise.race([fetchNodes, timeout])
    .then((result) => {
      resolve(result);
    })
    .catch((error) => {
      ElMessage.warning(error.message);
    });
};

// 过滤节点方法
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.regionName.indexOf(value) !== -1
}

// 将 ElTree 的实例赋值给 treeRef.value ,包含节点操作方法 filter
const treeRef = ref<InstanceType<typeof ElTree>>()
// console.log('treeRef :>> ', treeRef);

// 监听筛选文本的变化，进行节点过滤
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

// 获取节点样式
const getLabelStyle = (node: any) => {
  const paddingLeft = node.level * 19;
  const totalWidth = 30;  // 初始的宽度百分比（30%）
  const adjustedWidth = totalWidth - (paddingLeft / window.innerWidth * 100);  // 转换为百分比
  console.log('adjustedWidth :>> ', adjustedWidth);
  return {
    width: `${adjustedWidth}%`
  };
};

// 添加节点
const appendNode = async (node: Node, data: any) => {
  // console.log('node :>> ', node);
  // 找到当前节点的子节点中最大的 pkId
  const maxPkId = node.childNodes.reduce((maxId: number, node: Node) => {
    return Math.max(maxId, node.data.pkId);
  }, 0);
  console.log('maxPkId :>> ', maxPkId);

  // 新的节点的 pkId 是最大 pkId 加 1
  const newNode = {
    pkId: maxPkId + 1,
    regionName: 'New Node',
    hasChildren: 0,
    parentId: node.data.pkId,
    treeLevel: node.level + 1,
    regionCode: maxPkId + 1
  };

  try {
    await appendNodeService(node.data.pkId, newNode);
    treeRef.value?.append(newNode, node); // 使用 ?. 来确保 treeRef.value 存在
    ElMessage.success('节点添加成功');
  } catch (error) {
    ElMessage.error('节点添加失败');
  }
};


// 删除节点
const removeNode = async (node: Node, data: any) => {
  // console.log('node :>> ', node);
  try {
    await removeNodeService(node.data.pkId);
    treeRef.value?.remove(node);
    ElMessage.success('节点删除成功');
  } catch (error) {
    ElMessage.error('节点删除失败');
  }
};
</script>


<template>
  <el-main class="main-container">

    <el-input v-model="filterText" style="width: 240px" placeholder="请输入筛选关键词" />

    <el-tree ref="treeRef" class="filter-tree" :data="treeData" :props="defaultProps" node-key="pkId" :load="loadNode"
      lazy :filter-node-method="filterNode">
      <template #default="{ node, data }">
        <table width="100%" border="1" cellspacing="0" cellpadding="0" align="center">
          <tr>
            <td :class="`level-${node.level}`">{{ node.label }}</td>
            <td width="25%">{{ data.regionCode }}</td>
            <td width="10%">{{ node.level }}</td>
            <td width="25%">{{ data.regionShortName }}</td>
            <td width="10%">
              <a @click="appendNode(node, data)"> Append </a>
              <a style="margin-left: 8px" @click="removeNode(node, data)"> Delete </a>
            </td>
          </tr>
        </table>
      </template>
    </el-tree>
  </el-main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.main-container {
  height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;
}

.filter-tree {
  width: 100%;
  height: 95%;
  overflow: scroll;
  margin-top: 5px;
  padding: 10px;
  border-radius: 10px;
}

.level-0 {
  padding-left: 0px;
}

.level-1 {
  padding-left: -18px;
}

.level-2 {
  padding-left: -36px;
}

.level-3 {
  padding-left: -54px;
}
</style>
