# 素材记录

- `assets/images/workbuddy-logo.png`：WorkBuddy 官网 https://www.workbuddy.cn/ 使用的官方标识；原文件 https://assets.workbuddy.cn/web/workbuddy/7e170c91f6fb3aa5720dd4381254492d08bf980c/assets/workbuddy-logo-WhgOvEF7.png ，检索日期2026-10-18。页面只展示品牌元素，不表达腾讯赞助/官方合作关系。
- `buddy-peek.png`：内置 ImageGen 根据用户选定首张视觉稿生成。提示：白色陶瓷猫耳机器人、黑色面板、薄荷绿笑眼、两只爪子搭在同一水平边缘，透明背景，无文字与面板。
- `mint-background.png`：内置 ImageGen。提示：浅薄荷白建筑空间、弧形轮廓、边角绿叶、柔和晨光、中央留白；无文字、UI、机器人、商品。
- `icon-shop.png` / `icon-map.png`：内置 ImageGen。提示分别为薄荷绿篷白色小店、薄荷折叠地图与定位针，陶瓷3D、透明背景、无文字。
- `icon-seafood.png` / `icon-vegetables.png` / `icon-meat.png` / `icon-grain.png` / `icon-condiments.png`：内置 ImageGen。分别为蓝鱼、绿叶蔬菜、红色牛排、装米黄袋、棕色调料瓶；独立透明背景、圆润3D、无文字。
- `design-seafood.png` / `design-vegetables.png` / `design-meat.png`：内置 ImageGen，分别为水产、蔬果、肉摊竖版示意照片，暖灯与浅景深、无人物/招牌/文字。**仅开发设计预览使用，不是真实商户照片，不进入生产构建。**
- `assets/icons/*.svg`：Phosphor Icons 官方 duotone 图标 https://github.com/phosphor-icons/core ，许可证保存在同目录 `LICENSE`。用于箭头、搜索、通用分类等。

角色、背景、分类图标属于装饰素材；真实商户照片仍由后端公开快照提供并经过哈希校验。

## 固定品类轮播追加示意素材

以下素材由内置 ImageGen 生成，仅开发预览使用，生产包排除。完整提示词：

- `assets/images/design-seafood-2.png`: Use case: photorealistic-natural. Asset: fictional merchant photo for explicitly labeled website design preview only. A Chinese wet market seafood stall with trays of fresh prawns, crabs and shellfish in foreground, blue tiled counter, softly blurred market aisle behind. Distinct from a display of whole silver fish. Vertical portrait 2:3 image, natural warm market lighting, realistic clean food photography, camera at counter height, edge-to-edge scene. No people, no logos, no text, no prices, no UI, no collage.
- `assets/images/design-vegetables-2.png`: Use case: photorealistic-natural. Asset: fictional merchant photo for explicitly labeled website design preview only. A Chinese wet market vegetable stall with large piles of purple eggplants, orange carrots and white radishes, green tiled counter, softly blurred market aisle behind. Distinct from tomatoes and green leafy vegetable display. Vertical portrait 2:3 image, natural warm market lighting, realistic clean food photography, camera at counter height, edge-to-edge scene. No people, no logos, no text, no prices, no UI, no collage.
- `assets/images/design-meat-2.png`: Use case: photorealistic-natural. Asset: fictional merchant photo for explicitly labeled website design preview only. A clean Chinese wet market poultry and meat stall with neatly arranged fresh chicken portions and pale pork cuts on a chilled stainless counter, softly blurred market aisle behind. No gore, no blood, no hanging meat. Vertical portrait 2:3 image, natural warm market lighting, realistic clean food photography, camera at counter height, edge-to-edge scene. No people, no logos, no text, no prices, no UI, no collage.
