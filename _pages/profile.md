---
layout: page
title: Profile
permalink: /profile
comments: false
---

<div class="my-5" style="margin-top: calc(56px + 5rem) !important">
    <!-- section 1 -->
    <div class="container-fluid my-5 text-uppercase" data-aos="fade-right">
        <h2 class="fw-bold text-center text-md-start fs-md-2 text-uppercase">기본 정보</h2>
    </div>
    <!-- section 1 -->

    <!-- section 2 -->
    <div class="container-fluid p-5 mb-5 bg-light" data-aos="fade-right">
        <div class="d-flex flex-md-row flex-column p-3 w-100" data-unselect="true">
            <div class="d-block bg-white border imgfix">
                <img src="{{site.baseurl}}/assets/images/kim.jpg" class="" alt="kim">
            </div>
            <div class="d-flex flex-column mt-5 mt-md-0 ps-md-5 justify-content-center w-100 resfont">
                <div class="d-inline-block p-1">
                    <span style="width:3rem;" class="d-inline-block text-center text-uppercase fw-bold"><i class="far fa-id-card fa-2x"></i></span>
                    <span class="float-end">김경남</span>
                </div>
                <hr>
                <div class="d-inline-block p-1">
                    <span style="width:3rem;" class="d-inline-block text-center text-uppercase fw-bold"><i class="fas fa-birthday-cake fa-2x"></i></span>
                    <span class="float-end">29세</span>
                </div>
                <hr>
                <div class="d-inline-block p-1">
                    <span style="width:3rem;" class="d-inline-block text-center text-uppercase fw-bold"><i class="far fa-envelope fa-2x"></i></span>
                    <span class="float-end"><a href="mailto:chaplet01@gmail.com">chaplet01@gmail.com</a></span>
                </div>
            </div>
        </div>
    </div>
    <!-- section 2 -->
    <!-- introduce -->
    <span id="window" data-unselect="true"></span>
    <div class="container-fluid container-md rounded-0 rounded-lg-3 my-5 py-5 bg-dark overflow-hidden position-relative" data-type="window">
        <div class="position-absolute top-0 start-0 text-white bg-info p-2 w-100" data-aos="fade-right">
            <span class="d-flex justify-content-between px-4" data-unselect="true">
                <b style="line-height: 2.3rem;">자기소개</b>
                <span>
                    <button class="btn bg-white" type="button" onclick="minimization(this)"><i class="far fa-minus-square"></i></button>
                    <button class="btn bg-white" type="button" onclick="maximization(this)"><i class="far fa-window-maximize"></i></button>
                    <button class="btn bg-white" type="button" onclick="exit(this)"><i class="fas fa-times"></i></button>
                </span>
            </span>
        </div>
        <div class="my-5 py-5" data-unselect="true" data-lazy="false">
            <h2 id="storyLine" class="container-fluid my-5 text-white" style="min-height:7rem; padding-left: 5vw; padding-right: 5vw"></h2>
            <div class="d-none">
                 <span data-type="story"><i class="fas fa-sign-out-alt"></i> 자기소개서<br>아이디어를 명확히 구현하는 예비 개발자</span>
                 <span>사용자 공간, 시각 디자인등을 생각하는 건축에 매력을 느껴 실내건축을 전공했습니다.</span>
                 <span>졸업 후 설계사무소에 입사하여 디자인, 프로젝트관리, 도면 작도 업무를 했고</span>
                 <span>디자인 원리와 일정관리, 건축법규, 사용자입장의 사고를 배웠습니다.</span>
                 <span>많은 분야에 실무자와 대면하며 각자 업무에 대한 여러 정보를 얻었고,</span>
                 <span>새로운 분야에 대한 도전을 생각하게 되었습니다.</span>
                 <span>AutoCAD로 도면을 그리면서 작도 능력향상을 위해 LISP언어를 알게 됐고,</span>
                 <span>점점 프로그래밍에 관심을 가지면서 이직을 결심했습니다.</span>
                 <span>학원을 이수하고 현재 Spring과 RestFul API를 공부 중입니다.</span>
                 <span>
                     <span class="row g-3">
                         <span class="d-flex justify-content-start align-items-center col-6">
                             <i class="fab fa-html5 me-2"></i>
                             <span class="d-inline-block col-8 bg-secondary position-relative me-2" style="height:2vh;">
                                 <span class="position-absolute top-0 start-0 d-inline-block h-100 bg-warning fs-8 text-end" style="line-height: 2vh;" data-bar="83"></span>
                             </span>
                            <span class="fs-7 text-uppercase">html</span>
                        </span>
                         <span class="d-flex justify-content-start align-items-center col-6">
                             <i class="fab fa-css3-alt me-2"></i>
                             <span class="d-inline-block col-8 bg-secondary position-relative me-2" style="height:2vh;">
                                 <span class="position-absolute top-0 start-0 d-inline-block h-100 bg-warning fs-8 text-end" style="line-height: 2vh;" data-bar="79"></span>
                             </span>
                            <span class="fs-7 text-uppercase">css</span>
                        </span>
                         <span class="d-flex justify-content-start align-items-center col-6">
                             <i class="fab fa-js me-2 fs-3"></i>
                             <span class="d-inline-block col-8 bg-secondary position-relative me-2" style="height:2vh;">
                                 <span class="position-absolute top-0 start-0 d-inline-block h-100 bg-warning fs-8 text-end" style="line-height: 2vh;" data-bar="50"></span>
                             </span>
                            <span class="fs-7 text-uppercase">javascript</span>
                        </span>
                         <span class="d-flex justify-content-start align-items-center col-6">
                             <object class="jquery me-2" data="{{site.baseurl}}/assets/images/icon/jquery-icon.svg" type="image/svg+xml" width="22.36" height="30">jquery</object>
                             <span class="d-inline-block col-8 bg-secondary position-relative me-2" style="height:2vh;">
                                 <span class="position-absolute top-0 start-0 d-inline-block h-100 bg-warning fs-8 text-end" style="line-height: 2vh;" data-bar="42"></span>
                             </span>
                            <span class="fs-7 text-uppercase">jquery</span>
                        </span>
                         <span class="d-flex justify-content-start align-items-center col-6">
                             <i class="fab fa-java me-2"></i>
                             <span class="d-inline-block col-8 bg-secondary position-relative me-2" style="height:2vh;">
                                 <span class="position-absolute top-0 start-0 d-inline-block h-100 bg-warning fs-8 text-end" style="line-height: 2vh;" data-bar="45"></span>
                             </span>
                            <span class="fs-7 text-uppercase">java</span>
                        </span>
                         <span class="d-flex justify-content-start align-items-center col-6">
                             <object class="me-2" type="image/svg+xml" data="{{site.baseurl}}/assets/images/icon/mysql.svg" width="22.36" height="30">mysql</object>
                             <span class="d-inline-block col-8 bg-secondary position-relative me-2" style="height:2vh;">
                                 <span class="position-absolute top-0 start-0 d-inline-block h-100 bg-warning fs-8 text-end" style="line-height: 2vh;" data-bar="35"></span>
                             </span>
                            <span class="fs-7 text-uppercase">mysql</span>
                        </span>
                    </span>
                 </span>
            </div>
            <div class="px-3 mt-5" data-lazy="false">
                <div id="btns" class="d-flex justify-content-between">
                    <button class="btn btn-sm" style="width: 5rem;" type="button" onclick="prevStory()">prev</button>
                    <div id="rangebar" class="text-center text-white col-4 col-sm-6 col-md-8"><span data-page></span><span id="cur">1</span><span>/</span><span id="tot">0</span></div>
                    <button class="btn btn-sm" style="width: 5rem;" type="button" onclick="nextStory()">next</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 학력 -->
    <div class="container-fluid mb-5" data-lazy="false">
        <div class="container-fluid">
            <table class="table w-100" data-unselect="true">
                <thead>
                    <tr>
                        <th colspan="3">
                            <b>학력사항</b>
                        </th>
                    </tr>
                </thead>
                <tbody class="text-center">
                    <tr>
                        <td width="20%">
                            <span class="badge text-muted">2009 ~ 2012</span>
                        </td>
                        <td>
                            <span class="fw-bold">명신고등학교</span>
                        </td>
                        <td width="25%">
                            <span class="badge text-dark">졸업</span>
                        </td>
                    </tr>
                    <tr>
                        <td width="20%">
                            <span class="badge text-muted">2012 ~ 2018</span>
                        </td>
                        <td>
                            <span class="fw-bold">한국국제대학교</span>
                        </td>
                        <td width="25%">
                            <span class="badge text-dark">실내건축학과 졸업</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    
    <!-- 경력 -->
    <div class="container-fluid mb-5" data-lazy="false">
        <div class="container-fluid">
            <table class="table w-100" data-unselect="true">
                <thead>
                    <tr>
                        <th colspan="2">
                                <b class="bg-white">경력사항</b>
                        </th>
                        <th class="text-end" onclick="toggleBtn(this)">펼치기</th>
                    </tr>
                </thead>
                <tbody id="career" class="text-center" data-folder="true" data-type="table">
                    <tr>
                        <td>
                            <span class="badge text-muted">2018.01 ~ 2020.09</span>
                        </td>
                        <td>
                            <span class="fw-bold">(주)대경건축사사무소</span>
                        </td>
                        <td>
                            <span class="badge text-dark">사원 - 주임</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">진주옥봉 행복주택 설계공모</span>
                        </td>
                        <td>
                            <span class="badge text-muted">보고서 작성</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">서귀포성산지구 공동주택 현상설계</span>
                        </td>
                        <td>
                            <span class="badge text-muted">보고서 작성</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">(공공임대리츠)창원가포 S-1BL 아파트 건설공사 2공구</span>
                        </td>
                        <td>
                            <span class="badge text-muted">도면 및 보고서 작성</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">남양주별내지구 A1-1BL 공동주택 현상설계</span>
                        </td>
                        <td>
                            <span class="badge text-muted">도면 및 보고서 작성</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">파주운정 A-37블록 공동주택 현상설계</span>
                        </td>
                        <td>
                            <span class="badge text-muted">도면 및 보고서 작성</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">제6회 주택설계 기술경진대회</span>
                        </td>
                        <td>
                            <span class="badge text-muted">도면 및 보고서 작성</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">파주운정3 A26블록 공동주택 현상설계</span>
                        </td>
                        <td>
                            <span class="badge text-muted">도면 및 보고서 작성</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">부산명지 A5블록 공동주택 현상설계</span>
                        </td>
                        <td>
                            <span class="badge text-muted">도면 및 보고서 작성</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">부산기장 A2BL 시공책임형 CMR 아파트 건설공사 1공구</span>
                        </td>
                        <td>
                            <span class="badge text-muted">도면 및 보고서 작성</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">시흥장현 A-3BL 공동주택 현상설계</span>
                        </td>
                        <td>
                            <span class="badge text-muted">도면 및 보고서 작성</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">창원명곡 A1-1BL 공동주택(신혼희망타운) 현상설계</span>
                        </td>
                        <td>
                            <span class="badge text-muted">도면 및 보고서 작성</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">남양주진접A8, 철원 철원행복주택</span>
                        </td>
                        <td>
                            <span class="badge text-muted">PM 보조 및 도면 작성</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">화성동탄2 트라이엠파크</span>
                        </td>
                        <td>
                            <span class="badge text-muted">PM 보조 및 도면 작성</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">의왕월암 A-1BL 현상설계</span>
                        </td>
                        <td>
                            <span class="badge text-muted">PM 보조 및 도면 작성</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">성남복정 A-3BL 현상설계</span>
                        </td>
                        <td>
                            <span class="badge text-muted">PM 보조 및 도면 작성</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <i class="fas fa-level-up-alt fa-rotate-90 text-muted"></i>
                        </td>
                        <td>
                            <span class="badge text-muted">종로창신, 안양석수 현상설계</span>
                        </td>
                        <td>
                            <span class="badge text-muted">PM 보조 및 도면 작성</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <!-- section 2 -->
    
    <div class="container-fluid mb-5">
        <div class="container-fluid">
            
        </div>
    </div>

    <!-- section 3 -->
    <div class="container-fluid bg-dark text-white-50" data-lazy="false">
        <div class="w-100 p-3" data-unselect="true">
            <div><b>기술스택</b></div>
            <hr class="text-white" style="height:2px">
            <div class="h6 fw-bold">Frontend</div>
            <div class="row row-cols-auto g-3 text-uppercase text-center text-white">
                <span class="p-3">
                    <i class="fab fa-html5 fa-4x"></i>
                    <br>
                    <span class="badge">html</span>
                </span>
                <span class="p-3">
                    <i class="fab fa-css3-alt fa-4x"></i>
                    <br>
                    <span class="badge">css</span>
                </span>
                <span class="p-3">
                    <i class="fab fa-js fa-4x"></i>
                    <br>
                    <span class="badge">javascript</span>
                </span>
                <span class="p-3">
                    <object class="jquery" data="{{site.baseurl}}/assets/images/icon/jquery-icon.svg" type="image/svg+xml" width="48" height="57.5">jquery</object>
                    <br>
                    <span class="badge">jquery</span>
                </span>
            </div>
            <div class="h6 fw-bold">Backend</div>
            <div class="row row-cols-auto g-3 text-uppercase text-center  text-white">
                <span class="p-3">
                    <i class="fab fa-java fa-4x"></i>
                    <br>
                    <span class="badge">java</span>
                </span>
                <span class="p-3">
                    <object type="image/svg+xml" data="{{site.baseurl}}/assets/images/icon/mysql.svg" width="48" height="57.5">mysql</object>
                    <br>
                    <span class="badge">mysql</span>
                </span>
            </div>
        </div>
    </div>
    <!-- section 3 -->
</div>