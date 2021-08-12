<script>
export default {
  data: {
      form:{
          timePicker
      }
  },
  render(h) {
    h("el-form", {
      props: {
        model: self.form,
        labelWidth: "100px",
      },
    });
  },
};
</script>