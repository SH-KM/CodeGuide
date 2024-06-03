import Mock from "mockjs";

import rawData from '@/stores/3级行政区划.json'

/**
 * 辅助函数：根据 parentId 查找子节点 
 * @param parentId 父节点的 id
 * @param data 
 * @returns 
 */
function findChildren(parentId: number, data: any[]) {  
    return data.filter(item => item.parentId === parentId);  
}

Mock.mock(/\/api\/getRegionList\/\d+/, 'get',(options)=>{
    const match = options.url.match(/\/api\/getRegionList\/(\d+)/);
    const parentId = match ? parseInt(match[1]) : 0;// 默认 parentId 为 0  
    console.info('Meth:get',match ? match[0] : 'null');
    let resultData = findChildren(parentId, rawData);
    return {
        code: 1,
        msg: 'success',
        data: resultData
    }
})