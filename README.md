# 启动调试服务器
npm run dev
localhost:3000

# 使用模板创建 Next.js app
# cd 进入项目文件夹
npx create-next-app@latest nextjs-blog --use-npm --example "https://github.com/vercel/next-learn/tree/main/basics/learn-starter"
# 官方模板
https://github.com/vercel/next.js/tree/canary/examples

# 輔助工具
1. clsx可以用來折叠css类： https://github.com/lukeed/clsx
   npm install clsx
   使用方法（type是一个变量）：
   import { clsx } from 'clsx';

   .success {
      color: green;
   }
   .error {
      color: red;
   }

   <div
      className={clsx({
        [styles.success]: type === 'success',
        [styles.error]: type === 'error',
      })}
    >
      {children}
   </div>
2. gray-matter用来转换yaml格式file / markdown file 中的yaml字符串
   npm install gray-matter
3. 渲染markdown文件：
   npm install remark remark-html

   import { remark } from 'remark';
   import html from 'remark-html';
4. 格式化日期
   npm install date-fns
   https://date-fns.org/v2.16.1/docs/format

# 知识点
1. <React.StrictMode> 包裹根组件开启严格模式，严格模式下，react会调用两次组建函数
2. prop 和 children
   1. 这两个都是JSX传递参数的方法
   2. prop用来像html元素属性一样传递参数， 两个写法foo(prop), foo({a, b, c})
   3. 可以使用 <Avatar {...props} /> JSX 展开语法转发所有 props
   4. children是放JSX嵌套使用的时候，父组建使用prop.children接受内容
   ```
   function Card({ children }) {
      return (
         <div className="card">
            {children}
         </div>
      );
   }
   ```
3. 条件渲染
   在 React 中，你可以通过使用 JavaScript 的 if 语句、&& 和 ? : 运算符来选择性地渲染 JSX。
4. 箭头函数会隐式地返回位于 => 之后的表达式，所以你可以省略 return 语句
   const chemists = people.filter(person =>
      person.profession === '化学家'
   );
   const listItems = chemists.map(person =>
      <li>...</li> // 隐式地返回！
   );
   如果你的 => 后面跟了一对花括号 { ，那你必须使用 return 来指定返回值！
   const listItems = chemists.map(person => { // 花括号
      return <li>...</li>;
   });
5. Fragment 语法的简写形式 <> </>
   import { Fragment } from 'react';

   const listItems = people.map(person =>
      <Fragment key={person.id}>
         <h1>{person.name}</h1>
         <p>{person.bio}</p>
      </Fragment>
   );
6. <a href="…">： 会申请服务器请求 <Link href="…">： 仅执行客户端页面切换
   1. 如果想链接到外部地址，需要使用<a>
   2. next会预加载<Link >标签指向的页面（component），实现了预加载，可以提高网站速度
7. _app.js
   1. 是最顶层的react component
   2. 可以用来保存页面跳转时的状态
   3. 可以添加全局样式
   4. 每次修改后都需要重启服务： npm run dev
8. 样式
   1. 全局样式只能在pages/_app.js里引用，样式文件可以放在任意位置，名字也可以随便起
   2. module样式文件名字的后缀必须是：.module.css
   3. 应用样式文件：import '../styles/global.css';
9.  Pre-rendering （只在Next.js里存在， 原始的React.js没有）
   1. 默认情况下，Next.js会预渲染每个页面，这意味着Next.js会提前为每个页面生成html,而不是在客户端完成，这样性能更好，也有更好的SEO效果
   2. 每个预渲染的页面都包含最少的JS代码
   3. Pre-rendering的两种形式：
      1. Static Generation： build 时生成HTML, 生成的HTML会在每次请求的时候复用 (npm run dev的时候生成)，只有一次
      2. Server-side Rendering：每次请求的时候都生成HTML
      3. 当页面需要频繁的更新数据或者每次请求都不相同的时候才考虑Server-side Rendering
   4. Pre-rendering with data
      1. 使用getStaticProps （async方法）
      2. 当export page component的时候可以同时export一个异步的getStaticProps方法，如果这样做的话，getStaticProps方法就会在build app的时候执行
      3. 在getStaticProps方法内部可以获取外部数据，然后作为props传递给页面
      4. 举例：
      export default function Home(props) { ... }

      export async function getStaticProps() {
         // Get external data from the file system, API, DB, etc.
         const data = ...

         // The value of the `props` key will be
         //  passed to the `Home` component
         return {
            props: ...
         }
      }
      此时Home中就可以直接使用getStaticProps的return的props了。
   5. Server-side Rendering
      1. 使用getServerSideProps
      2. 举例：
         export async function getServerSideProps(context) {
            return {
               props: {
                  // props for your component
               },
            };
         }
      3. 客户端渲染：
         1. 先静态渲染不需要数据的部分
         2. 页面加载后，客户端调用JS获取额外的数据，然后填充页面额外的部分
      4. 使用SWR在客户端获取数据 https://swr.vercel.app/
         1. 举例：
         import useSWR from 'swr';

         function Profile() {
            const { data, error } = useSWR('/api/user', fetch);

            if (error) return <div>failed to load</div>;
            if (!data) return <div>loading...</div>;
            return <div>hello {data.name}!</div>;
         }
10. 方法中使用了await, name方法必须是async


# 添加交互
1. <button> 等内置组件只支持内置浏览器事件，如 onClick。  
   但是，你也可以创建你自己的组件，并给它们的事件处理程序 props 指定你喜欢的任何特定于应用的名称。
   ```
   export default function App() {
      return (
         <Toolbar
            onPlayMovie={() => alert('Playing!')}
            onUploadImage={() => alert('Uploading!')}
         />
      );
   }

   function Toolbar({ onPlayMovie, onUploadImage }) {
      return (
         <div>
            <Button onClick={onPlayMovie}>
            Play Movie
            </Button>
            <Button onClick={onUploadImage}>
            Upload Image
            </Button>
         </div>
      );
   }

   function Button({ onClick, children }) {
      return (
         <button onClick={onClick}>
            {children}
         </button>
      );
   }
   ```

# 渲染和提交

## 步骤 1: 触发一次渲染
有两种原因会导致组件的渲染:

1. 组件的 初次渲染。  
   当应用启动时，会触发初次渲染。
   ```
   import Image from './Image.js';
   import { createRoot } from 'react-dom/client';

   const root = createRoot(document.getElementById('root'))
   root.render(<Image />);
   ```

2. 状态更新时重新渲染。  
   一旦组件被初次渲染，你就可以通过使用 set 函数 更新其状态来触发之后的渲染。更新组件的状态会自动将一次渲染送入队列。
## 步骤 2: React 渲染你的组件
1. 在进行初次渲染时, React 会调用根组件。
2. 对于后续的渲染, React 会调用内部状态更新触发了渲染的函数组件。


## 步骤 3: React 把更改提交到 DOM 上
1. 对于初次渲染， React 会使用 appendChild() DOM API 将其创建的所有 DOM 节点放在屏幕上。
2. 对于重渲染， React 将应用最少的必要操作（在渲染时计算！），以使得 DOM 与最新的渲染输出相互匹配。
3. React 仅在渲染之间存在差异时才会更改 DOM 节点。


## 尾声：浏览器绘制
在渲染完成并且 React 更新 DOM 之后，浏览器就会重新绘制屏幕。


# state 如同一张快照
state 不同于在你的函数返回之后就会消失的普通变量。state 实际上“活”在 React 本身中  
设置 state 只会为下一次渲染变更 state 的值,所以如果在一次事件中设置多次state，也只能影响一次渲染  
一个 state 变量的值永远不会在一次渲染的内部发生变化，即使使用setTimeout延迟了渲染

## 把一系列 state 更新加入队列

setNumber(n => n + 1); 在这里，n => n + 1 被称为更新函数。当你将它传递给一个 state 设置函数时：
1. React 会将此函数加入队列，以便在事件处理函数中的所有其他代码运行后进行处理。
2. 在下一次渲染期间，React 会遍历队列并给你更新之后的最终 state。

## 将 state 视为只读的
虽然严格来说 React state 中存放的对象是可变的，但你应该像处理数字、布尔值、字符串一样将它们视为不可变的。  
因此你应该替换它们的值，而不是对它们进行修改  

## 使用 ... 对象展开 语法
```
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

## 更新一个嵌套对象
考虑下面这种结构的嵌套对象：
```
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```
可以使用以下方法修改artwork:
```
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```
也可以写成一个函数调用：
```
setPerson({
  ...person, // 复制其它字段的数据  
  artwork: { // 替换 artwork 字段  
    ...person.artwork, // 复制之前 person.artwork 中的数据
    city: 'New Delhi' // 但是将 city 的值替换为 New Delhi！
  }
});
```

## 使用 Immer 编写简洁的更新逻辑 
使用了Immer之后，上面的代码可以简写为：
```
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```
尝试使用 Immer:
1. 运行 npm install use-immer 添加 Immer 依赖
2. 用 import { useImmer } from 'use-immer' 替换掉 import { useState } from 'react'
3. 你可以随意在一个组件中同时使用 useState 和 useImmer。

下面我们把上面的例子用 Immer 实现一下：
```
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

示例二：
```
const initialPosition = {
  x: 0,
  y: 0
};
const [shape, updateShape] = useImmer({
   color: 'orange',
   position: initialPosition
});

function handleMove(dx, dy) {
   updateShape(draft => {
   draft.position.x += dx;
   draft.position.y += dy;
   });
}

function handleColorChange(e) {
   updateShape(draft => {
   draft.color = e.target.value;
   });
}
```

## 更新 state 中的数组
当你想要更新存储于 state 中的数组时，你需要创建一个新的数组（或者创建一份已有数组的拷贝值），并使用新数组设置 state。

### 向数组中添加元素：
```
let nextId = 0;
const [name, setName] = useState('');
const [artists, setArtists] = useState([]);

<button onClick={() => {
   setArtists(
      [
      ...artists,
      { id: nextId++, name: name }
      ]
   )
   artists.push({
      id: nextId++,
      name: name,
   });
}}>添加</button>
```
### 删除元素
```
let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];
const [artists, setArtists] = useState(
   initialArtists
);

<button onClick={() => {
   setArtists(
      artists.filter(a =>
      a.id !== artist.id
      )
   );
}}>
   删除
</button>
```
这里，artists.filter(s => s.id !== artist.id) 表示“创建一个新的数组，该数组由那些 ID 与 artists.id 不同的 artists 组成”。  
注意，filter 并不会改变原始数组。

### 转换数组
```
let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

const [shapes, setShapes] = useState(
   initialShapes
);

function handleClick() {
   const nextShapes = shapes.map(shape => {
   if (shape.type === 'square') {
      // 不作改变
      return shape;
   } else {
      // 返回一个新的圆形，位置在下方 50px 处
      return {
         ...shape,
         y: shape.y + 50,
      };
   }
   });
   // 使用新的数组进行重渲染
   setShapes(nextShapes);
}
```
### 使用 map 替换数组中的元素
```
let initialCounters = [
  0, 0, 0
];

const [counters, setCounters] = useState(
   initialCounters
);

function handleIncrementClick(index) {
   const nextCounters = counters.map((c, i) => {
   if (i === index) {
      // 递增被点击的计数器数值
      return c + 1;
   } else {
      // 其余部分不发生变化
      return c;
   }
   });
   setCounters(nextCounters);
}
```

### 向数组中插入元素 
```
let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // 可能是任何索引
    const nextArtists = [
      // 插入点之前的元素：
      ...artists.slice(0, insertAt),
      // 新的元素：
      { id: nextId++, name: name },
      // 插入点之后的元素：
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>振奋人心的雕塑家们：</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        插入
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```
### 其他改变数组的情况
先拷贝这个数组，再改变这个拷贝后的值
```
let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];
const [list, setList] = useState(initialList);

function handleClick() {
   const nextList = [...list]; # 也可以: list.slice();
   nextList.reverse();
   setList(nextList);
}
```

即使你拷贝了数组，你还是不能直接修改其内部的元素。  
nextList[0].seen = true; 这是一种 state 的 mutation 操作，你应该避免这么做！  
你可以使用 map 在没有 mutation 的前提下将一个旧的元素替换成更新的版本。  
```
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // 创建包含变更的*新*对象
    return { ...artwork, seen: nextSeen };
  } else {
    // 没有变更
    return artwork;
  }
}));
```
此处的 ... 是一个对象展开语法，被用来创建一个对象的拷贝.

## 使用 Immer 编写简洁的更新逻辑

```
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }
}
```
**请注意当使用 Immer 时，类似 artwork.seen = nextSeen 这种会产生 mutation 的语法不会再有任何问题了：**
这是因为你并不是在直接修改原始的 state，而是在修改 Immer 提供的一个特殊的 draft 对象。同理，你也可以为 draft 的内容使用 push() 和 pop() 这些会直接修改原值的方法



