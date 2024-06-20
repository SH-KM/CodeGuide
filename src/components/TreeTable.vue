<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from 'element-plus';
import { getRegionsService } from '@/api/tree';

interface Region {
    pkId: number;
    regionName: string;
    parentId: number;
    children: Region[];
    customCode: string;
    treeLevel: number;
    regionShortName: string;
    hasChildren: boolean;
    regionCode: string;
}

// 定义初始表格数据
const tableData = ref([]);

// 加载数据源
const getData = async () => {
    let result = await getRegionsService(0);
    console.log('result', result);
    tableData.value = result;
}
// getData()
onMounted(() => {
  getData();
});

// 加载子节点  
const load = async (row: Region, treeNode: any, resolve: (data: Region[]) => void) => {
    // console.log('row', row);
    // console.log('treeNode :>> ', treeNode.level);
    // console.log('resolve :>> ', resolve);
    // console.log('!row.pkId :>> ', row.pkId);
    if (row.pkId > 0) {
        const result = await getRegionsService(row.pkId);
        return resolve(result);
    }

    setTimeout(() => {

        ElMessage.warning('请求超时')
    }, 1000)
}

const handleRowClick = (row:any) => {
  console.log('click :>> ');
};

</script>

<template>
    <el-main class="main-container">
        <el-table :data="tableData" class="table-container" style="" row-key="pkId" border lazy :load="load"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" highlight-current-row
            scrollbar-always-on @row-click="handleRowClick"   >
            <el-table-column min-width="300" prop="regionName" label="地区名称" />
            <el-table-column min-width="130" prop="regionCode" label="标准编码" align="center" />
            <el-table-column min-width="88" prop="regionShortName" label="地区简称" align="center" />
            <el-table-column min-width="60" prop="treeLevel" label="层级" align="center" />
            <el-table-column min-width="130" prop="regionCode" label="自定义编码" align="center" />
        </el-table>
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

.table-container {
    /* height: calc(100% - 60px); */
    height: 100%;
    width: 100%;
    /* min-width: 600px; */
    margin-bottom: 20px;
    box-sizing: border-box;
}
</style>
