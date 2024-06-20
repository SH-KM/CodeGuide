// request.ts
import axios, { type AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';

// 定义基础 URL
const baseURL = '/api';
const instance = axios.create({ baseURL });
// 创建一个全局的AbortController实例
const abortController = new AbortController();

const token = '0e48158589e74220bbeeab531e3968bf';
// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么  
    // console.log('config',config);
    // 将 token 其添加到请求头中
    config.headers['token'] = token;
    // 将 signal 添加到请求配置中
    config.signal = abortController.signal;

    return config;
  },
  error => {
    // 对请求错误做些什么  
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    //   console.log('respose',response);
    const { code, message, data } = response.data; // 使用解构赋值来简化代码  
    // console.info('code',code,'mes',msg,'data',data);

    // 判断业务状态码  
    if (code === 1 || code === 200) {
      // 操作成功，返回实际的数据  
      return data; // 注意这里返回的是data，而不是整个response.data  
    }

    // 操作失败，显示错误信息  
    ElMessage.error(message || '服务异常'); // 如果msg不存在，则显示默认信息  

    // 返回一个被拒绝的Promise，并带上服务器返回的错误信息对象（包含code, msg等）  
    return Promise.reject(response.data); // 也可以只返回code或自定义错误对象  
  },
  error => {
    // 这里处理请求错误，比如网络错误、超时等  
    // 可以根据需要自定义错误处理逻辑。例如，可以显示一个通用的错误信息，或者将错误记录到服务器日志等  
    // console.error('请求发生错误：', error);  
    // ElMessage.error('请求发生错误，请稍后再试');  
    if (!axios.isCancel(error)) {
      ElMessage.error('请求发生错误，请稍后再试');
    }
    // 也可以根据需要返回一个被拒绝的Promise  

    return Promise.reject(error);
  }
);
// 重试逻辑
const retryRequest = async (config: AxiosRequestConfig<any>, retries: number = 3):Promise<any> => {
  try {
    return await instance(config);
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待1秒
      return retryRequest(config, retries - 1); // 重试请求
    }
    throw error;
  }
};

// 取消请求的函数
const cancelRequest = () => {
  abortController.abort();
};

export { instance, retryRequest, cancelRequest };
export default instance;

