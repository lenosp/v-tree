<template>
  <li>
      <span v-if="vif()" title=""
            @click="vShow(tree)"
            class="button  switch"
            :class="vTreeFirstSpan()"></span>
    <span v-else title="" class="button switch "
          :class="classes()"></span>

    <span v-if="checkBox" @click="selectCheckBox(tree)" class="button chk"
          :class="tree.checked?'checkbox_true_full':'checkbox_false_full'"></span>

    <a target="_blank"
       style=""
       @click="selectNode"
       :class="aClass()"
       :title="tree.name">
      <span :title="tree.name" class="button" :class="iconCss()" :style="load()"></span>
      <span class="node_name">{{tree.name}}</span>
    </a>
    <ul :class="line">
      <treeCore
        v-for="(tr,i) in tree.children"
        v-show="tree.open"
        :key="i"
        :checkBoxType="checkBoxType"
        :allOpen="tr.allOpen"
        :first="false"
        :checkBox="checkBox"
        :nodeTrigger="nodeTrigger"
        :index="i"
        :tree="tr"
        :currentArray="tree.children"
        :parentTree="tr.parentTree"
        :rootData="rootData"
        :clickNode="clickNode"
        @checkedBoxV="checkedBoxV"
        :beforeClick="beforeClick"
        :checkBoxCallInit="checkBoxCallInit"
        :checkBoxCall="checkBoxCall"
        :last="tree.children.length-1===i"
        :hiddenLine="tr.hiddenLine"
        :async="async"
        :asyncCall="asyncCall"

      />
    </ul>
  </li>

</template>

<script>

  export default {
    name: "treeCore",
    props: {
      tree: {
        type: Object,
        required: true,
      },
      allOpen: {
        type: Boolean,
        default: null,
        required: false,
      },
      nodeTrigger: {
        type: Boolean,
        default: false,
        required: false,
      },
      checkBox: {
        type: Boolean,
        default: false,
        required: false,
      },
      checkBoxType: {
        type: Boolean,
        default: true,
        required: false,
      },
      beforeClick: {
        type: Function,
        default: null
      },
      last: {
        type: Boolean,
        default: null,
        required: false,
      },
      first: {
        type: Boolean,
        default: true,
        required: false,
      },
      currentArray: {
        type: Array,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
      rootData: {
        type: Array,
        required: true,
      },
      parentTree: {
        type: Object,
        required: false,
      },
      checkBoxCallInit: {
        type: Function,
      },
      checkBoxCall: {
        type: Function,
      },
      clickNode: {
        type: Function,
      },
      asyncCall: {
        type: Function,
      },
      hiddenLine: {
        type: Boolean,
        default: false,
        required: false,
      },
      async: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    data() {
      return {
        line: '',
        currentTree: this.tree,
        asyncLoading: false,
      }
    },
    methods: {
      coreInit() {
        this.line = this.hiddenLine ? '' : this.currentArray.length - 1 === this.index ? '' : 'line';
        if (this.tree.parentTree && this.tree.checked) {
          /*方案一 Scheme 1*/
          let checkedBoxArr = [];
          checkedBoxArr.push(this.tree);
          let selectParent = (data) => {
            if (!data.checked) {
              data.checked = this.tree.checked;
              checkedBoxArr.push(data);
            }
            if (data.parentTree) {
              selectParent(data.parentTree);
            } else {
              this.checkBoxCallInit(checkedBoxArr);
            }
          };
          selectParent(this.currentTree);
          /*方案二 Scheme 2*/
          //this.$emit('checkedBoxV')
        }
      },
      checkedBoxV() {
        this.tree.checked = true;
        this.$emit('checkedBoxV')
      },
      pNode(tree) {
        return tree.open;
      },
      vShow(tree) {
        /*需要有异步加载  need add async loading*/
        /*默认异步加载给他按钮 当加载后才能判别时候有子节点 */
        if (this.async && !tree.open && tree.children.length === 0) {
          this.asyncCall.call(this, tree, this.asyncBack);
          this.asyncLoading = true;
        }
        tree.open = !tree.open;
      },
      asyncBack(requestDataArr) {
        if (typeof requestDataArr)
          this.addNode(requestDataArr);
        this.asyncLoading = false;
      },
      selectNode() {
        let isClick = this.beforeClick.call(this, this.tree);
        if (isClick) {
          //清除其它
          let pro = null;
          let clearStyle = (data) => {
            data.forEach(d => {
              if (d.active) pro = d;
              d.active = false;
              if (d.children) {
                clearStyle(d.children);
              }
            });
          };
          clearStyle(this.rootData);
          this.tree.active = true;
          if (this.nodeTrigger) {
            this.tree.open = !this.tree.open;
          }
          this.clickNode.call(this, this.tree, pro);
        }
      },
      addNode(arr) {
        try {
          arr.forEach(a => {
            this.tree.children.push({
              id: a.id ? a.id : null,
              name: a.name,
              open: a.open ? a.open : false,
              checked: a.checked ? a.checked : false,
              checkBox: a.checkBox ? a.checkBox : false,
              nodeTrigger: a.nodeTrigger ? a.nodeTrigger : this.nodeTrigger,
              checkBoxType: this.checkBoxType,
              last: false,
              first: false,
              active: false,
              async: this.async,
              hiddenLine: this.hiddenLine,
              parentTree: this.tree,
              children: [],
            });
          });
        } catch (e) {
          console.error('The asynchronous callback parameter must be an array,异步回调参数必须是数组');
        }
      },
      selectCheckBox(tree) {
        tree.checked = !tree.checked;
        let checkedBoxArr = [];
        checkedBoxArr.push(tree);
        if (this.checkBoxType) {
          /*级联*/
          let changeChecked = (data) => {
            data.forEach(d => {
              checkedBoxArr.push(d);
              d.checked = tree.checked;
              if (d.children) changeChecked(d.children);
            });
          };
          changeChecked(tree.children);

          let checkChildren = (data) => {
            for (let i = 0; i < data.length; i++) {
              if (data[i].checked)
                return true;
            }
          };
          let selectParent = (data) => {
            if (data.children.length > 1) {
              const childExistsThis = [];
              data.children.forEach((m, index) => {
                if (index !== this.index)
                  childExistsThis.push(m);
              });
              if (childExistsThis && data.checked && checkChildren(childExistsThis))
                return;
            }
            checkedBoxArr.push(data);
            data.checked = tree.checked;
            if (data.parentTree) selectParent(data.parentTree);
          };
          if (this.parentTree)
            selectParent(this.parentTree);
        }

        this.checkBoxCall(checkedBoxArr, tree.checked);
      }
    },
    created() {
      this.coreInit();
    },
    computed: {
      vif() {
        return function () {
          return this.async ? true : this.tree.children.length > 0;
        }
      },
      vTreeFirstSpan() {
        return function () {
          return this.hiddenLine ? this.tree.open ? 'noline_open treenode_switch' : 'noline_close treenode_switch' :
            this.currentArray.length - 1 === this.index ? this.tree.open ? 'bottom_open' : 'bottom_close'
              :
              this.tree.open ? 'roots_open' : 'roots_close';
        }
      },
      classes() {
        return function () {
          return this.hiddenLine ?
            'noline_docu'
            :
            this.first ?
              'roots_docu'
              :
              this.currentArray.length - 1 === this.index ?
                'bottom_docu'
                :
                'center_docu'
        }
      },
      iconCss() {
        return function () {
          return this.tree.children.length > 0 ? this.tree.open ? 'ico_open' : 'ico_close' : 'ico_docu';
        }
      },
      load() {
        return function () {
          return this.asyncLoading ?
            'background:url(../../static/img/loading.gif) 0 0 no-repeat' : ''
        }
      },
      aClass() {
        return function () {
          return this.tree.active ? 'curSelectedNode' : '';
        }
      }
    },
    watch: {
      tree: {
        handler(oldV, newV) {
          if (newV.checked)
            this.tree.checked = newV.checked;
        },
        deep: true
      },
    }
  }
</script>

<style scoped>
  @import "../../static/css/v-tree.css";
</style>
