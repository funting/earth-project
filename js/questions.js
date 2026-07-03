/*
 愛地球計畫 - 題庫
 共 30 題（閱讀 10、聽力 10、簡答 10），每次測驗從對應類別中隨機抽 5 題，
 每題 20 分，滿分 100 分，三種測驗各自獨立計分。
*/

const QUESTION_BANK = {
  reading: [
    {
      id: "r1",
      passage: "小美每天出門都會自己帶水壺裝水，不買瓶裝水，因為瓶裝水喝完就會變成垃圾。",
      question: "小美為什麼自己帶水壺？",
      options: ["因為水壺比較好看", "因為可以減少垃圾", "因為媽媽規定", "因為水壺比較便宜"],
      answerIndex: 1
    },
    {
      id: "r2",
      passage: "資源回收要分類：紙類、塑膠、鐵鋁罐、玻璃都要分開放，這樣才能重新變成新的東西。",
      question: "資源回收時，紙類和塑膠應該怎麼放？",
      options: ["全部丟在一起", "分開放", "都丟進垃圾桶", "拿去燒掉"],
      answerIndex: 1
    },
    {
      id: "r3",
      passage: "妹妹出門都會隨手關燈、關電風扇，因為不用電的時候一直開著，會浪費電力，也會讓地球生病。",
      question: "妹妹為什麼要隨手關燈？",
      options: ["因為怕黑", "因為想睡覺", "因為可以節省電力", "因為燈泡壞了"],
      answerIndex: 2
    },
    {
      id: "r4",
      passage: "爸爸假日常常帶全家人去種樹，他說樹可以吸收空氣中的髒空氣，讓大家呼吸到乾淨的空氣。",
      question: "樹木對地球有什麼幫助？",
      options: ["可以吸收髒空氣", "可以變成玩具", "可以擋住太陽而已", "沒有任何幫助"],
      answerIndex: 0
    },
    {
      id: "r5",
      passage: "小華刷牙的時候會把水龍頭關起來，等要漱口的時候才打開，這樣可以節省很多水。",
      question: "小華刷牙時做了什麼環保的事？",
      options: ["用很燙的水刷牙", "刷牙時關掉水龍頭", "刷很久的牙", "用很多牙膏"],
      answerIndex: 1
    },
    {
      id: "r6",
      passage: "海邊有很多遊客留下的塑膠袋和吸管，海龜常常誤以為是食物而吃下肚，因此生病甚至死掉。",
      question: "海龜為什麼會誤食塑膠垃圾？",
      options: ["塑膠垃圾很好吃", "塑膠垃圾看起來像食物", "海龜喜歡吃塑膠", "海龜看不到垃圾"],
      answerIndex: 1
    },
    {
      id: "r7",
      passage: "班上老師發起「不用免洗餐具」活動，同學們都自己帶環保筷、環保碗到學校用餐。",
      question: "同學們用什麼取代免洗餐具？",
      options: ["環保筷和環保碗", "更多的免洗餐具", "手直接抓飯吃", "不吃飯"],
      answerIndex: 0
    },
    {
      id: "r8",
      passage: "舊衣服不穿了，可以捐出去給需要的人，或是拿去舊衣回收箱，不要隨便丟掉。",
      question: "不穿的舊衣服，最好怎麼處理？",
      options: ["丟進垃圾桶燒掉", "捐出去或拿去回收", "剪破丟掉", "藏在床底下"],
      answerIndex: 1
    },
    {
      id: "r9",
      passage: "社區舉辦淨灘活動，大家一起撿垃圾，撿了滿滿好幾大袋的塑膠瓶和垃圾。",
      question: "淨灘活動主要在做什麼？",
      options: ["在海邊蓋房子", "撿海邊的垃圾", "在海邊烤肉", "在海邊放煙火"],
      answerIndex: 1
    },
    {
      id: "r10",
      passage: "夏天的時候，媽媽把冷氣溫度設定在攝氏26到28度，並且搭配電風扇一起使用，比較省電。",
      question: "媽媽用什麼方法讓吹冷氣比較省電？",
      options: ["把冷氣一直開到最冷", "搭配電風扇並調高溫度", "整天都不關冷氣", "把窗戶打開吹冷氣"],
      answerIndex: 1
    }
  ],

  listening: [
    {
      id: "l1",
      passage: "地球只有一個，我們每天製造的垃圾越來越多，如果大家都不做資源回收，地球就會被垃圾淹沒。",
      question: "如果大家都不做資源回收，地球會發生什麼事？",
      options: ["地球會被垃圾淹沒", "地球會變得更乾淨", "地球會消失不見", "什麼事都不會發生"],
      answerIndex: 0
    },
    {
      id: "l2",
      passage: "塑膠袋在大自然中要花非常非常久的時間才會分解，所以我們出門買東西應該自己帶環保袋。",
      question: "為什麼出門買東西要自備環保袋？",
      options: ["因為環保袋比較貴", "因為塑膠袋很難分解，會汙染環境", "因為環保袋比較好看", "因為老闆規定一定要帶"],
      answerIndex: 1
    },
    {
      id: "l3",
      passage: "節能減碳的意思是減少使用電力和燃料，讓空氣中的二氧化碳變少，這樣可以減緩地球暖化的速度。",
      question: "節能減碳可以幫助地球做什麼？",
      options: ["讓地球變得更冷", "減緩地球暖化的速度", "讓天空變黑", "讓垃圾變多"],
      answerIndex: 1
    },
    {
      id: "l4",
      passage: "森林裡的樹木一棵一棵被砍掉，許多動物因為失去了家，找不到地方居住和覓食。",
      question: "森林被砍伐之後，動物會遇到什麼問題？",
      options: ["動物會變得更多", "動物會失去居住的家", "動物會搬到海裡住", "動物不會受到影響"],
      answerIndex: 1
    },
    {
      id: "l5",
      passage: "垃圾分類的時候，廚餘要另外收集，因為廚餘可以拿去做堆肥，變成種花種菜的營養土壤。",
      question: "廚餘另外收集之後，可以拿來做什麼？",
      options: ["拿來做堆肥", "拿去丟到海裡", "拿去燒掉", "放著不管它"],
      answerIndex: 0
    },
    {
      id: "l6",
      passage: "搭乘大眾運輸工具，像是公車、捷運，比起每個人都開車，可以減少空氣汙染，也能節省能源。",
      question: "為什麼搭公車或捷運對環境比較好？",
      options: ["因為比較快", "因為可以減少空氣汙染", "因為比較便宜", "因為比較舒服"],
      answerIndex: 1
    },
    {
      id: "l7",
      passage: "紙張其實是用樹木做成的，所以我們應該珍惜用紙，例如用完的紙可以兩面都寫，減少浪費。",
      question: "為什麼我們要珍惜使用紙張？",
      options: ["因為紙張是樹木做成的", "因為紙張很重", "因為紙張很難買到", "因為老師不准用紙"],
      answerIndex: 0
    },
    {
      id: "l8",
      passage: "太陽能板可以把太陽光轉換成電力，這種能源不會用完，也不會製造空氣汙染，是乾淨的能源。",
      question: "太陽能是一種什麼樣的能源？",
      options: ["會用完又會汙染的能源", "乾淨又用不完的能源", "很貴又很危險的能源", "只有晚上才能用的能源"],
      answerIndex: 1
    },
    {
      id: "l9",
      passage: "河川如果被工廠排放的髒水汙染，水裡的魚蝦就會生病甚至死亡，我們喝的水也會變得不安全。",
      question: "河川被汙染之後，可能發生什麼事？",
      options: ["魚蝦會生病死亡", "河水會變得更乾淨", "魚蝦會變得更健康", "完全不會有影響"],
      answerIndex: 0
    },
    {
      id: "l10",
      passage: "每年的四月二十二日是世界地球日，這一天大家會一起做環保活動，提醒大家要愛護地球。",
      question: "世界地球日是哪一天？",
      options: ["一月一日", "四月二十二日", "十二月二十五日", "六月五日"],
      answerIndex: 1
    }
  ],

  short: [
    {
      id: "s1",
      prompt: "地球只有一個，所以我們要好好＿＿＿地球。（請填一個詞語）",
      acceptable: ["愛護", "保護", "愛惜", "珍惜", "呵護"]
    },
    {
      id: "s2",
      prompt: "資源回收可以分成紙類、塑膠、鐵鋁罐和＿＿＿。（請寫出其中一種可回收的物品）",
      acceptable: ["玻璃", "電池", "紙類", "衣物", "舊衣", "紙箱", "寶特瓶", "瓶罐"]
    },
    {
      id: "s3",
      prompt: "離開房間時，我們應該隨手＿＿＿電燈，才能節省電力。（請填一個動詞）",
      acceptable: ["關", "關掉", "關閉"]
    },
    {
      id: "s4",
      prompt: "出門買東西的時候，自備＿＿＿可以減少塑膠袋的使用。（請填一個名詞）",
      acceptable: ["環保袋", "購物袋", "布袋", "袋子"]
    },
    {
      id: "s5",
      prompt: "多種樹可以吸收空氣中的髒空氣，讓空氣變得更＿＿＿。（請填一個形容詞）",
      acceptable: ["乾淨", "清新", "新鮮"]
    },
    {
      id: "s6",
      prompt: "刷牙的時候把水龍頭關起來，可以＿＿＿水資源。（請填一個動詞）",
      acceptable: ["節省", "節約", "省"]
    },
    {
      id: "s7",
      prompt: "「減塑」的意思是減少使用＿＿＿製品。（請填一個名詞）",
      acceptable: ["塑膠", "塑料"]
    },
    {
      id: "s8",
      prompt: "廚餘經過處理可以變成＿＿＿，用來種花種菜。（請填一個詞語）",
      acceptable: ["堆肥", "肥料", "土壤", "營養土"]
    },
    {
      id: "s9",
      prompt: "騎腳踏車或搭公車，而不是每個人都開車，可以減少空氣＿＿＿。（請填一個詞語）",
      acceptable: ["汙染", "污染"]
    },
    {
      id: "s10",
      prompt: "每年四月二十二日是世界＿＿＿日，大家會一起做環保活動。（請填一個詞語）",
      acceptable: ["地球", "地球日"]
    }
  ],

  // 英文進階專區：英文詞彙（10 題，測驗時全部出現，每題 10 分）
  engVocab: [
    { id: "ev1", question: "「地球」的英文是？", options: ["Earth", "Sun", "Moon", "Star"], answerIndex: 0 },
    { id: "ev2", question: "「回收」的英文是？", options: ["recycle", "garbage", "clean", "plant"], answerIndex: 0 },
    { id: "ev3", question: "「減少」的英文是？", options: ["reduce", "reuse", "produce", "increase"], answerIndex: 0 },
    { id: "ev4", question: "「重複使用」的英文是？", options: ["reuse", "refuse", "remove", "recycle"], answerIndex: 0 },
    { id: "ev5", question: "「污染」的英文是？", options: ["pollution", "protection", "population", "production"], answerIndex: 0 },
    { id: "ev6", question: "「能源」的英文是？", options: ["energy", "engine", "exercise", "entrance"], answerIndex: 0 },
    { id: "ev7", question: "「保護」的英文是？", options: ["protect", "project", "produce", "provide"], answerIndex: 0 },
    { id: "ev8", question: "「植物」的英文是？", options: ["plant", "plane", "plate", "place"], answerIndex: 0 },
    { id: "ev9", question: "「乾淨的」的英文是？", options: ["clean", "clear", "close", "clock"], answerIndex: 0 },
    { id: "ev10", question: "「垃圾」的英文是？", options: ["trash", "treasure", "trail", "track"], answerIndex: 0 }
  ],

  // 英文進階專區：英文聽力（10 題，測驗時全部出現，每題 10 分）
  // passage 會用英文語音朗讀，question / options 用中文幫助理解聽到的內容
  engListening: [
    {
      id: "el1",
      passage: "We should turn off the lights to save energy.",
      question: "這句話的意思是？",
      options: ["我們應該關燈以節省能源", "我們應該打開所有的燈", "我們應該買新的燈泡", "我們應該在晚上出門"],
      answerIndex: 0
    },
    {
      id: "el2",
      passage: "Please put the plastic bottle in the recycling bin.",
      question: "說話的人要我們做什麼？",
      options: ["把塑膠瓶丟進資源回收桶", "把塑膠瓶丟進一般垃圾桶", "把塑膠瓶帶回家", "把塑膠瓶壓扁丟掉"],
      answerIndex: 0
    },
    {
      id: "el3",
      passage: "Trees give us clean air to breathe.",
      question: "這句話說樹木可以帶給我們什麼？",
      options: ["乾淨的空氣", "乾淨的水", "美味的水果", "涼爽的陰影"],
      answerIndex: 0
    },
    {
      id: "el4",
      passage: "Don't waste water when you brush your teeth.",
      question: "這句話在提醒我們什麼？",
      options: ["刷牙時不要浪費水", "刷牙時要唱歌", "刷牙要刷很久", "刷牙後要洗臉"],
      answerIndex: 0
    },
    {
      id: "el5",
      passage: "Riding a bike does not pollute the air.",
      question: "為什麼騎腳踏車比較環保？",
      options: ["不會汙染空氣", "騎得比較快", "比較便宜", "比較安全"],
      answerIndex: 0
    },
    {
      id: "el6",
      passage: "We can reuse old clothes instead of throwing them away.",
      question: "這句話建議我們怎麼處理舊衣服？",
      options: ["重複使用舊衣服，不要丟掉", "把舊衣服燒掉", "把舊衣服藏起來", "把舊衣服剪破"],
      answerIndex: 0
    },
    {
      id: "el7",
      passage: "The Earth is our only home, so let's protect it.",
      question: "這句話希望我們做什麼？",
      options: ["保護地球", "離開地球", "忽略地球", "佈置地球"],
      answerIndex: 0
    },
    {
      id: "el8",
      passage: "Sunlight can be turned into clean energy.",
      question: "這句話說陽光可以變成什麼？",
      options: ["乾淨的能源", "乾淨的水", "乾淨的空氣", "乾淨的食物"],
      answerIndex: 0
    },
    {
      id: "el9",
      passage: "Please throw your trash in the garbage can, not on the ground.",
      question: "這句話要我們把垃圾丟在哪裡？",
      options: ["垃圾桶裡，不要丟在地上", "河裡", "海裡", "學校走廊"],
      answerIndex: 0
    },
    {
      id: "el10",
      passage: "Planting more trees helps to clean the air.",
      question: "這句話說多種樹可以幫助什麼？",
      options: ["讓空氣變乾淨", "讓天空變藍", "讓花朵變多", "讓水變乾淨"],
      answerIndex: 0
    }
  ]
};

// 讓瀏覽器端可以直接使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = QUESTION_BANK;
}
