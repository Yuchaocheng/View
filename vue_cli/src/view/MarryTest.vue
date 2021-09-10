<script>
export default {
    name: "marryTest",
    props: ["a", "b"],
    render(h) {
        return h("el-timeline", [
            <el-button type="{this.type}" onclick="{()=>{this.event()}}">
                主要按钮
            </el-button>,
        ]);
    },
    data() {
        return {
            type: "danger",
            timeItemList: [
                {
                    time: "10/02",
                    title: "机场接人",
                    content: "新郎和新郎小伯伯开两个车去萧山机场迎接新娘家人",
                },
            ],
        };
    },
    created() {
        console.log("&&&&&&&&", this.a);
        console.log(this.b);
        console.log(this.$route.query, 111);
        console.log(this.$route, 222);
    },
    methods: {
        test() {
            console.log(111111);
        },
        createTimeItem() {
            return this.timeItemList.map((item) => {
                const x = "danger";
                return (
                    <el-button type="danger">主要按钮</el-button>
                    // <el-timeline-item timestamp="{this.type}" placement="top">
                    //     <el-card>
                    //         <h4>{item.title}</h4>
                    //         <p>{item.content}</p>
                    //     </el-card>
                    // </el-timeline-item>
                );
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
