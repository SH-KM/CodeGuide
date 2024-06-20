<script setup lang="ts">
import { getRegionListApi } from '@/api/tree';
import { ref, onUnmounted } from 'vue';
import { cancelRequest, retryRequest } from '@/utils/request';

interface Region {
    completeAddress: string; // 完整的地址  
    completePath: string;    // 路径标识，如 "|11|"  
    customCode: string;      // 自定义代码  
    hasChildren: boolean;    // 是否有子节点
    parentId: 0 | number; // 父ID，如果没有父节点则为0  
    pkId: number;            // 主键ID  
    regionCode: string;      // 区域代码  
    regionName: string;      // 区域名称  
    regionShortName: string; // 区域简称  
    searchCede: string;      // 搜索代码或关键字  
    sortNumber: number;      // 排序号  
    townClassifyCode: string; // 城镇分类代码  
    treeLevel: number;       // 树层级  
}

const regionList = ref([] as Region[]);
const cache = new Map<number, Region[]>();
const isDownloading = ref(false);
const MAX_CONCURRENT_REQUESTS = 10;
let activeRequests = 0;
const requestQueue: Array<() => Promise<void>> = [];

const processQueue = async () => {
    while (activeRequests < MAX_CONCURRENT_REQUESTS && requestQueue.length > 0) {
        activeRequests++;
        const nextRequest = requestQueue.shift();
        if (nextRequest) {
            await nextRequest().finally(() => {
                activeRequests--;
                processQueue(); // 当一个请求完成后，再次调用processQueue以处理下一个请求
            });
        }
    }
};

const enqueueRequest = (request: () => Promise<void>) => {
  requestQueue.push(request);
  processQueue();
};

const saveRegionList = async (key: number) => {
    if (cache.has(key)) {
        return cache.get(key);
    }
    if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
        // 如果活跃请求达到上限，延迟执行
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    activeRequests++;
    try {
        const result = await retryRequest({ url: `/oam/api/v1/CTL/Region/GetRegionList/${key}` });
        cache.set(key, result);
        regionList.value.push(...result);

        const promises = result
            .filter((element: Region) => element.treeLevel < 5 && !cache.has(element.pkId))
            .map((element: Region) => saveRegionList(element.pkId));

        await Promise.all(promises);
    } catch (error) {
        console.error('Error fetching region list:', error);
    } finally {
        activeRequests--;
    }
}

const download = async () => {
    await saveRegionList(0);
    const dataStr = JSON.stringify(regionList.value, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'region.json';
    link.click();
    URL.revokeObjectURL(url);
}
const cancelDownload = () => {
    cancelRequest();
    isDownloading.value = false;
};

onUnmounted(() => {
    cancelDownload(); // 组件卸载时取消所有请求
});
</script>

<template>
    <div>
        <button @click="download()">下载资源</button>
        <button @click="cancelDownload">取消下载</button>
    </div>
</template>

<style scoped></style>
