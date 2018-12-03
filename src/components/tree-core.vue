<template>

  <li>
      <span v-if="vif()" title=""
            @click="vShow(tree)"
            class="button  switch"
            :class="vTreeFirstSpan()"></span>
    <span v-else title="" class="button level0 switch "
          :class="classes()"></span>

    <span v-if="checkBox" @click="selectCheckBox(tree)" class="button chk"
          :class="tree.checked?'checkbox_true_full':'checkbox_false_full'"></span>

    <a target="_blank"
       style=""
       @click="selectNode"
       :class="aClass()"
       :title="tree.name">
      <span title="" class="button" :class="iconCss()"></span>
      <span class="node_name">{{tree.name}}</span>
    </a>
    <ul :class="line">
      <treeCore
        v-for="(tr,i) in tree.children"
        v-show="tree.open"
        :key="i"
        :vParentIndex="i" :checkBoxType="tr.checkBoxType" :allOpen="tr.allOpen"
        :first="false"
        :checkBoxed="tr.checkBoxed"
        :checkBox="checkBox"
        :clickChange="clickChange"
        :index="i"
        :tree="tr"
        :currentArray="tree.children"
        :parentTree="tr.parentTree"
        :rootData="rootData"
        @checkedBoxV="checkedBoxV"
        :checkBoxCallInit="checkBoxCallInit"
        :checkBoxCall="checkBoxCall"
        :last="tree.children.length-1===i"/>
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
      clickChange: {
        type: Boolean,
        default: false,
        required: false,
      },
      checkBox: {
        type: Boolean,
        default: false,
        required: false,
      },
      checkBoxed: {
        type: Boolean,
        default: false,
        required: false,
      },
      checkBoxType: {
        type: Boolean,
        default: false,
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
      vParentIndex: {
        type: Number,
        default: -1,
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
      }

    },
    data() {
      return {
        line: '',
        currentTree: this.tree,
      }
    },
    methods: {
      coreInit() {
        this.line = this.currentArray.length - 1 === this.index ? '' : 'line';
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
      vShow(node) {
        node.open = !node.open;
      },
      selectNode() {
        //清除其它
        let clearStyle = (data) => {
          data.forEach(d => {
            d.active = false;
            if (d.children) {
              clearStyle(d.children);
            }
          });
        };
        clearStyle(this.rootData);
        this.tree.active = true;
        if (this.clickChange) {
          this.tree.open = !this.tree.open;
        }

      },
      selectCheckBox(tree) {
        tree.checked = !tree.checked;
        let checkedBoxArr = [];
        checkedBoxArr.push(tree);
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
        this.checkBoxCall(checkedBoxArr, tree.checked);
      }
    },
    created() {
      this.coreInit();
    },
    computed: {
      vif() {
        return function () {
          return this.tree.children.length > 0;
        }
      },
      vTreeFirstSpan() {
        return function () {
          return this.currentArray.length - 1 === this.index ? this.tree.open ? 'bottom_open' : 'bottom_close'
            : this.tree.open ? 'roots_open' : 'roots_close';
        }
      },
      classes() {
        return function () {
          return this.first ? 'roots_docu' : this.currentArray.length - 1 === this.index ? 'bottom_docu' : 'center_docu'
        }
      },
      iconCss() {
        return function () {
          return this.tree.children.length > 0 ? this.tree.open ? 'ico_open' : 'ico_close' : 'ico_docu';
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
