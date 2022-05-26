"use strict";

import NewsAlert from "./module/NewsAlert.js";

// kims.js
$(".scrolldown").on("click", (self) => {
  var heights = $(self.currentTarget)
    .parents()
    .find(".section[id]")
    .has($(self.currentTarget));
  var indexing = $(self.currentTarget)
    .parents()
    .find(".section[id]")
    .index(heights);
  var target = $(self.currentTarget).parents().find(".section[id]")[
    indexing + 1
  ];
  $("html, body").animate(
    {
      scrollTop: $(target).offset().top,
    },
    300
  );
});

/* data-bar 퍼센트반응 기능 */
if (document.querySelector("[data-value]")) {
  document.querySelectorAll("span[data-value]").forEach((x) => {
    let per = x.dataset.value;
    let span = document.createElement("span");
    let span2 = document.createElement("span");
    span.classList.add("value");

    x.appendChild(span);
    span2.classList.add("ms-2");
    x.parentNode.appendChild(span2);
    // span2.innerHTML = `${per}%`;
    let i = 1;
    let set = setInterval(() => {
      let num = i.toFixed(0);
      span.style.cssText = `
                width: ${i}%;
            `;
      span2.innerHTML = `${num}%`;
      if (i == per) {
        clearInterval(set);
      }
      i += 0.5;
    }, 10);
  });
}
/* data-bar 퍼센트반응 기능 */

/* 스토리 진행 코드 */

/* 스토리 진행 코드 */

$(window).scroll(function () {
  // 메인페이지 스크롤 반응 바
  var vw = $(window).height() / 10;
  if ($(window).scrollTop() > 100 + vw) {
    $('[data-float="who"]').addClass("floating");
    $('[data-float="origin"]').addClass("hide");
  } else if ($(window).scrollTop() <= 100 + vw) {
    $('[data-float="who"]').removeClass("floating");
    $('[data-float="origin"]').removeClass("hide");
  }
});

$('[data-folder="true"]').find("tr:nth-child(n+2)").css("display", "none");

function toggleBtn(self) {
  var tar = $(self).parent().parent().next();
  if ($("[data-folder]").attr("data-folder") == "true") {
    tar.attr("data-folder", "false");
    tar.find("tr:nth-child(n+2)").fadeIn(1000);
    $(self).html("접기");
  } else {
    tar.attr("data-folder", "true");
    tar.find("tr:nth-child(n+2)").fadeOut(1000);
    $(self).html("펼치기");
  }
}

const colorSet = {
  vue: "primary",
  java: "primary",
  jsx: "warning",
  sh: "dark",
  bash: "dark",
  jsp: "warning",
  html: "danger",
  css: "info",
  javascript: "warning",
  json: "light",
  text: "light",
  plaintext: "light",
  sql: "secondary",
  xml: "success",
  properties: "dark",
  python: "primary",
  py: "primary",
};

window.addEventListener("load", function () {
  let langArr = document.querySelectorAll('.article-post [class|="language"]');
  langArr.forEach((el) => {
    if (el.tagName != "CODE") {
      let lang = el.classList[0].split("-")[1].toLowerCase();
      let color = "";
      // let br = document.createElement("br");
      let made = document.createElement("span");
      let wrap = document.createElement("span");
      let badge = document.createElement("span");
      color = colorSet[lang];

      made.innerHTML = `Devkimson`;
      made.setAttribute("class", "w-block tag text-end text-light made");

      badge.setAttribute("class", "lang-badge tag tag-" + color);
      // 210809 mysql 설정
      badge.innerHTML = `${
        (lang == "sql" ? "My" : "") +
        lang.charAt(0).toUpperCase() +
        lang.slice(1)
      }`;
      wrap.setAttribute(
        "class",
        "wrap-badge position-absolute w-flex flex-column align-items-end"
      );

      wrap.setAttribute("data-unselect", "true");
      wrap.style.zIndex = "5";

      el.classList.add("position-relative");
      wrap.appendChild(made);
      wrap.appendChild(badge);
      el.prepend(wrap);
    }
  });
});

window.addEventListener("keydown", (ev) => {
  if (
    (ev.ctrlKey && ev.shiftKey && ev.key == "I") ||
    (ev.ctrlKey && ev.shiftKey && ev.key == "C") ||
    ev.key === "F12"
  ) {
    ev.preventDefault();
    alert("개발자 도구가 금지된 블로그입니다.");
  }
  if (ev.ctrlKey && ev.key == "c") {
    ev.preventDefault();
    alert("무분별한 복사를 방지하기 위함입니다. 클립보드 버튼을 이용해주세요.");
  }
});

// window.addEventListener(
//   "contextmenu",
//   (ev) => {
//     ev.preventDefault();
//     alert("우클릭이 금지된 블로그입니다.");
//     return false;
//   },
//   false
// );

// 클립보드
document.querySelectorAll(".rouge-code").forEach((x) => {
  let btn = document.createElement("button");
  btn.innerHTML = "Copy";
  btn.setAttribute("class", "cpbtn btn btn-sm btn-info");
  btn.addEventListener("click", () => {
    let ta = document.createElement("textarea");
    document.body.appendChild(ta);
    ta.value = x.textContent + "[출처] :: devkimson 블로그";
    ta.select();
    document.execCommand("Copy");
    document.body.removeChild(ta);
    alert("복사가 완료되었습니다.");
  });
  x.parentNode.parentNode.parentNode.parentNode.parentNode.prepend(btn);
});

// 메일 유효성검사
function valid() {
  let name = document.querySelector('[name="name"]');
  let email = document.querySelector('[name="email"]');
  let phone = document.querySelector('[name="phone"]');
  let x,
    y,
    z = [false, false, false];
  let rex1 = /^[가-힣]{2,4}$/gi;
  if (rex1.test(name.value) == true) {
    console.log("이름 통과");
    x = true;
  }
  let rex2 = /^[a-z0-9\.\-_]+@([a-z0-9\-]+\.)+[a-z]{2,6}$/gi;
  if (rex2.test(email.value) == true) {
    console.log("메일 통과");
    y = true;
  }
  let rex3 = /^[0-9]+$/gi;
  if (rex3.test(phone.value) == true) {
    console.log("번호 통과");
    z = true;
  }
  if (x && y && z) {
    return true;
  } else {
    alert("이름, 번호, 이메일란을 다시 확인해주세요.");
    return false;
  }
}

// 메일 전송
if (document.getElementById("sendMail"))
  document.getElementById("sendMail").addEventListener("click", function () {
    let name = document.querySelector('[name="name"]');
    let email = document.querySelector('[name="email"]');
    let message = document.querySelector('[name="message"]');
    let phone = document.querySelector('[name="phone"]');
    let type = document.querySelector('[name="type"]');

    if (valid()) {
      $.ajax({
        data: {
          name: name.value,
          message: message.value,
          email: email.value,
          phone: phone.value,
          type: type.value == 1 ? "질문" : "제안",
        },
        url: "https://script.google.com/macros/s/AKfycbzcKHV1ldNC0BmgldYDLEMGjqYdWCqkn-G85ptXK1Y9woc835I/exec",
        method: "post",
        success: (data) => {
          console.log(data);
          parsing = JSON.parse(data.data);
          let r_name = parsing.name[0];
          if (data.result == "success") {
            alert(`${r_name}님의 메일이 발송되었습니다.`);
          }
          name.value = "";
          email.value = "";
          message.value = "";
          phone.value = "";
          type.value = "";
          document.querySelector(
            ".se-wrapper-inner.se-wrapper-wysiwyg.sun-editor-editable"
          ).innerHTML = "";
        },
        error: (xhr, err) => {
          console.log(err);
        },
      });
    }
  });

// let NewsAlert =

NewsAlert.init({
  alertlist: [
    {
      title: "Markdown Parser",
      content:
        'MarkdownParser를 만들고 있습니다. 블로그 포스팅을 쉽게 하기 위해 자동 치환기호, 명령형 기호, 테이블, 리스트, 블록쿼터 등 완성형으로 구현 중 입니다. 많은 관심 바랍니다 :)<a target="_blank" href="https://kkn1125.github.io/markdown-parser">[샘플보기]</a><a class="d-inline-block" href="https://github.com/kkn1125/markdown-parser" target="_blank">[바로가기]</a>',
    },
    {
      title: "Router",
      content:
        'Router.js가 이전 버전과 다르게 import 사용하여 새로 작성했습니다. 많은 관심 바랍니다 🙇‍♂️ <a target="_blank" href="https://kkn1125.github.io/router">[샘플보기]</a><a class="d-inline-block" href="https://github.com/kkn1125/router" target="_blank">[바로가기]</a>',
    },
    {
      title: "CSS Penli",
      content:
        'Penli CSS 가 <kbd>v0.2.1-bugfix</kbd>로 업데이트 되었습니다. 많은 관심 바랍니다! <a class="d-inline-block" href="https://github.com/kkn1125/penli" target="_blank">[바로가기]</a>',
    },
    {
      title: "Game - Solitaire",
      content:
        '<kbd class="kbd">Solitaire</kbd> 게임을 구현 해봤습니다. 해당 링크에서 둘러보실 수 있습니다✨ <a target="_blank" href="https://kkn1125.github.io/solitaire">[게임으로]</a> <a target="_blank" href="https://github.com/kkn1125/solitaire">[저장소 보기]</a>',
    },
    {
      title: "Griza web tool",
      content:
        '웹에서 포토샵처럼 그리고 만들어서 html로 변환하는 <kbd class="kbd">griza</kbd> 프로젝트를 하려합니다. 많은 관심 부탁드립니다 😁 <a target="_blank" href="https://kkn1125.github.io/griza">[샘플보기]</a>',
    },
    {
      title: "Jekyll theme",
      content:
        'Jekyll Theme를 만드는 중입니다. <a class="d-inline-block" href="https://github.com/kkn1125/lessmore-jekyll-theme" target="_blank">[바로가기]</a>',
    },
    // 'DocumentifyJS 업데이트가 있습니다! 현재 v1.0.0 버전 최신입니다. 자세한 내용은 아래 링크 참조바랍니다. <a class="d-inline-block" href="https://github.com/kkn1125/mkDocumentifyJS/tree/main" target="_blank">[바로가기]</a>',
    // 'Typer가 v1.0.0로 릴리즈 되었습니다! 새로운 기능 <kbd class="kbd">realTyping</kbd>이 추가되었습니다. 자세한 사항은 아래 링크를! <a class="d-inline-block" href="https://github.com/kkn1125/typer" target="_blank">[바로가기]</a>',
    // 'Tutorial js 가 <kbd class="kbd">v0.1.1</kbd>로 업데이트 되었습니다. 많은 관심 바랍니다! <a class="d-inline-block" href="https://github.com/kkn1125/tutorial" target="_blank">[바로가기]</a>',
  ],
});
const validTime = 1000 * 60 * 60 * 24;
// visite check
function getUserIdentity() {
  if (!localStorage["userInfo"]) {
    localStorage["userInfo"] = "{}";
  } else {
    const validUserMaxTimeInfo = JSON.parse(localStorage["userInfo"])[
      "maxTime"
    ];
    if (isNaN(validUserMaxTimeInfo)) {
      if (validUserMaxTimeInfo.match(/[^0-9]/gm)) {
        console.info("버그 수정된 버전으로 데이터 변경이 완료되었습니다.");
        localStorage["userInfo"] = "{}";
      }
    } else {
      console.warn("[Matches] data is valid.");
    }
  }
  return JSON.parse(localStorage["userInfo"]);
}

function setUserIdentity(userData) {
  localStorage["userInfo"] = JSON.stringify(userData);
}

const userInfo = getUserIdentity();

function isVisitedUser() {
  if (Object.keys(userInfo).length > 0) return true;
  else return false;
}

const userCheck = isVisitedUser();

if (!userCheck) {
  checkVisite(); // update visitor count!
  setUserIdentity({
    sid: navigator.userAgent.replace(/[\s]*/gm, "") + uuidv4(),
    maxTime: new Date().getTime() + validTime,
  });
} else {
  if (userInfo["sid"].startsWith(navigator.userAgent.replace(/[\s]*/gm, ""))) {
    if (new Date().getTime() > new Date(userInfo["maxTime"]).getTime()) {
      checkVisite(); // update visitor count!
      userInfo["maxTime"] = new Date().getTime() + validTime;
      setUserIdentity({
        sid: userInfo["sid"],
        maxTime: userInfo["maxTime"],
      });
    } else {
    }
  }
}

getVisiteCount();

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function checkVisite() {
  const visiteCount = await fetch("https://url.kr/6po2f9", {
    method: "get",
    mode: "no-cors",
    credentials: "same-origin",
  });
  const getResponse = await visiteCount
    .text()
    .catch((e) => console.error(e.message))
    .finally((e) => console.info("fing"));
}

async function getVisiteCount() {
  fetch(
    `https://api.allorigins.win/get?url=${encodeURIComponent(
      "https://url.kr/6po2f9*"
    )}`
  )
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      const parsedResponse = new DOMParser();
      const body = [
        ...parsedResponse
          .parseFromString(data.contents, "text/html")
          .body.querySelectorAll("div#short_stat table.table tbody tr"),
      ];
      const total = body[1].querySelector("td:last-child");
      const today = body[2].querySelector("td:last-child");
      if (document.querySelector("#total"))
        document.querySelector("#total").textContent =
          total.textContent.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "명";
      if (document.querySelector("#today"))
        document.querySelector("#today").textContent =
          today.textContent.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "명";
    });
}

if (document.querySelector("#tags"))
  document.querySelector("#tags").innerHTML = `
    ${Object.keys(
      documents
        .filter(({ tags }) => tags)
        .reduce((a, b) => {
          b.tags.forEach((t) => (a[t] = 1));
          return a;
        }, {})
    )
      .sort()
      .map(
        (tag) =>
          `<a class="text-white tag tag-primary text-capitalize" style="--bg-opacity: 0.7;" href="/tags#${tag.toLowerCase()}">#${tag}</a>`
      )
      .join(" ")}
`;
// kims.js

// img Lazy Load
const options = {
  threshold: 0,
};

const loadedStorage = [];

function detectImg(entries, obs, e) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = entry.target;
      if (target.dataset.src) {
        if (target.src.match(/imagekit/gm)) {
          if (!loadedStorage.includes(target.dataset.src)) {
            loadedStorage.push(target.dataset.src);
            target.src = target.dataset.src;
          } else {
            target.src = target.dataset.src;
          }
        }
      }
    } else {
      // console.log('out')
    }
  });
}

let observer = new IntersectionObserver(detectImg, options);
document.querySelectorAll("img").forEach((img) => {
  observer.observe(img);
});
// img Lazy Load

// article img zoom
const imgs = document.querySelectorAll(".article-post img:not(.donaricano)");
let clicked = false;
let zoomLayer = 100;
let moved;
let moving = false;
let click_position_X = 0;
let click_position_Y = 0;
let originX = 0;
let originY = 0;

let downListener = (ev) => {
  moved = true;
  moving = false;
  originX = parseInt(getComputedStyle(ev.target)["left"].slice(0, -2));
  originY = parseInt(getComputedStyle(ev.target)["top"].slice(0, -2));
  click_position_X = ev.clientX;
  click_position_Y = ev.clientY;
};

let upListener = () => {
  moved = false;
};

imgs.forEach((img) => {
  img.draggable = false;
  img.addEventListener("click", (ev) => {
    document.body.classList.add("noScroll");
    if (!clicked) {
      let copy = img.cloneNode();
      let pop = document.createElement("div");
      let zoom = document.createElement("div");
      let btn = document.createElement("button");
      copy.classList.add("zoomIn");
      pop.id = "pop";
      pop.classList.add("popup");
      pop.prepend(zoom);
      zoom.classList.add("zoom");
      zoom.prepend(copy);
      zoom.prepend(btn);
      btn.innerHTML = "&times;";
      btn.classList.add("btn", "btn-danger", "position-absolute");
      btn.style.right = "2em";
      btn.style.zIndex = "100";
      btn.addEventListener("click", () => {
        pop.classList.remove("show");
        setTimeout(() => {
          pop.remove();
          clicked = false;
          document.body.classList.remove("noScroll");
        }, 300);
      });

      copy.addEventListener("click", (evt) => {
        if (!moved && !moving) {
          if (copy.classList.contains("zoomOut")) {
            copy.classList.replace("zoomOut", "zoomIn");
          }
          let zoomIn = evt.target;
          zoomIn.style.cssText = `
              width: ${zoomLayer}% !important;
              top: ${evt.target.style.top};
              left: ${evt.target.style.left};
          `;
          if (zoomLayer == 150) {
            copy.classList.replace("zoomIn", "zoomOut");
          }
          if (zoomLayer > 150) {
            zoomLayer = 100;
            zoomIn.style.cssText = `
                width: ${zoomLayer}% !important;
                top: 0;
                left: 0;
            `;
          }
          zoomLayer += 10;
        }
      });

      copy.addEventListener("mousedown", downListener);
      copy.addEventListener("mousemove", (evt) => {
        if (moved) {
          moving = true;
          let oX = evt.clientX;
          let oY = evt.clientY;
          evt.target.style.cssText = `
              top: ${originY + (oY - click_position_Y)}px;
              left: ${originX + (oX - click_position_X)}px;
              width: ${evt.target.style.width} !important;
          `;
        } else {
          moving = false;
          moved = false;
        }
      });
      window.addEventListener("mouseup", upListener);

      document.body.prepend(pop);
      setTimeout(() => {
        pop.classList.add("show");
      }, 300);
      clicked = true;
    }
  });
});
// article img zoom

// scrollViewer
const body = document.body;
const main = document.querySelector("main");
const gnb = document.querySelector("nav.gnb");
let scrolled = "pause";
let scrollMaxPauseTime = 2;

body.addEventListener("scroll", scrollViewer);
window.addEventListener("click", handleSideBar);

function handleSideBar(ev) {
  const target = ev.target;
  if (target.id != "delBtn") return;

  document.querySelector("#lsb").classList.remove("show");
  document.querySelector("#lsb").classList.add("hide");
}

function scrollViewer(ev) {
  const scrollBarVisiblePoint = document.body.scrollHeight;
  scrolled = "scroll";
  // 스크롤 되는 비율을 나타내고자 한다.
  // 1. 전체길이와 화면길이의 차이를 구한다.
  // 2. 스크롤의 현재 위치를 구한다.
  // console.log(window.innerHeight,scrollBarVisiblePoint)
  if (window.innerHeight < scrollBarVisiblePoint) {
    // 윈도우 높이가 스크롤 발생지점 값보다 작다면
    // 스크롤이 발생하기 때문에 수치화된 스크롤 비율을 나타낸다.

    const scrollMaximumValue = scrollBarVisiblePoint - window.innerHeight;
    const currentScrollPoint = body.scrollTop;
    const scrollPercent = parseInt(
      (currentScrollPoint / scrollMaximumValue) * 100
    );

    renderScrollGauge(scrollPercent);
  } else {
    // 스크롤이 없기 때문에 동작 안하도록 한다.
  }
  return body.scrollTop;
}

function renderScrollGauge(gaugeValue) {
  const gauge = body.querySelector("#scrollGauge");
  const validDigit = gaugeValue.toString().split(".");
  let temp = validDigit[1] == "00" ? validDigit[0] : gaugeValue;

  if (!gauge) {
    const box = document.createElement("div");
    box.id = "scrollGauge";
    box.classList.add("tag", "tag-info");
    body.append(box);
    box.innerHTML = `<span></span>`;
  } else {
    gauge.children[0].textContent = `${temp > 100 ? 100 : temp}%`;
  }
}

let detectPauseScrolling = setInterval(() => {
  const gauge = body.querySelector("#scrollGauge");

  if (scrolled !== "scroll") {
    setTimeout(() => {
      scrolled = "ready";
      if (gauge) {
        gauge.classList.add("gauge-hide");
        setTimeout(() => {
          gauge.remove();
        }, 300);
      }
    }, scrollMaxPauseTime);
  } else {
    scrolled = "pause";
  }
}, 1000);
// scrollViewer

// submenu scroll horizontal
window.addEventListener("wheel", scrollHorizontal, { passive: false });
function scrollHorizontal(ev) {
  const target = ev.target;
  const isTargetMenu = target.closest(".submenu");
  if (isTargetMenu) {
    ev.preventDefault();
    ev.stopPropagation();
    let max_width = isTargetMenu.scrollWidth - isTargetMenu.clientWidth;
    if (0 <= isTargetMenu.scrollLeft && isTargetMenu.scrollLeft <= max_width)
      isTargetMenu.scrollLeft -= ev.wheelDeltaY;
    return false;
  }
}

let clickForScroll = false;
let first = 0;
let originWidth = 0;

window.addEventListener("mousedown", (ev) => {
  if (ev.target.closest(".submenu")) {
    clickForScroll = true;
    originWidth = document.querySelector(".submenu").scrollLeft;
    first = ev.clientX;
  }
});

window.addEventListener("mouseup", (ev) => {
  clickForScroll = false;
});

window.addEventListener("mousemove", (ev) => {
  let menu = document.querySelector(".submenu");
  if (clickForScroll) {
    menu.scrollTo({
      left: originWidth - (ev.clientX - first),
      top: menu.scrollTop,
      behavior: "auto",
    });
  }
});

// 20220313 main page 분할

const pagination = document.querySelector("#pagination");
const left = document.querySelector("#leftBtn");
const right = document.querySelector("#rightBtn");
const pagesEl = document.querySelectorAll("[page]");
const pages = {};
let currentPage = 0;

pagesEl.forEach((e) => {
  if (!pages[e.getAttribute("group")]) pages[e.getAttribute("group")] = [];
  pages[e.getAttribute("group")].push(e.getAttribute("page"));
});

if (document.querySelector(`[page]`)) {
  updatePage();
}

function updatePage(attr, group) {
  if (group && attr) {
    document
      .querySelectorAll(`[group="${group}"][page]`)
      .forEach((d) => (d.hidden = true));

    document
      .querySelectorAll(`[group="${group}"][page="${attr}"]`)
      ?.forEach((d) => d.removeAttribute("hidden"));
  } else {
    document
      .querySelectorAll(`[group][page]`)
      .forEach((x) => (x.hidden = true));
    Object.keys(pages).forEach((t) => {
      document
        .querySelectorAll(
          `[group="${t}"][page="${pages[t][left ? currentPage : 0]}"]`
        )
        ?.forEach((d) => d.removeAttribute("hidden"));
    });
  }

  if (left && right) {
    if (currentPage == 0) {
      left.hidden = true;
    } else if (currentPage == pages[group].length - 1) {
      right.hidden = true;
    } else {
      left.removeAttribute("hidden");
      right.removeAttribute("hidden");
    }
  }
}

function handlePageLeft(target) {
  let attr = target.getAttribute("target");
  let group = target.getAttribute("group");

  currentPage--;
  if (currentPage < 0) {
    currentPage = 0;
  }
  updatePage(attr, group);
}

function handlePageRight(target) {
  let attr = target.getAttribute("target");
  let group = target.getAttribute("group");

  currentPage++;
  if (currentPage > pages.length - 1) {
    currentPage = pages.length - 1;
  }
  updatePage(attr, group);
}

function handlePages(target) {
  let attr = target.getAttribute("target");
  let group = target.getAttribute("group");

  updatePage(attr, group);
}

window.addEventListener("click", (e) => {
  const target = e.target;
  if (target.id == "leftBtn") {
    handlePageLeft(target);
  } else if (target.id == "rightBtn") {
    handlePageRight(target);
  } else {
    if (target.hasAttribute("target")) {
      handlePages(target);
    }
    return;
  }
});
