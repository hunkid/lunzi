实现阉割版的虚拟DOM
官方[virtual-dom](https://github.com/Matt-Esch/virtual-dom)主要实现：
1. vnode
2. vdom，根据vnode来创建vnode并返回
3. 使用h函数创建虚拟vnode,这样可以实现创建tag时，使用选择器等方式
4. diff算法

本项目实现简易版本的virtual dom：
- 简易版vnode
- 简易版createElement
- diff算法