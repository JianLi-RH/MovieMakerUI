# 完整的脚本实例：
```
场景:
  -
    背景: resources/JiChuSuCai/BeiJing/山路.jpg
    名字: '武松走在路上'
    焦点: "中心"
    背景音乐: 
    比例: 1
    角色:
      -
        名字: ws
        素材: resources/SuCai/武松/无辜可爱.png
        位置: [0, 0.7]
        大小: [280, 320]
        显示: 是
        图层: 0
    活动:
      -
        名字: "武松出场1"
        描述: 武松出场
        背景音乐: 
        持续时间: 
        字幕: #Kangkang, Male
          - ['','', '我是武松', 'resources/ShengYin/武松/武松走在路上/我是武松.mp3', 'ws', 'resources/SuCai/武松/说话/武松说话.gif']
          - ['','', '流亡在外18年', 'resources/ShengYin/武松/武松走在路上/流亡在外18年.mp3', 'ws', 'resources/SuCai/武松/说话/武松说话.gif']
          - ['','', '今天终于可以回家了', 'resources/ShengYin/武松/武松走在路上/今天终于可以回家了.mp3', 'ws', 'resources/SuCai/武松/说话/武松说话.gif']
          - ['','', '好想我的大嫂啊', 'resources/ShengYin/武松/武松走在路上/好想我的大嫂啊.mp3', 'ws', 'resources/SuCai/武松/说话/武松说话.gif']
        动作:
          -
            名称: 镜头
            焦点: '中心'
            变化: [0.6, 1]
          -
            名称: 消失
            角色: 摩托车
          -
            名称: 转身
            角色: 沙雕
            度数: 左右 # 左右, 上下， 45(逆时针角度)
      -
        名字: "武松出场2"
        描述: 人物出场
        背景音乐: 
        字幕: # Yao, Male
          - ['','', '不不不', 'resources/ShengYin/武松/武松走在路上/不不不.mp3']
          - ['','', '我是说好想我的大哥啊', 'resources/ShengYin/武松/武松走在路上/我是说好想我的大哥啊.mp3']
        持续时间:   # 默认是背景音乐的长度
        动作:
          -
            名称: 更新
            角色: 
              名字: ws
              素材: resources/SuCai/武松/害羞.png
          -
            名称: 行进
            角色: ws
            开始位置: 
            结束位置: [0.55, 0.4]
            比例: # 比例变化，开始比例 - 结束比例, 例如： [0.2, 0.2] 或者 [(100,120), (100,120)]
              - [280, 320]
              - [260, 300]
            方式: 自然 #旋转
      -
        名字: "3"
        描述: 更新武松
        背景音乐: 
        字幕:
        持续时间: 0.1  # 默认是背景音乐的长度
        动作:
          -
            名称: 更新
            角色: 
              名字: ws
              素材: resources/SuCai/武松/大笑.png
      -
        名字: "3"
        描述: 人物走远
        背景音乐: 
        持续时间: 3
        字幕: 
          - ['','', '哈哈哈', 'resources/ShengYin/哈哈哈.mp3']
        动作:
          -
            名称: 行进
            角色: ws
            开始位置: 
            结束位置: [1, 200]
            比例: # 比例变化，开始比例 - 结束比例, 例如： [0.2, 0.2] 或者 [(100,120), (100,120)]
              - [260, 300]
              - [80, 100]
            方式: 自然 #旋转

  -
    背景: resources/JiChuSuCai/BeiJing/2.jpg
    名字: '看到酒馆'
    焦点: "中心"
    背景音乐: 
    比例: 1
    角色:
      -
        名字: 酒馆
        素材: resources/SuCai/武松/三万不过岗.png
        位置: [0.3, 0.6]
        大小: [100, 100]
        显示: 是
        图层: 0
      -
        名字: ws
        素材: resources/SuCai/武松/无辜可爱.png
        位置: [0.45, 0.8]
        大小: [160, 200]
        角度: -90
        显示: 是
        图层: 1
    活动:
      -
        名字: "1"
        描述: 看到酒馆
        背景音乐: 
        持续时间: 
        字幕: #Kangkang, Male
          - ['','', '噫', 'resources/ShengYin/武松/看到酒馆/噫.mp3', 'ws', 'resources/SuCai/武松/说话/武松说话.gif']
          - ['','', '远处有个酒馆', 'resources/ShengYin/武松/看到酒馆/远处有个酒馆.mp3', 'ws', 'resources/SuCai/武松/说话/武松说话.gif']
          - ['','', '走了半天路', 'resources/ShengYin/武松/看到酒馆/走了半天路.mp3', 'ws', 'resources/SuCai/武松/说话/武松说话.gif']
          - ['','', '正好饿了', 'resources/ShengYin/武松/看到酒馆/正好饿了.mp3', 'ws', 'resources/SuCai/武松/说话/武松说话.gif']
          - ['','', '过去胡乱吃些酒肉', 'resources/ShengYin/武松/看到酒馆/过去胡乱吃些酒肉.mp3', 'ws', 'resources/SuCai/武松/说话/武松说话.gif']
          - ['','', '再继续赶路', 'resources/ShengYin/武松/看到酒馆/再继续赶路.mp3', 'ws', 'resources/SuCai/武松/说话/武松说话.gif']
        动作:
          -
            名称: 镜头
            焦点: '中心'
            变化: [0.6, 1]
          -
            名称: 消失
            角色: 摩托车
          -
            名称: 转身
            角色: 沙雕
            度数: 左右 # 左右, 上下， 45(逆时针角度)
      -
        名字: "2"
        描述: 走向酒馆
        背景音乐: 
        持续时间: 
        字幕: 
          - ['','', '哈哈哈', 'resources/ShengYin/哈哈哈.mp3']
        动作:
          -
            名称: 更新
            角色: 
              名字: ws
              素材: resources/SuCai/武松/提刀.png
              图层: 0
          -
            名称: 行进
            角色: ws
            开始位置: 
            结束位置: [0.35, 0.65]
            比例: # 比例变化，开始比例 - 结束比例, 例如： [0.2, 0.2] 或者 [(100,120), (100,120)]
              - 
              - [60, 80]
            方式: 旋转 #旋转

  -
    背景: resources/JiChuSuCai/BeiJing/烧烤店.png
    名字: '酒馆里'
    焦点: "中心"
    背景音乐: 
    比例: 1
    角色:
      -
        名字: ws
        素材: resources/SuCai/武松/无辜可爱.png
        位置: [0.1, 0.4]
        大小: [260, 300]
        角度: 
        显示: 是
        图层: 1
      -
        名字: xe
        素材: resources/SuCai/JueSe/lianhong.png
        位置: [0.35, 0.3]
        大小: [220, 260]
        显示: 是
        图层: 1
      -
        名字: qz1
        素材: resources/SuCai/JueSe/qz1.png
        位置: [0.8, 0.6]
        大小: [160, 200]
        角度: 
        显示: 是
        图层: 0
      -
        名字: qz2
        素材: resources/SuCai/JueSe/qz2.png
        位置: [0.15, 0.6]
        大小: [140, 180]
        角度: 0
        显示: 是
        图层: 0
    活动:
      -
        名字: "1"
        描述: 看到酒馆
        背景音乐: 
        持续时间: 
        字幕: #武松是Yao, 小二是Vincent
          - ['','', '小二', 'resources/ShengYin/武松/酒馆里/小二.mp3', 'ws', 'resources/SuCai/武松/说话/武松说话.gif']
          - ['','', '来了', 'resources/ShengYin/武松/酒馆里/来了.mp3', 'xe', 'resources/SuCai/武松/店小二/说话.gif']
          - ['','', '客观要点什么', 'resources/ShengYin/武松/酒馆里/客观要点什么.mp3', 'xe', 'resources/SuCai/武松/店小二/说话.gif']
          - ['','', '好酒好菜尽管上', 'resources/ShengYin/武松/酒馆里/好酒好菜尽管上.mp3', 'ws', 'resources/SuCai/武松/说话/武松说话.gif']
          - ['','', '反正不给钱', 'resources/ShengYin/武松/酒馆里/反正不给钱.mp3', 'ws', 'resources/SuCai/武松/说话/武松说话.gif']
          - ['','', '好勒', 'resources/ShengYin/武松/酒馆里/好勒.mp3', 'xe', 'resources/SuCai/武松/店小二/说话.gif']
      -
        名字: "2"
        描述: 上菜1
        字幕: 
          - ['','', '老板您要的肉', 'resources/ShengYin/武松/酒馆里/老板您要的肉.mp3']
        动作:
          -
            名称: 更新
            角色: 
              名字: xe
              素材: resources/SuCai/JueSe/1.png
              图层: 0
      -
        名字: "3"
        字幕: 
          - ['','', '老板您要的酒', 'resources/ShengYin/武松/酒馆里/老板您要的酒.mp3']
        动作:
          -
            名称: 更新
            角色: 
              名字: xe
              素材: resources/SuCai/JueSe/2.png
              图层: 0
      -
        名字: "4"
        字幕: 
          - ['','', '哇喔，好酒', 'resources/ShengYin/武松/酒馆里/哇喔，好酒.mp3', 'ws', 'resources/SuCai/武松/喝酒.gif']
          - ['','', '哇喔，好酒', 'resources/ShengYin/武松/酒馆里/哇喔，好酒.mp3', 'ws', 'resources/SuCai/武松/喝酒.gif']
          - ['','', '哇喔，好酒', 'resources/ShengYin/武松/酒馆里/哇喔，好酒.mp3', 'ws', 'resources/SuCai/武松/喝酒.gif']
```