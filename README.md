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
1. <a href="…">： 会申请服务器请求 <Link href="…">： 仅执行客户端页面切换
   1. 如果想链接到外部地址，需要使用<a>
   2. next会预加载<Link >标签指向的页面（component），实现了预加载，可以提高网站速度
2. _app.js
   1. 是最顶层的react component
   2. 可以用来保存页面跳转时的状态
   3. 可以添加全局样式
   4. 每次修改后都需要重启服务： npm run dev
3. 样式
   1. 全局样式只能在pages/_app.js里引用，样式文件可以放在任意位置，名字也可以随便起
   2. module样式文件名字的后缀必须是：.module.css
   3. 应用样式文件：import '../styles/global.css';
4. Pre-rendering （只在Next.js里存在， 原始的React.js没有）
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
5. 方法中使用了await, name方法必须是async