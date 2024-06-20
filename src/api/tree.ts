// tree.ts
import {instance as request, retryRequest, cancelRequest} from '@/utils/request'

/**
 * 获取 区域列表 公司测试库
 * @param parentId 父节点id
 * @returns 
 */
export const getRegionListApi = (parentId:number):Promise<any> => {
    console.log('getRegionListApi',`/oam/api/v1/CTL/Region/GetRegionList/${parentId}`);
    return request.get(`/oam/api/v1/CTL/Region/GetRegionList/${parentId}`);
};

/**
 * 获取 区域列表 localhost:8080
 * @param parentId 父节点id
 * @returns 
 */
export const getRegionsService = (parentId:number):Promise<any> => {
    console.log('getRegionsService',`/Region/GetRegionList/${parentId}`);
    return request.get(`/Region/GetRegionList/${parentId}`);
};


/**
 * 删除 区域列表 localhost:8080
 * @param pkId 节点ID
 * @returns 
 */
export const removeNodeService = (pkId: number): Promise<any> => {
    console.log('removeNodeService', `/Region/RemoveRegion/${pkId}`);
    return request.delete(`/Region/RemoveRegion/${pkId}`);
};
/**
 * 添加 区域下级行政节点 localhost:8080
 * @param pkId 节点ID
 * @param newChild 新节点
 * @returns 
 */
export const appendNodeService = (pkId:number, newChild:any):Promise<any> => {
    console.log('appendNodeService ',`/Region/AppendRegion/${pkId}`);
    return request.post(`/Region/AppendRegion/${pkId}`, newChild);
};


