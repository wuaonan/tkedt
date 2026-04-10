import type { ChapterSummary, QuizQuestion } from "../types/quiz";

const chapterTitles: Record<number, string> = {
  1: "驾驶规范",
  2: "交通信号",
  3: "法规处罚",
  4: "安全驾驶",
  5: "专项强化"
};

const seedQuestions: QuizQuestion[] = [
  {
    id: 256,
    displayOrder: 1,
    question: "年满20周岁，可以初次申请下列哪种准驾车型？",
    type: "single",
    options: ["大型客车", "中型客车", "小型汽车", "城市公交车"],
    correctIndex: 2,
    chapter: 1,
    explanation: "20 周岁可以初次申请小型汽车等准驾车型，客车类车型有更高年龄限制。",
    imageUrl: null
  },
  {
    id: 27136,
    displayOrder: 2,
    question: "机动车行驶证灭失、丢失，机动车所有人要向登记地车辆管理所申请补领、换领。",
    type: "boolean",
    options: ["正确", "错误"],
    correctIndex: 0,
    chapter: 1,
    explanation: "行驶证灭失、丢失或损毁时，机动车所有人应当向登记地车辆管理所申请补领、换领。",
    imageUrl: null
  },
  {
    id: 33550,
    displayOrder: 3,
    question: "驾驶机动车在高速公路或者城市快速路上不按规定车道行驶的，一次记几分？",
    type: "single",
    options: ["1分", "3分", "6分", "12分"],
    correctIndex: 1,
    chapter: 3,
    explanation: "在高速公路或者城市快速路上不按规定车道行驶，一次记 3 分。",
    imageUrl: null
  },
  {
    id: 366,
    displayOrder: 4,
    question: "驾驶机动车在路口直行遇到这种信号灯应该怎样行驶？",
    type: "single",
    options: ["加速通过", "减速观察通过", "在停止线前等待", "鸣喇叭提醒后通行"],
    correctIndex: 2,
    chapter: 2,
    explanation: "遇到红灯或者禁止直行的信号，应在停止线前停车等待。",
    imageUrl: null
  },
  {
    id: 699,
    displayOrder: 5,
    question: "行车中发现前方道路拥堵时，应怎样做？",
    type: "single",
    options: ["继续快速跟进", "依次排队通行", "借对向车道穿插", "鸣喇叭催促前车"],
    correctIndex: 1,
    chapter: 4,
    explanation: "道路拥堵时应当减速并依次排队通行，不得随意穿插抢行。",
    imageUrl: null
  },
  {
    id: 904,
    displayOrder: 6,
    question: "机动车发生故障时，如图所示指示灯闪烁。",
    type: "boolean",
    options: ["正确", "错误"],
    correctIndex: 0,
    chapter: 5,
    explanation: "危险报警闪光灯可以用于故障、事故等紧急提醒场景。",
    imageUrl: null
  },
  {
    id: 1604,
    displayOrder: 7,
    question: "驾驶机动车在这种情况下怎样汇入主路车流？",
    type: "single",
    options: ["强行加速并入", "停车等待所有车辆通过", "开启转向灯，观察后平顺汇入", "鸣笛后直接并入"],
    correctIndex: 2,
    chapter: 4,
    explanation: "汇入主路时应提前观察、开启转向灯，并在确认安全后平顺驶入车流。",
    imageUrl: null
  },
  {
    id: 590,
    displayOrder: 8,
    question: "这个标志的含义是提醒车辆驾驶人前方路面颠簸或有桥头跳车现象。",
    type: "boolean",
    options: ["正确", "错误"],
    correctIndex: 0,
    chapter: 2,
    explanation: "该类警告标志用于提示前方路况变化，应提前减速并注意控制车辆。",
    imageUrl: null
  },
  {
    id: 221323,
    displayOrder: 9,
    question: "开启车辆盲区监视系统，可以辅助监测驾驶人视野盲区，并在盲区内出现其他道路使用者时提醒驾驶人。",
    type: "boolean",
    options: ["正确", "错误"],
    correctIndex: 0,
    chapter: 4,
    explanation: "盲区监测系统属于辅助功能，能提升变道时对周围交通参与者的感知。",
    imageUrl: null
  },
  {
    id: 33874,
    displayOrder: 10,
    question: "驾驶机动车在高速公路上发生故障时，应在来车方向多少米外设置警告标志？",
    type: "single",
    options: ["50米", "100米", "150米以外", "200米"],
    correctIndex: 2,
    chapter: 4,
    explanation: "在高速公路上发生故障时，应当在来车方向 150 米以外设置警告标志。",
    imageUrl: null
  },
  {
    id: 2628,
    displayOrder: 11,
    question: "人行横道上禁止掉头的原因是什么？",
    type: "single",
    options: ["会影响行人通行", "掉头更省时间", "不会影响交通", "只影响大型车"],
    correctIndex: 0,
    chapter: 2,
    explanation: "人行横道是行人优先区域，在此掉头会严重影响行人通行安全。",
    imageUrl: null
  },
  {
    id: 33737,
    displayOrder: 12,
    question: "驾驶电动汽车，以下说法错误的是什么？",
    type: "single",
    options: ["出行前应检查剩余电量", "极端温度下更要关注电池状态", "电量过低也可以长时间高速行驶", "应结合续航合理规划路线"],
    correctIndex: 2,
    chapter: 5,
    explanation: "电量过低时应及时补能并控制驾驶策略，不宜继续高负荷长时间行驶。",
    imageUrl: null
  }
];

export const questions = seedQuestions;

export const chapterSummaries: ChapterSummary[] = [];

const seenChapters = new Map<number, ChapterSummary>();
for (const question of questions) {
  const found = seenChapters.get(question.chapter);
  if (found) {
    found.total += 1;
    continue;
  }

  const summary = {
    chapter: question.chapter,
    title: chapterTitles[question.chapter] || `章节 ${question.chapter}`,
    total: 1,
    firstIndex: question.displayOrder - 1
  };

  seenChapters.set(question.chapter, summary);
  chapterSummaries.push(summary);
}

export function getQuestionById(id: number) {
  return questions.find((item) => item.id === id);
}

export function getQuestionsByIds(ids: number[]) {
  return ids.map((id) => getQuestionById(id)).filter(Boolean) as QuizQuestion[];
}
