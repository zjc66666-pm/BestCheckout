# BestCheckout

BestCheckout 的独立产品原型，包含官网、认证与 Shopify 连接流程，以及商家独立后台。

## 产品边界

- 官网：产品介绍、登录、注册、找回密码、Shopify 连接
- Help Center：Shopify 连接指南
- 独立后台：Overview、Purchase flows、Checkout pages、Orders、Activity log、Settings
- Checkout 页面：Checkout、Upsell、Downsell、Thank you

不包含 BestShopio 商家后台的 Products、Collections、Customers、Google、Facebook、Reviews、Blog 等模块。

## 目录

| 路径 | 用途 |
|---|---|
| `index.html` | BestCheckout 官网和公共流程入口 |
| `app/` | BestCheckout 独立后台入口 |
| `help/` | Help Center |
| `src/views/admin/bestcheckout/` | 官网、认证和公共流程组件 |
| `bestcheckout/` | Purchase flows 与 Checkout pages |
| `orders/` | BestCheckout 订单和 Shopify 回写状态 |
| `activity/` | 操作与服务事件日志 |
| `settings/` | Shopify、支付、结账域名、邮件与员工设置 |
| `online-store/` | 仅保留 Checkout 与 post-purchase 页面编辑器 |
| `bundles/js/data.js` | Bundle 订单与选择器兼容数据 |
| `subscriptions/js/data.js` | Subscription 订单展示兼容数据 |

## 本地预览

```powershell
python -m http.server 4195 --bind 127.0.0.1
```

- 官网：`http://127.0.0.1:4195/#/landing`
- 后台：`http://127.0.0.1:4195/app/#/home`
- Help：`http://127.0.0.1:4195/help/#guide=connect-shopify`

## GitHub

- 仓库：`zjc66666-pm/BestCheckout`
- 分支：`main`
- GitHub Pages：`https://zjc66666-pm.github.io/BestCheckout/`

当前 D 盘目录是清理后的本地候选版本。验证通过并经确认后，再用它替换线上混合目录。
