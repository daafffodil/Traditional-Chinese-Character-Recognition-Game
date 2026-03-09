export type MultiBlankQuestion = {
  simplified: string;
  text: string;
  blanks: {
    index: number;
    answer: string;
    explanation?: string;
  }[];
  options: string[];
  overallExplanation?: string;
};

export const MULTI_BLANK_QUESTIONS: MultiBlankQuestion[] = [
  {
    simplified: '发',
    text: '妹妹把頭□綁好，準備出□去上學。',
    blanks: [
      { index: 0, answer: '髮', explanation: '「頭髮」要用「髮」。' },
      { index: 1, answer: '發', explanation: '表示「出發」時用「發」。' },
    ],
    options: ['發', '髮', '後', '鐘'],
    overallExplanation: '「發」和「髮」同音，但意思不同：行動用「發」，頭髮用「髮」。',
  },
  {
    simplified: '后',
    text: '故宮裡有皇□的故事，我們站在隊伍□面聽老師說明。',
    blanks: [
      { index: 0, answer: '后', explanation: '「皇后」是古代稱呼。' },
      { index: 1, answer: '後', explanation: '表示位置或時間在後面，用「後」。' },
    ],
    options: ['后', '後', '復', '裡'],
  },
  {
    simplified: '干',
    text: '小明是班□部，負責提醒同學不要□涉別人的事，下雨天也要把衣服晾□。',
    blanks: [
      { index: 0, answer: '幹', explanation: '「幹部」用「幹」。' },
      { index: 1, answer: '干', explanation: '「干涉」用「干」。' },
      { index: 2, answer: '乾', explanation: '表示乾濕的「乾」用「乾」。' },
    ],
    options: ['干', '乾', '幹', '臺'],
    overallExplanation: '「干」這組最容易混：職務用「幹」、乾濕用「乾」、干涉用「干」。',
  },
  {
    simplified: '台',
    text: '我在服務□前排隊，螢幕上正在介紹□灣，新聞還說明天可能有□風。',
    blanks: [
      { index: 0, answer: '檯', explanation: '「櫃檯、服務檯」用「檯」。' },
      { index: 1, answer: '臺', explanation: '地名「臺灣」用「臺」。' },
      { index: 2, answer: '颱', explanation: '「颱風」用「颱」。' },
    ],
    options: ['台', '臺', '檯', '颱'],
  },
  {
    simplified: '只',
    text: '樹上有一□小鳥，我□帶了一枝鉛筆，這□是一個小意外。',
    blanks: [
      { index: 0, answer: '隻', explanation: '計算動物常用「隻」。' },
      { index: 1, answer: '只', explanation: '「只有」用「只」。' },
      { index: 2, answer: '祇', explanation: '「祇是」表示「只是」。' },
    ],
    options: ['只', '隻', '祇', '鬚'],
  },
  {
    simplified: '复',
    text: '考前要反□課文，這題有點□雜，書套還可保護封面不被□蓋到水漬。',
    blanks: [
      { index: 0, answer: '復', explanation: '「反復、復習」用「復」。' },
      { index: 1, answer: '複', explanation: '「複雜」用「複」。' },
      { index: 2, answer: '覆', explanation: '「覆蓋」用「覆」。' },
    ],
    options: ['复', '復', '複', '覆'],
  },
  {
    simplified: '钟',
    text: '教室的時□響了，哥哥對科學實驗很□情。',
    blanks: [
      { index: 0, answer: '鐘', explanation: '計時器具與鐘聲用「鐘」。' },
      { index: 1, answer: '鍾', explanation: '「鍾情」表示特別喜愛。' },
    ],
    options: ['鐘', '鍾', '曆', '錶'],
  },
  {
    simplified: '历',
    text: '我們上課讀歷史，也會在日□上圈出校外教學的日期。',
    blanks: [{ index: 0, answer: '曆', explanation: '「日曆」用「曆」。' }],
    options: ['歷', '曆', '裡', '麵'],
    overallExplanation: '同樣是「历」：經歷、歷史多用「歷」；日曆用「曆」。',
  },
  {
    simplified: '表',
    text: '妹妹看了看手□，再整理自己的外□準備上台。',
    blanks: [
      { index: 0, answer: '錶', explanation: '「手錶」用金字旁「錶」。' },
      { index: 1, answer: '表', explanation: '「外表」直接用「表」。' },
    ],
    options: ['表', '錶', '鐘', '鬆'],
  },
  {
    simplified: '须',
    text: '進圖書館□保持安靜，爺爺的鬍□是白色的。',
    blanks: [
      { index: 0, answer: '須', explanation: '「必須」用「須」。' },
      { index: 1, answer: '鬚', explanation: '「鬍鬚」用「鬚」。' },
    ],
    options: ['須', '鬚', '隻', '雲'],
  },
  {
    simplified: '面',
    text: '桌□要擦乾淨，晚餐我們吃湯□。',
    blanks: [
      { index: 0, answer: '面', explanation: '「桌面、表面」用「面」。' },
      { index: 1, answer: '麵', explanation: '食物「麵」用麥字旁。' },
    ],
    options: ['面', '麵', '復', '鐘'],
  },
  {
    simplified: '松',
    text: '操場旁有一棵□樹，綁鞋帶時不要太□。',
    blanks: [
      { index: 0, answer: '松', explanation: '植物名稱「松樹」用「松」。' },
      { index: 1, answer: '鬆', explanation: '「鬆緊」用「鬆」。' },
    ],
    options: ['松', '鬆', '裡', '錶'],
  },
  {
    simplified: '云',
    text: '天空的白□很漂亮，不要人□亦□地亂傳消息。',
    blanks: [
      { index: 0, answer: '雲', explanation: '天上的雲彩用「雲」。' },
      { index: 1, answer: '云', explanation: '成語「人云亦云」用「云」。' },
    ],
    options: ['云', '雲', '後', '幹'],
  },
  {
    simplified: '脏',
    text: '運動後衣服有點□，醫生會檢查內□是否健康。',
    blanks: [
      { index: 0, answer: '髒', explanation: '不乾淨用「髒」。' },
      { index: 1, answer: '臟', explanation: '身體器官用「臟」。' },
    ],
    options: ['髒', '臟', '鬚', '覆'],
  },
  {
    simplified: '里',
    text: '書包□有水壺，我家離學校三公□。',
    blanks: [
      { index: 0, answer: '裡', explanation: '表示裡面用「裡」。' },
      { index: 1, answer: '里', explanation: '長度單位「公里」用「里」。' },
    ],
    options: ['里', '裡', '歷', '曆'],
  },
];
