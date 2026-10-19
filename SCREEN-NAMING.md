# 市场大屏与档口小屏命名规则

## 领域边界

| 项目 | 市场大屏 | 档口小屏 |
| --- | --- | --- |
| 英文前缀 | MarketScreen / marketScreen / market-screen | StallScreen / stallScreen / stall-screen |
| 归属 | 整个市场，marketId | 单个档口及其设备，stallId / deviceId |
| 内容 | 商户目录、门店照片、介绍、地图、图鉴 | 商品价格、海报、证照、收款码、公告 |
| 发布 | 市场展示配置与公开快照 | 档口设备发布、manifest、应用回执 |
| 当前目录 | entrance-screen | device |
| 后端 | MarketScreenService | MarketService / WebWorkflow 内的档口设备流程 |

用户界面和文档统一称“市场大屏”“档口小屏”。新领域类型、服务、函数、状态变量使用对应前缀，避免独立使用 Screen、Display、Snapshot、Manifest、Publication 等无法判断所属领域的名称。通用图片、HTTP和日期工具不强制加领域前缀。

已迁移：EntranceService → MarketScreenService；Entrance.vue → MarketScreenAdmin.vue；Display、DisplayItem、Snapshot、Manifest、Device、Publication 等前端类型 → StallScreen 前缀；档口播放当前状态、演示清单、回执函数增加档口小屏语义；市场展示管理函数增加市场大屏语义。

## 兼容标识

现有 HTTP 路径 entrance-profile、entrance-draft、entrance-publications、public/markets/{id}/entrance 属于市场大屏；screen-config、publish-command、devices 和设备 manifest 属于档口小屏。

本次只改内部代码名称和说明，不变更已对接的 HTTP 路径、JSON 字段、数据库集合、媒体用途 ENTRANCE_PROFILE、浏览器存储键或目录路径。它们是兼容标识，不允许仅为改名导致已有资料、设备绑定或离线缓存失效。后续如需迁移，必须提供版本及迁移方案。

市场大屏不能复用档口小屏设备的 APPLIED 回执。公开目录读取成功也不代表某台市场大屏已实际显示。两个领域的 revision 和 publicationId 不可相互比较或替代。

## Git 协作

MarketInformationalization 通过功能分支和 PR 合并，不直推 main；sk-market 允许直接推 main。
