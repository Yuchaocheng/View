<script>
/* 将测试的模板用render函数实现一下，便于对比 */
export default {
  data() {
    return {
      x: 1,
      a: {
        b: 2
      },
      list: ['A', 'B', 'C']
    };
  },
  render(h) {
    return h('div', { attrs: { id: 'myVue' } }, [
      h('div', this.x),
      h(
        'button',
        {
          attrs: { id: 'addBtn' },
          on: {
            click: () => {
              this.x++;
            }
          }
        },
        'x++'
      ),
      h('input', {
        attrs: { type: 'text' },
        domProps: { value: this.x },
        on: {
          input: $event => {
            this.x = $event.target.value;
          }
        }
      }),
      h(
        'ul',
        this.list.map(item => h('li', { key: item }, item))
      )
    ]);
  },
  render1() {
    h('div', { attrs: [{ name: 'id', value: 'myVue' }] }, [
      h('div', {}, [x]),
      h('button', { attrs: [{ name: 'id', value: 'addBtn' }] }, ['x++']),
      h('input', { attrs: [{ name: 'type', value: 'text' }] }, []),
      h('ul', {}, [h('li', { attrs: [{ name: 'in list" :key', value: 'item' }] }, [item])])
    ]);
  },
  render2() {
    _c('div', { attrs: { id: 'myVue' } }, [
      _c('div', [_v('\n            ' + _s(x) + '\n        ')]),
      _v(' '),
      _c('button', { attrs: { onclick: 'add()' } }, [_v('x++')]),
      _v(' '),
      _c('input', {
        directives: [{ name: 'model', rawName: 'v-model', value: x, expression: 'x' }],
        attrs: { type: 'text' },
        domProps: { value: x },
        on: {
          input: function($event) {
            if ($event.target.composing) return;
            x = $event.target.value;
          }
        }
      }),
      _v(' '),
      _c(
        'ul',
        _l(list, function(item) {
          return _c('li', { key: item }, [_v(_s(item))]);
        }),
        0
      )
    ]);
  }
};
</script>

<style scoped></style>
