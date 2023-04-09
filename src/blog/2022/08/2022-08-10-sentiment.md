---
slug: "/sentiment01/"
layout: post
modified: 2023-04-08 16:57:33 +0000
date: 2022-08-10 17:29:31 +0000
title: "[JAVASCRIPT] sentiment 감정 분석"
author: Kimson
categories: [javascript]
image: /images/post/covers/TIL-javascript.png
tags: [sentiment, analyze, text, til]
description: "텍스트 감정 분석 라이브러리 사용 후기

최근 토이 프로젝트에 사용했던 라이브러리 중 sentiment라는 텍스트 감정 분석 라이브러리를 사용했던 기록을 하려합니다.

후보군이 몇가지 있었지만 대부분 유료 혹은 api 요청 한도가 지정되어 있어 결정하는데 어려움이 있었습니다. 한글 감정 분석을 지원하는 대표적인 라이브러리가 koNLPy 였는데요. 이번 프로젝트에 spring과 react를 사용하고 있었기 때문에 패스...

대략 찾아보면 `Azure Text Analytics`나 `Google NLA(Natural Language AI)`, 아니면 Naver 의 `Clovar sentiment` api를 사용할까도 생각해봤습니다. 한글을 지원해주고 인식하고 분석한 문장을 하이라이팅 해주는 이점도 있었지만 api 한도량과 초과 시 요금 발생하는 점이 영 마음에 걸렸습니다."
featured: true
hidden: false
rating: 4.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# 텍스트 감정 분석 라이브러리 사용 후기

최근 토이 프로젝트에 사용했던 라이브러리 중 sentiment라는 텍스트 감정 분석 라이브러리를 사용했던 기록을 하려합니다.

후보군이 몇가지 있었지만 대부분 유료 혹은 api 요청 한도가 지정되어 있어 결정하는데 어려움이 있었습니다. 한글 감정 분석을 지원하는 대표적인 라이브러리가 koNLPy 였는데요. 이번 프로젝트에 spring과 react를 사용하고 있었기 때문에 패스...

대략 찾아보면 `Azure Text Analytics`나 `Google NLA(Natural Language AI)`, 아니면 Naver 의 `Clovar sentiment` api를 사용할까도 생각해봤습니다. 한글을 지원해주고 인식하고 분석한 문장을 하이라이팅 해주는 이점도 있었지만 api 한도량과 초과 시 요금 발생하는 점이 영 마음에 걸렸습니다.

조금 더 불편한 방법일 수 있지만 naver의 파파고의 번역 api를 사용하기로 하였고, 감정분석은 오픈소스인 sentiment library를 사용하기로 했습니다. 어떤 분들이 sentiment를 한글 지원 버전을 만들어 두셨지만 빌드 실패로 포기했습니다.

sentiment 사용은 비교적 간단합니다. 참고로 papago api 사용은 다루지 않겠습니다.

워낙 네이버에 잘 정리되어 있기 때문에 sentiment와 혼용해서 사용한 예시 코드를 보여드리면서 기록을 마치려합니다.

## 필요한 의존 설치

```bash
yarn add sentiment @tpyes/sentiment
```

## 작업 환경

- react (typescript)
- papago api
- sentiment
- suneditor

## sentiment & papago api 혼용

```tsx
import axios from "axios";
import Sentiment from "sentiment";

const POSITIVE = "positive";
const NEGATIVE = "negative";
const NORMAL = "normal";

const positiveEmotions = ["😆", "😄", "😁", "😀", "😃", "😊", "🙂"];
const negativeEmotions = ["😕", "🥲", "😥", "😔", "🤨", "😫", "😩", "😠", "😡"];

interface Config {
  headers: {
    "content-type": string;
    "x-naver-client-id": string;
    "x-naver-client-secret": string;
  };
}

interface Emoji {
  [index: number]: string;
}

interface EmotionTypeBase {
  count: number;
}

interface EmotionType extends EmotionTypeBase {
  score: number;
  words: string[];
}

interface EmotionScore {
  [POSITIVE]: EmotionType;
  [NEGATIVE]: EmotionType;
  normal: EmotionTypeBase;
  advice: string;
  comparative: number;
  score: number;
  emoji: Emoji;
}

class Analyzer {
  private emojis: Emoji[] = positiveEmotions
    .concat("😐")
    .concat(negativeEmotions);
  private url: string = "/v1/papago/n2mt";
  private result: string;
  private analyzedResult: Sentiment.AnalysisResult;
  private emotionScore: EmotionScore = {
    [POSITIVE]: {
      score: 0,
      count: 0,
      words: [],
    },
    [NEGATIVE]: { score: 0, count: 0, words: [] },
    [NORMAL]: {
      count: 0,
    },
    advice: "",
    comparative: 0,
    score: 0,
    emoji: "",
  };

  public config: Config = {
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "x-naver-client-id": "clientId",
      // 네이버 api 사용 시 발급 받는 아이디 입니다.
      "x-naver-client-secret": "clientSecretKey",
      // 네이버 api 사용 시 발급 받는 secret key 입니다.
      // env나 별도 파일로 공개 되지 않도록 조심하시기 바랍니다.
    },
  };

  constructor(
    private source: string = "ko",
    private target: string = "en",
    private text: string
  ) {
    axios.defaults.withCredentials = true;
  }

  // axios로 papago 번역 api 요청
  async translate() {
    const res = await axios // post 방식 다르게 사용하면 cors 피할 수 있음.
      .post(
        this.url,
        `source=${encodeURIComponent(this.source)}&target=${encodeURIComponent(
          this.target
        )}&text=${encodeURIComponent(this.text)}`,
        this.config
      );
    const translatedText = await res.data;
    console.log("[TranslatedText]", translatedText);
    this.result = translatedText.message.result.translatedText;
  }

  // 영문 감정 분석
  analyze(options?: Sentiment.AnalysisOptions): Sentiment.AnalysisResult {
    const sentiment = new Sentiment();
    this.analyzedResult = sentiment.analyze(this.result, options);
    console.log("[Sentiment]", this.analyzedResult);
    return this.analyzedResult;
  }

  // 각 감정의 단어 갯수, 점수 합계, 이모지 추출
  getEmotionScore(): EmotionScore {
    this.analyzedResult.calculation.forEach((wordScore) => {
      const [token, score] = Object.entries(wordScore).pop();
      const Emotions = score > 0 ? POSITIVE : score < 0 ? NEGATIVE : NORMAL;

      if (Emotions !== NORMAL) {
        this.emotionScore[Emotions].score += score;
        this.emotionScore[Emotions].words.push(token);
      }

      this.emotionScore[Emotions].count += 1;
    });
    this.emotionScore.comparative = this.analyzedResult.comparative;
    this.emotionScore.score = this.analyzedResult.score;
    this.emotionScore.emoji = this.getEmoji();
    return this.emotionScore;
  }

  // 감정 점수 비교값으로 이모지 추출
  private getEmoji(): string {
    const baseIndex = 7;
    const comparative = this.emotionScore.comparative;
    const isPositive = comparative > 0;
    let compared;
    compared = Math.abs(isPositive ? comparative - 1 : comparative);
    const index = Math.ceil(
      (Math.ceil(compared * 10) / 10) * (isPositive ? baseIndex : 9)
    );
    const lastIndex = isPositive ? baseIndex - index : baseIndex + index;
    return this.emojis[lastIndex] as string;
  }
}

export default Analyzer;
```

사용하기 쉽도록 클래스로 작성해서 사용을 했습니다. sentiment는 영문 텍스트의 감정을 분석하기 때문에 파파고로 한글 -> 영문으로 번역하고 나서 감정분석을 하는 방식으로 작성되었습니다. 사용 예시는 아래와 같습니다.

```tsx
// 예시

const handleTextAnalyze = async () => {
  const analyzer = new Analyzer("ko", "en", editor.current?.getContents(true));

  // 번역
  await analyzer.translate();

  // 감정 분석
  const result = analyzer.analyze();

  // 결과 반환
  return {
    regdate: Date.now(),
    negative: result.negative,
    positive: result.positive,
    score: result.score,
    emotionScore: analyzer.getEmotionScore(),
  };
};
```

번역 조건을 생성자 인자로 설정하고 분석 내용을 반환하는 식 입니다. 위 예시 코드에 있는 editor는 `suneditor` 객체 입니다.

## 마무리

매우 짧은 내용 입니다. 다시 말씀드리지만 예시 코드를 기록하기 위한 포스팅 입니다.

해당 라이브러리 뿐만 아니라 여러 라이브러리를 사용해서 프로젝트를 작업하면서 느낀 점은 확실히 라이브러리마다 제공하는 docs가 얼마나 잘 정리되어 있는지에 따라, 사용자가 얼마나 내용을 잘 파악하는지에 따라 프로젝트의 퀄리티가 조금씩 달라지지 않나 생각이 듭니다. 결국은 부족한 부분을 이미 잘 만들어진 라이브러리로 커버하는 것이 제 부족함을 더 부각시키는 것인지 아니면 시간을 아끼는 것이니 오히려 잘한 것인지는 아직 모르겠습니다.

여하튼 토이 프로젝트에 관심이 있으신 분은 완성되는 대로 아래에 링크를 남기도록 하겠습니다.

---

📚 함께 보면 좋은 내용

[Naver Clovar](https://www.ncloud.com/product/aiService/clovaSentiment)

[Github::sentiment](https://github.com/thisandagain/sentiment)
