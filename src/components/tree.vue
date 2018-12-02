<template>
  <div>
    <ul class="ztree">
      <vTree v-for="(node,index) in treeData"
             :key="index"
             :checkBoxType="checkBoxType"
             :allOpen="allOpen"
             :beforeClick="beforeClick"
             :checkBoxed="checkBoxed"
             :checkBox="checkBox"
             :clickChange="clickChange"
             :index="index"
             :tree="node"
             :first="first"
             :currentArray="treeData"
             :parentTree="node.parentTree"
             :rootData="treeData"
      />
    </ul>
  </div>
</template>

<script>
  import vTree from '../components/tree-core'
  import Vue from 'vue';

  export default {
    components: {vTree},
    name: "tree",
    props: {
      treeNode: {
        type: Array,
        default: function () {
          return [];
        },
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
    },
    data() {
      return {
        treeData: [],
        line: '',
        first: true,
        allOpens: this.allOpen
      }
    },
    methods: {
      init() {
        let tempList = JSON.parse(JSON.stringify(this.treeNode));

        let initTree = (tree, parent) => {
          tree.forEach((m, index) => {
            if (!m.hasOwnProperty("open")) {
              if (this.allOpens!=null) {
                m.open = this.allOpens
              } else
                m.open = m.hasOwnProperty("open") ? m.open : false;
            }
            if (!m.hasOwnProperty("checked")) {
              m.checked = m.hasOwnProperty("checked") ? m.checked : false;
            }
            if (!m.hasOwnProperty("checkBox")) {
              m.checkBox = m.hasOwnProperty("checkBox") ? m.checkBox : false;
            }
            if (!m.hasOwnProperty("clickChange")) {
              m.clickChange = m.hasOwnProperty("clickChange") ? m.clickChange : false;
            }
            if (!m.hasOwnProperty("checkBoxType")) {
              m.checkBoxType = m.hasOwnProperty("checkBoxType") ? m.checkBoxType : false;
            }
            if (!m.hasOwnProperty("last")) {
              m.last = m.hasOwnProperty("last") ? m.last : false;
            }
            if (!m.hasOwnProperty("first")) {
              m.first = m.hasOwnProperty("first") ? m.first : false;
            }
            if (!m.hasOwnProperty("vParentIndex")) {
              m.vParentIndex = m.hasOwnProperty("vParentIndex") ? m.vParentIndex : index;
            }
            if (!m.hasOwnProperty("active")) {
              m.active = m.hasOwnProperty("active") ? m.active : false;
            }
            if (!m.hasOwnProperty("parentTree")) {
              m.parentTree = parent ? parent : null;
            }

            m.children = m.children || [];

            initTree(m.children, m);
          });
        };
        initTree(tempList, null);
        this.treeData = tempList;
        this.line = 'line';
        if (this.first)
          this.$emit('call', this.treeData);
      },
    },
    created() {
      this.init();
    },
    update() {
      this.init();
    },
    mounted() {
      Vue.nextTick(() => {
        this.init();
      })
    },
    watch: {
      allOpen() {
        this.init()
      }
    }
  }
</script>

<style scoped>
  @import "../../static/css/v-tree.css";
</style>
