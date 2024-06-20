# MainTreeList 树形组件页面

## 概述

本指南详细介绍了一个使用 Vue.js 实现的应用程序，其中包含了 Element-Plus 库提供的动态树形组件。该树形组件支持节点筛选、延迟加载（懒加载）、通过组件实例 而不是 响应式数据 实现 添加新节点 以及 删除现有节点等功能。

### 项目结构

- **Vue 组件**: 主要集成了 Element-Plus 组件，并处理树形操作。
- **API service**: API 集成 (`getRegionsService`, `appendNodeService`, `removeNodeService`) 管理数据的获取和修改。
- **样式**: 使用了作用域 CSS，确保组件特定样式的应用。

### 主要功能

1. **树形数据与筛选**:
   - **treeData**: 响应式引用，只用于初始化树形结构的数据。
   - **filterText**: 筛选输入框，用于根据区域名称（RegionName）筛选节点。
2. **Element-Plus 集成**:
   - **ElTree**: 用于展示层级数据的组件。
   - **ElInput**: 用于动态筛选节点。
3. **节点配置**:
   - **defaultProps**: 定义节点的默认属性，如子节点、标签和叶子节点状态 (`isLeaf`)。
4. **节点操作**:
   - **加载节点**: 使用 Promise 实现延迟加载节点，并处理超时情况。
   - **筛选节点方法**: 自定义方法，根据输入的文本筛选节点。
   - **添加节点**: 在选定节点下添加新节点，并更新树结构，显示成功或失败的消息。
   - **删除节点**: 从树结构中移除节点，即时反映变化并显示相应的消息。
5. **节点样式**:
   - **getLabelStyle**: 根据节点在树中的深度计算并应用动态样式到节点标签上。

### 实现细节

- **树形渲染**: 使用 `ElTree` 组件实现，支持延迟加载 (`:load`)、节点筛选 (`:filter-node-method`)，根据 `treeData` 和 `defaultProps` 动态渲染树形结构。
- **节点交互**: 可点击的操作按钮 (`Append`, `Delete`) 分别触发相应的操作 (`appendNode`, `removeNode`)。
- **错误处理**: 使用 `ElMessage` 显示节点操作的成功或失败信息。

这些功能和实现细节帮助构建了一个灵活且功能强大的树形组件，适用于管理和展示复杂的层级数据结构。

```vue
<template>
  <el-tree ref="treeRef" class="filter-tree" :data="treeData" :props="defaultProps" node-key="pkId" :load="loadNode"
  lazy :filter-node-method="filterNode">
</template>
```
- lazy 属性被设置为 true，这表明 <el-tree> 组件启用了懒加载功能。懒加载是一种优化手段，它在处理大量数据时能显著提升性能，因为它只在需要时才会加载节点数据，而不是一次性加载所有数据。
- load 属性指定了加载节点数据的方法，即 loadNode 函数。这个函数定义了如何根据节点的状态（如层级）来加载数据。在这里，根据节点的层级来判断是否需要加载子节点的数据。

1. 将加载节点数据的逻辑完全委托给了 loadNode 方法，并没有将获取到的数据直接存储在 treeData 中。这种方式是符合 <el-tree> 组件懒加载的实现要求的。

具体来说：

- 在 loadNode 方法中，根据节点的层级（node.level）和其他条件，调用 getRegionsService 获取节点的子节点数据。

- 使用 resolve 函数来传递获取到的数据，这样 <el-tree> 组件能够接收到数据并进行展示。

- 并没有直接将获取到的数据存储在 treeData 中，而是通过 resolve(result) 将数据传递给 <el-tree> 组件处理。

  这种做法允许 根据需要 动态地获取和加载节点数据，而不必一次性将所有数据加载到 treeData 中。这种方式适用于需要在用户交互或条件满足时才加载节点数据的情况，以提升性能和减少不必要的数据加载和渲染。

总结起来，代码利用了 <el-tree> 组件提供的懒加载功能，通过 loadNode 方法来动态获取节点数据，并通过 resolve 方法传递给组件，而不是直接在 treeData 中预先存储所有节点数据。
 treeData 并没有直接存储实际的节点数据，而是作为 <el-tree> 组件的 data 属性传入，用于初始化树形结构的数据。在 <el-tree> 中使用懒加载时，直接操作 treeData 是不会影响到 <el-tree> 组件中的节点数据的。

在这种情况下，如何删除或修改节点呢？你需要利用 <el-tree> 组件提供的一些方法来操作节点，例如添加、删除节点等。具体步骤如下：

**添加节点**：使用 `appendNodeService` 接口添加节点后，通过 `treeRef.value?.append(newNode, node)` 将新节点添加到树中。

**删除节点**：使用 `removeNodeService` 接口删除节点后，通过 `treeRef.value?.remove(node)` 将节点从树中移除。
