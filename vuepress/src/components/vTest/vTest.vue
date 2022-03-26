<!--
 * @Descripttion: 
 * @Author: ycc
 * @Date: 2022-03-03 14:38:13
 * @LastEditTime: 2022-03-03 14:55:39
-->
<script>
export default {
  // name: 'vTest',
  data() {
    return {
      form: {
        type: [],
      },
    };
  },
  render(h) {
    const children = [
      h('el-checkbox', {
        props: {
          label: '美食/餐厅线上活动',
          // name: 'type',
        },
      },
      ['美食/餐厅线上活动']),
    ];
    return h(
      'el-checkbox-group',
      {
        props: {
          value: this.form.type,
        },
        on: {
          input(value) {
            console.log(value,'value');
            console.log(11111);
          },
        },
      },
      children
    );
  },
};
</script>
