<template>
  <div style="height: auto">
    <span>
      z-tree demo
    </span>
    <div style="height: auto">
      <span>1、开启/关闭所有节点</span>
      <button @click="allOpen=!allOpen">
      <span :style="{color:allOpen?'#66CD00':'red'}">
      {{isOpen()}}
      </span>
      </button>
      <br/>
      <span>2、开启/关闭第一个节点</span>
      <button @click="openFirst">
      <span :style="{color:firstIsOpen?'#66CD00':'red'}">
      {{firstIsOpen?'Already opened':'Already close'}}
        </span>
        The first node
      </button>
      <br/>
      <span>3、禁止/允许选择第一个节点</span>
      <button @click="clickFirstNode=!clickFirstNode">
       <span :style="{color:clickFirstNode?'red':'#66CD00'}">
      {{clickFirstNode?'Banned':'allow'}}
       </span>
        Select the first node({{clickFirstNode}})
      </button>
      <br/>
      <span>3、已开启/已关闭点击节点打开/关闭事件</span>
      <button @click="nodeTrigger=!nodeTrigger">
      <span :style="{color:nodeTrigger?'#66CD00':'red'}">
      {{nodeTrigger?'Already opened':'Already close'}}
      </span>
        Subnode Open Event
      </button>
      <br/>
      <button @click="checkBox=!checkBox">
      <span :style="{color:checkBox?'#66CD00':'red'}">
      {{checkBox?'Already opened':'Already close'}}
      </span>
        checkbox
      </button>
      <br/>
      <button @click="checkBoxType=!checkBoxType">
      <span :style="{color:checkBoxType?'#66CD00':'red'}">
      {{checkBoxType?'Already opened':'Already close'}}
      </span>
        Check box cascade selection 复选框级联选中
      </button>

      <br/>

    </div>
    <div class="main">
      <ul>
        <li>
          <span>One time loading 一次性加载</span>
          <Tree
            :treeNode="treeNode"
            :allOpen="allOpen"
            :nodeTrigger="nodeTrigger"
            :checkBox="checkBox"
            :beforeClick="beforeClick"
            :checkBoxType="checkBoxType"
            :clickNode="clickNode"
            :hiddenLine="hiddenLine"
            @checkBoxCall="checkBoxCall"
            @call='call'
          />
        </li>
        <li>
          <span>async loading 异步加载</span>

          <Tree
            :treeNode="treeNode"
            :nodeTrigger="nodeTrigger"
            :checkBox="checkBox"
            :beforeClick="beforeClick"
            :checkBoxType="checkBoxType"
            :clickNode="clickNode"
            :hiddenLine="hiddenLine"
            @checkBoxCall="asyncCheckBoxCall"
            @call='callAsync'
            :async="async"
            :asyncCall="asyncCall"
          />
        </li>
        <li style="width: 40%;">
          <div style="border: 1px solid red">
           <pre>
            {{shuoming()}}
          </pre>
          </div>
        </li>
      </ul>
    </div>

  </div>
  <!--
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
        nodeTrigger: false,
        /*是否开启复选框*/
        checkBox: true,
        clickFirstNode: false,
        checkFirstCheckBox: false,
        /*是否级联选中*/
        checkBoxType: true,
        tree: [],
        trees: [],
        firstIsOpen: false,
        hiddenLine: false,
        async: true,
      }
    },
    methods: {
      isOpen() {
        if (this.allOpen == null) {
          return 'system default 系统默认';
        } else {
          return this.allOpen ? 'open all' : 'close all';
        }
      },
      /*复选框选中/取消 回调*/
      checkBoxCall(checkBox) {
        console.log('checkBox', checkBox);
      },
      asyncCheckBoxCall(checkBox) {
        console.log('asyncCheckBox', checkBox);
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
        this.trees[0].open = !this.trees[0].open;
        this.firstIsOpen = this.trees[0].open;
      },
      /*回调初始化后的数据 以后修改tree实现对节点的操作即可*/
      call(data) {
        //console.log('data', data);
        this.trees = data;
      },
      callAsync(data) {
        //this.trees = data;
      },
      /*点击节点信息 上个点击节点信息*/
      clickNode(data, oldData) {
        /*if(data.children){
          data.children.push({
            id: (new Date()).getTime(),
            name:'新增节点',
            children:[]
          });
        }else{
        }*/
        console.log(data, oldData);
        //data.open=true;
      },
      /*异步回调函数 data 当前节点数据 call 回调函数*/
      asyncCall(data, call) {
        setTimeout(function () {
          let hm = '' + (new Date()).getTime();
          let addNode = [
            {id: hm, name: "children node" + hm.substr(hm.length - 4, hm.length)},
          ];
          call(addNode);
        }, 800);
      }
    },
    mounted() {
      // this.allOpen = true;

    },
    computed: {
      shuoming() {
        return function () {
          return `

          <Tree
              <!--Render data format 渲染数据-->
              :treeNode='treeNode'

              <!--click node callback function 点击节点 回调函数 -->
              :clickNode='clickNode'

              <!--
              Trigger the callback function before clicking on the node
              ,return false Unable to trigger clickNode

              点击节点前触发回调函数，return false 无法触发clickNode事件-->
              :beforeClick='beforeClick'

              <!--Open/close all nodes 打开/关闭所有节点-->
              :allOpen='allOpen'

              <!--Click on a node to trigger a node event 点击节点是否触发节点事件-->
              :nodeTrigger='nodeTrigger'

              <!--Open/close the check box 开启/关闭复选框-->
              :checkBox='checkBox'

              <!--Open/close Cascade Selection 开启/关闭级联选中 -->
              :checkBoxType='checkBoxType'

              <!--Initialization callback data 初始化回调数据-->
              @call='call'

            <!--Check/uncheck check box callback function 选中/取消选中复选框回调函数-->
              @checkBoxCall='checkBoxCall'

              <!--是否隐藏连接线 default false-->
              :hiddenLine:false,

              <!--Open/close async loading,default false 是否开启异步 默认关闭-->
              :async='async'

              <!--async loading callback function  异步回调函数function(data,call)
              data:current node call 回调执行，接收一个数组参数-->
              :asyncCall='asyncCall'
          />
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
                      id: "2-1--1", name: "叶子节点2321111",
                      children: [
                        {
                          id: "2-1---1", name: "叶子节点231111",
                          children: [
                            {checked: true, id: "2-1---1", name: "叶子节点23111"}]
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
      ]; `;
        }
      }
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
                      id: "2-1--1", name: "叶子节点2321111",
                      children: [
                        {
                          id: "2-1---1", name: "叶子节点231111",
                          children: [
                            {checked: true, id: "2-1---1", name: "叶子节点23111"}]
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
  .main ul li {
    list-style: none;
    float: left;
    width: 25%;

  }
</style>
