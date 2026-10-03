---
title: 导读：安全、隐私与治理
outline: [2, 3]
---

# 安全、隐私与治理

> 约束攻击面、数据与依赖风险。本域面向开发者、安全人员及项目负责人，每篇专题均可独立查阅；先从具体问题进入，再按需要补齐机制和工程边界。

## 范围与相邻领域

从资产与信任边界到输入输出、秘密、依赖和数据生命周期，覆盖应用研发治理。云账户组织治理由云安全主文承担；许可证与法律要求需要结合具体材料、使用方式和适用地区审查。

## 专题与查阅范围

| 专题 | 要解决的问题 |
| --- | --- |
| [威胁建模与安全开发验证](/software/security/threat-modeling) | 按资产、信任边界和攻击路径建模威胁，将安全要求放入研发验证。 |
| [输入、输出与业务安全](/software/security/application-security) | 区分输入校验、输出编码和业务授权，防范注入、跨站攻击及流程滥用。 |
| [密钥、最小权限与审计](/software/security/secrets-permissions) | 管理密钥发放、使用、轮换和撤销，以最小权限和审计限制执行边界。 |
| [依赖供应链与制品信任](/software/security/supply-chain) | 追踪依赖和制品来源，用锁定、扫描、签名与证明约束供应链风险。 |
| [隐私与数据生命周期](/software/security/privacy-lifecycle) | 按目的、最小化和保留规则管理数据全生命周期，识别副本与第三方流转。 |
| [许可证、知识产权与职业责任](/software/security/licenses-professional-practice) | 区分许可证、版权与使用方式，建立来源清单和工程职业责任边界。 |

## 怎样开始

前置知识：接口、身份、数据与交付。初次进入本域，可以按照上方自动导读的顺序建立概念；已经遇到具体问题时，直接查阅对应专题。阅读顺序是编辑建议，不是理解每篇文章的硬性依赖。

[配置、密钥、权限与数据](/software/guide/configuration-secrets-data) → [身份认证、会话与权限](/software/backend/authentication-authorization) → [沙箱、权限与执行防护](/software/ai-assisted/sandbox-permissions)提供导览或相邻专业入口。专题中的示例用于解释机制，是否适用于自己的项目，仍要检查环境、数据、风险和验证条件。

## 参考资料

<Refs>

- 本页组织领域范围与入口；技术机制、一手来源、适用版本及实际访问日期见各主文。
- 站内相关：[软件研发总览](/software/) · [场景索引](/software/reference/scenarios) · [术语索引](/software/reference/terms)

</Refs>
