---
slug: "/three-compression01/"
layout: post
modified: 2023-04-08 16:57:33 +0000
date: 2022-11-29 23:04:27 +0000
title: "[THREE] 모델 리소스 파일을 압축해보자"
author: Kimson
categories: [three]
image: /images/post/covers/TIL-three.png
tags: [javascript, 3d, draco, encoder, decoder, gltfpack, compress]
description: "3D Model Files

우선 3D Model 파일을 왜 압축하는지 말하려합니다. 사내에서 업무보는 주요 과제가 3D를 기반으로 돌아가기 때문에 늘 그래픽과 리소스 로드에 드는 비용이 문제라 생각합니다. 그 중에서도 모델 파일들은 텍스쳐와 수많은 버텍스, 애니메이션 등의 정보를 담는 파일이기에 많은 용량을 차지하면서도 꼭 필요한 리소스이기도 합니다.

건축업무를 할 때에 3DMax나 오토데스크에서 제공하는 3d(개인적으로 별로..) 툴, 스케치업, 마야 등으로 인테리어나 외장에 대한 모델링을 한 경험이 있었는데요, 그때 사용했던 범프나 uv등의 지식들이 여기서 도움이 될 줄은 몰랐습니다."
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

# 3D Model Files

우선 3D Model 파일을 왜 압축하는지 말하려합니다. 사내에서 업무보는 주요 과제가 3D를 기반으로 돌아가기 때문에 늘 그래픽과 리소스 로드에 드는 비용이 문제라 생각합니다. 그 중에서도 모델 파일들은 텍스쳐와 수많은 버텍스, 애니메이션 등의 정보를 담는 파일이기에 많은 용량을 차지하면서도 꼭 필요한 리소스이기도 합니다.

건축업무를 할 때에 3DMax나 오토데스크에서 제공하는 3d(개인적으로 별로..) 툴, 스케치업, 마야 등으로 인테리어나 외장에 대한 모델링을 한 경험이 있었는데요, 그때 사용했던 범프나 uv등의 지식들이 여기서 도움이 될 줄은 몰랐습니다.

## 압축하는 방법은 많다

압축 방법이 여러가지 존재하는 것으로 보이는데요, 열심히 구글링 하다보니 얻어낸 결과는 아래와 같습니다.

1. google draco module
2. gltf-pipeline
3. gltfpack
4. 그 외 (언급 안하겠습니다)

우선 1~3 까지는 사용해보았고, 이 포스팅은 사용한 후기 정도의 포스팅이 되겠습니다.

## Google Draco

구글에서 제공하는 3D 압축 및 압축 해제를 위한 오플 소스 라이브러리이고, 3D 그래칙의 저장 및 전송을 개선하는 효과를 주는 고마운 라이브러리입니다.

설치 방법은 간단하지만 손이 좀 갑니다. 포스팅 맨 아래 링크를 첨부하고 있습니다. 첨부된 링크 중 해당 문서로 가셔서 읽어보시기 바랍니다. 때문에 설치부분 외 javascript, html 등의 부분을 생략하니 이점 양해바랍니다.

저는 우분투 환경(wsl)을 사용하므로 ubuntu 22.04 기준으로 설명을 하겠습니다.

draco 깃헙의 저장소를 클론합니다. 혹은 zip으로 받으셔서 하셔도 됩니다. 입맛대로 하시면 되겠습니다.

그리고 해당 저장소 디렉토리에서 build 디렉토리를 생성하고 build로 이동하여 상위 디렉토리를 cmake로 빌드합니다.

```bash
$ git clone https://github.com/google/draco
$ cd draco/
$ mkdir build/
$ cd build/

$ cmake ../
# cmake가 설치되어 있지 않다면 에러가 날겁니다. 대부분 에러는 이 부분을 의심하고 g++을 설치해주고 다시 cmake로 빌드 해보시기 바랍니다.
# $ sudo apt update -y && sudo apt install g++ -y --fix-missing

$ make
$ ./draco_encoder -i <filename>.ply -o <output_filename>.drc
```

이렇게 drc확장자로 변환된 파일은 `three.js`에서 제공하는 DRACOLoader를 통해 drc파일을 로드하여 모델을 scene에 올릴 수 있습니다. 여기서의 특징을 나중에 포스팅 아래에서 다룰 예정이니 크게 언급하지 않겠습니다.

먼저 테스트를 진행한 1.4mb 파일을 인코딩한 결과 289kb라는 미친 결과가 나옵니다 😮?

실제로 로드해서 보면 원본과 별 차이가 없는 모습을 보고 놀랄 수 있습니다. 하지만 어디까지나 지금 작업하는 프로젝트가 ply나 obj로 모델을 불러오는 구조라면 좋지만 그게아닌 glb를 다룬다면 바꿔야될 부분이 많이 생길 수도 있겠지요. <del>그 바꿔야될 부분이 많은게 지금 제가 처한 상황입니다 😂</del>

그래서 그 다음으로는 glb나 gltf를 로드하는 방법을 찾아보았습니다.

## Gltf-pipeline

그래서 glb를 압축하는 방법을 찾다 보니 gltf to glb, glb to gltf, gltf to draco gltf 등으로 여러 파일 변환 기능을 가진 gltf-pipeline을 찾았습니다.

정말 후려쳐서 이야기하자면 파일 변환 정도로 판단했습니다. 실제 적용을 해보았고 실험군으로 3개의 캐릭터 모델 파일을 돌려본 결과, 1~2mb 정도의 파일들이 평균 약 0.2~0.5mb줄어든 것을 볼 수 있었습니다.

이러한 모델 파일이 다량 필요하다면 미비한 차이지만 분명 차이가 발생할 것으로 생각하고 조금 더 찾아보기로 했습니다.

참고로 설치 방법과 사용법은 아래와 같습니다.

```bash
$ npm i -g gltf-pipeline

# glb to gltf
$ gltf-pipeline -i model.glb -o model.gltf
$ gltf-pipeline -i model.glb -j
# gltf to glb
$ gltf-pipeline -i model.gltf -o model.glb
# gltf to draco gltf
$ gltf-pipeline -i model.gltf -o model.glb -d
# gltf saving separate textures
$ gltf-pipeline -i model.gltf -t
```

위 명령을 gltf-pipeline 저장소에 잘 정리되어 있으니 필요하신 분은 꼭 참고하시기 바랍니다.

## gltfpack 모듈

마지막이겠거니 하고 찾다가 gltfpack을 발견하였고, 1.4mb glb 파일을 압축해보니 280kb 정도로 압축 됨과 함께 애니메이션이 살아있고, 텍스쳐가 보존되며, 버텍스 또한 원본과 별 차이가 없는 glb파일로 압축이 되었습니다.

용량을 미친듯이 절감해서 성능 개선에 한 몫을 한 것 같아 기쁘기도 하고, 이게 되네? 싶기도 합니다.

gltfpack 또한 설치와 사용법이 간단하고 사용법은 위에 소개드렸던 두 가지와 매우 유사합니다.

```bash
npm i -g gltfpack
gltfpack -i model.gltf -o model-compress.glb
```

여기서 마냥 좋아할 수 없는 부분이 있습니다. 문제는 압축 시 무조건 앞서 말한 kb단위로 압축되지는 않는다는 점 입니다. 자세한 것은 gltfpack이 어떤 방식으로 동작하고 용량을 압축하는지는 소스코드를 까봐야 아는 부분입니다.

kb단위로 떨어져서 좋아서 박수치고 싶었지만 진정하고, 설마해서 다른 파일들을 압축해보니 33mb는 27mb정도, 29mb는 24mb정도였습니다. 어떻게 압축하는 지 모르지만 최적화가 잘 된 모델링 파일은 덜 압축되고, 압축될 수 있는 여지가 많은 모델링 파일이 많은 압축률을 보이는 것으로 생각하고 있습니다. 단지 추측이니 하나의 의견으로만 봐주시기 바랍니다.

물론 이 포스팅에서 소개는 안했지만, THREE모듈에서 제공하는 loader중 DRACOLoader를 사용하여 gltf파일을 로드하는 방법이 있습니다.

gltf는 대부분이 kb단위로 json형식의 파일입니다. 단, 모델링 파일에 필요한 images의 데이터는 별도로 이미지 파일이 있어야합니다. (같은 경로로 설정하는 것이 아니라면 gltf 파일을 까서 경로가 다른 이미지마다 수정이 필요)

## 결론

현재 고민이 되는 방법이 세 가지인데요.

1. gltfpack으로 획기적으로 압축한 파일을 사용하는 방법
2. gltf를 로드해서 초기에 무거운 이미지 리소스를 로드시키고 캐싱을 시키고 이후 로드할 때는 gltf만 로드하여 부하를 줄이는 방법
3. gltfpack으로 압축률 높은 모델 혹은 많은 양의 모델을 압축시켜 glb를 로드해서 사용하고, 나머지 로딩에 지장이 많이 가는 모델(맵 등)을 gltf로 로드해서 이미지 리소스를 캐시하는 두 가지의 로더를 사용하는 방법

개인적으로 3번이 베스트라고 생각해서 진행 중에 있습니다.

> 새벽에 급하게 기록하는 포스팅이라 손 볼 내용이 많습니다. 잘못된 정보가 있다면 댓글로 지적 부탁드립니다! 포스팅이 도움 되셨다면 댓글로 따봉이라도 주시면 감사하겠습니다 😆

---

📚 함께 보면 좋은 내용

[tutorial - google draco](https://codelabs.developers.google.com/codelabs/draco-3d/index.html#0)

[github - draco](https://github.com/google/draco)

[github - gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline)

[github - gltfpack](https://github.com/zeux/meshoptimizer/blob/master/gltf/README.md)

[npm - gltfpack](https://www.npmjs.com/package/gltfpack)

[Three.js DRACOLoader](https://threejs.org/docs/#examples/en/loaders/DRACOLoader)