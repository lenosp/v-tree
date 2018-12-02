<template>
  <div>
    <span>
      z-tree demo
    </span>
    <Tree
      :treeNode="treeNode"
      :allOpen="allOpen"
      :clickChange="clickChange"
      :checkBox="checkBox"
      :checkBoxed="checkBoxed"
      :beforeClick="beforeClick"
      :checkBoxType="checkBoxType"
      @call="call"
      />

    ----------------------------------
    <br/>
   <!-- <button @click="allOpen=!allOpen">
      <span :style="{color:allOpen?'#66CD00':'red'}">
      {{isOpen()}}
      </span>
    </button>-->
    <button @click="openFirst">
      <span :style="{color:firstIsOpen?'#66CD00':'red'}">
      {{firstIsOpen?'已打开':'已关闭'}}
        </span>
      第一级别
    </button>
    <button @click="clickChange=!clickChange">
      <span :style="{color:clickChange?'#66CD00':'red'}">
      {{clickChange?'已开启':'已关闭'}}
      </span>
      子节点打开事件
    </button>
    <button @click="checkBox=!checkBox">
      <span :style="{color:checkBox?'#66CD00':'red'}">
      {{checkBox?'已开启':'已关闭'}}
      </span>
      复选框
    </button>
    <!--<button @click="checkBoxed=!checkBoxed">
       <span :style="{color:checkBoxed?'#66CD00':'red'}">
      {{checkBoxed?'已选中':'已清空'}}
       </span>
      复选框
    </button>
    <button @click="clickFirstNode=!clickFirstNode">
       <span :style="{color:clickFirstNode?'#66CD00':'red'}">
      {{clickFirstNode?'已禁止':'已允许'}}
       </span>
      选择第一个节点
    </button>
    <button @click="checkFirstCheckBox=!checkFirstCheckBox">
       <span :style="{color:checkFirstCheckBox?'#66CD00':'red'}">
      {{checkFirstCheckBox?'已禁止':'已允许'}}
       </span>
      选择第一个复选框
    </button>-->
  </div>
</template>

<script>
  import Tree from "../components/tree";

  export default {
    components: {Tree},
    data() {
      return {
        treeNode: [],
        allOpen: null,
        allClose: null,
        clickChange: false,
        /*是否开启复选框*/
        checkBox: true,
        checkBoxed: false,
        clickFirstNode: false,
        checkFirstCheckBox: false,
        /*是否级联选中*/
        checkBoxType: true,
        tree: [],
        trees: [],
        firstIsOpen: false,
      }
    },
    methods: {
      show(value, oldValue) {
        console.log('show', value)
        // console.log('oldValue:',oldValue);
      },
      isOpen() {
        if (this.allOpen == null) {
          return '系统默认';
        } else {
          return this.allOpen ? '已开启所有' : '已关闭所有';
        }
      },
      beforeClick(node) {
        //可操作内部
        console.log('beforeClick', node);
        if (this.clickFirstNode)
          return node.id !== '1';
        return true;
      },
      beforeCheckBox(node) {
        console.log('checkFirstCheckBox', node);
        if (this.checkFirstCheckBox)
          return node.id !== '1';
        return true;
      },
      checkBoxHandle(value) {
        console.log('value', value);
      },
      openFirst() {
        this.trees[0].open=!this.trees[0].open;
        this.firstIsOpen = this.trees[0].open;
      },
      /*回调初始化后的数据 以后修改tree实现对节点的操作即可*/
      call(data) {
        console.log('data',data);
        this.trees = data;
      }
    },
    updated() {
      //console.log('updated', this.treeNode);
    },
    mounted() {
      this.allOpen=true
    },
    created() {
      this.treeNode = [
        {
          id: "1",
          name: "父节点22 - 折叠",
          // open: true,
          children: [
            {
              id: "1-1", name: "叶子节点221",
              children: [
                {
                  id: "1-1-1-1", name: "叶子节点221111",
                  children: [
                    {
                      id: "2-1--1", name: "叶子节点231111",
                      children: [
                        {
                          id: "2-1---1", name: "叶子节点231111",
                          children: [
                            {checked:true,id: "2-1---1", name: "叶子节点23111"}]
                        }]
                    }]
                },
                {id: "1-2-2", name: "叶子节点2222"},
                {id: "1-3-3", name: "叶子节点2233"},
                {id: "1-4-4", name: "叶子节点2244", checked: true,}
              ]
            },
            {id: "1-2", name: "叶子节点222"},
            {id: "1-3", name: "叶子节点223"},
            {id: "1-4", name: "叶子节点224"}
          ]
        }, {
          id: "2",
          name: "父节点23 - 折叠",
          children: [
            {id: "2-1", name: "叶子节点231"},
            {id: "2-2", name: "叶子节点232"},
            {id: "2-3", name: "叶子节点233"},
            {id: "2-4", name: "叶子节点234"}
          ]
        }, {
          open: true,
          id: "3",
          name: "父节点24 - 折叠",
          children: [
            {
              id: "2-1-1", name: "叶子节点232", open: true,
              children: [
                {id: "2-1-3", name: "叶子节点2313"},
                {id: "2-2-3", name: "叶子节点2323"},
                {id: "2-3-3", name: "叶子节点2333"},
                {id: "2-4-3", name: "叶子节点2343"}
              ]
            },
          ]
        },
      ];
    }
  }
</script>

<style scoped>

</style>
