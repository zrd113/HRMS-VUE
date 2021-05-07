## 项目介绍
HRMS-VUE是一个人力资源管理系统前端部分，采用Vue开发

## 项目技术栈
1. Vue
2. ElementUI
3. Vuex
4. Vue-router
5. axios

### 响应封装
失败分为两种，一种是业务上的失败，一种是服务端返回的异常信息，所以这里http响应码为200也不一定返回正确结果。
```
axios.interceptors.response.use(success => {
                          //http的响应码            服务端返回的响应码
    if (success.status && success.status == 200 && success.data.status == 500) {
        Message.error({message: success.data.msg});
        return;
    }
    if (success.data.msg) {
        Message.success({message: success.data.msg});
    }
    return success.data;
}, error => {
    if (error.response.status == 504 || error.response.status == 404) {
        Message.error({message: "服务器被吃了"});
    } else if (error.response.status == 403) {
        Message.error({message: '权限不足，请联系管理员'});
    } else if (error.response.status == 401) {
        Message.error({message: '尚未登陆，请登录'});
        router.replace("/");
    } else {
        if (error.response.data.msg) {
            Message.error({message: error.response.data.msg});
        } else {
            Message.error({message: '未知错误'})
        }
    }
    return;
})
```
