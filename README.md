# BestCheckout

本目录是 BestCheckout 独立官网与商家后台原型。BestCheckout 在品牌和商家体验上独立运行，底层复用 BestShopio 公共电商服务。本目录不是完整 BestShopio 商家后台，也不是 Shopify 内嵌 App。

BestCheckout 当前正式方案是**非嵌入式 Shopify Custom App（外部后台模式）**。应用仍在 Shopify 中安装和授权，并出现在 Apps 列表；商家点击带外链箭头的 BestCheckout 入口后，打开 Shopify Admin 之外的独立 BestCheckout 后台。

```text
Shopify Admin → Apps → BestCheckout ↗ → 独立 BestCheckout 后台
```

## 产品定位

BestCheckout 在品牌和商家体验上是独立产品：拥有自己的官网、登录入口、帮助中心和后台，目的是让 Shopify/DTC 商家能够直接完成 Checkout 增长任务，而不需要先理解完整 BestShopio。

底层并不是另一套平行建设的电商平台。账户、店铺身份、商品映射、客户、订单、支付连接和事件能力优先复用 BestShopio 公共服务，以便商家未来升级到完整 BestShopio 时连续使用已有数据和配置。

```text
BestCheckout 独立官网与后台
        ↓
Checkout / Funnel / Offer / Payment / Performance
        ↓
BestShopio 公共电商服务
```

## 产品边界

- 官网：产品介绍、登录、注册、找回密码、Shopify 连接
- Help Center：Shopify 连接指南
- 独立后台：Overview、Checkout flows、Checkout pages、Bundles、Subscriptions、Orders、Performance、Settings
- Checkout 页面：Checkout、Upsell、Downsell、Thank you

支付连接与支付路由是核心能力，当前主要位于 Settings 或具体 Checkout/Funnel 工作流，不默认作为独立一级菜单。

不包含 BestShopio 商家后台的 Products、Collections、Customers、Google、Facebook、Reviews、Blog 等模块。

这些完整店铺经营能力属于 BestShopio。BestCheckout 可以调用必要的底层数据，但不应把完整 BestShopio 导航和平台复杂度暴露给当前商家。

## 与其他产品目录的关系

- `BestCheckout Shopify App`：已停止采用的 Shopify Admin 内嵌式 Custom App 原型，仅作为未来其他嵌入式 Shopify App 的参考与交互标准，对应 GitHub `Checkout` 仓库。
- `BestCheckout`（本目录）：当前非嵌入式 Shopify Custom App 的独立官网与外部商家后台，对应 GitHub `BestCheckout` 仓库。
- `BestShopio Merchant` / `BestShopio Storefront`：商家升级完整 BestShopio 后承载全店经营和原生商城的产品表面。

BestCheckout 与 BestShopio 应共享兼容的 Funnel、页面、Offer 和支付模型。Shopify 侧保留 Custom App 的安装、授权、Scopes、API 与 Webhook 连接，具体数据协作由 Shopify Integration Adapter 处理；主产品后台不由 Shopify Admin Host 承载。

## 目录

| 路径 | 用途 |
|---|---|
| `index.html` | BestCheckout 官网和公共流程入口 |
| `app/` | BestCheckout 独立后台入口 |
| `help/` | Help Center |
| `src/views/admin/bestcheckout/` | 官网、认证和公共流程组件 |
| `bestcheckout/` | Purchase flows 与 Checkout pages |
| `orders/` | BestCheckout 订单和 Shopify 回写状态 |
| `settings/` | Shopify、支付、结账域名、邮件与员工设置 |
| `online-store/` | 仅保留 Checkout 与 post-purchase 页面编辑器 |
| `bundles/` | BestCheckout 裁剪版 Bundle：数量档创建/编辑，供结账计价 |
| `subscriptions/js/data.js` | Subscription 订单展示兼容数据；售卖计划列表与创建在一级菜单 Subscriptions |

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
