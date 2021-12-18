# skuo-antdv-template

## 关键文件说明

    /src/permission.js
    路由拦截 每次路由跳转前进行ACCESS_TOKEN和ST的判断 
    实现自动获取用户权限菜单和动态路由处理
    以实现自动化ST转ACCESS_TOKEN和自动跳转SSO

    /src/store/modules/user.js
    状态保存和接口调用
    统一管理登出和换取TOKEN等接口
    统一管理跳转SSO系统的操作

    /src/router/generator-routers.js
    路由表 动态路由处理

----
## 配置文件说明
| 字段                  | 说明             |
| --------------------- | ---------------- |
| VUE_APP_API_BASE_URL  | 接口地址         |
| VUE_APP_SSO_BASE_URL  | 单点登陆页面地址 |
| VUE_APP_SERVEICE_CODE | 应用code         |