// tree.ts
import request from '@/utils/request'

export const getRegionListService = (parentId:number):Promise<any> => {
    return request.get(`/getRegionList/${parentId}`);
};

export const getRegionListApi = (parentId:number):Promise<any> => {
    console.log('getRegionListApi','/oam/api/v1/CTL/Region/GetRegionList');
    
    return request.get(`/oam/api/v1/CTL/Region/GetRegionList/${parentId}`);
};