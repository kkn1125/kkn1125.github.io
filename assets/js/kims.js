$('.scrolldown').on('click', (self) => {
    var heights = $(self.currentTarget).parents().find('.section[id]').has($(self.currentTarget));
    var indexing = $(self.currentTarget).parents().find('.section[id]').index(heights);
    var target = $(self.currentTarget).parents().find('.section[id]')[indexing + 1];
    $('html, body').animate({
        scrollTop: $(target).offset().top
    }, 300);
});

/* data-bar 퍼센트반응 기능 */
$(document).ready(function () {
    $('[data-bar]').each(function (index, item) {
        $(this).css("width", $(this).data("bar") + "%");
        $(this).html($(this).data('bar') + "%");
    });
    // 	$('[data-bar]').css("width", $('[data-bar]').data("bar")+"%");
    // 	$('[data-bar]').html($('[data-bar]').data('bar')+"%");
});

/* 스토리 진행 코드 */
var storyLine = $('#storyLine');
storyLine.html($('[data-type="story"]').html());
var count = $('[data-type="story"]').parent().children('span').length;
$('#tot').html(count);

function prevStory() {
    var i = $('[data-type="story"]').parent().find('span').index($('[data-type="story"]'));
    // 	console.log(i);
    if ($('[data-type="story"]').prev().text() == "") {
        $('[data-type="story"]').parent().children('span').last().attr("data-type", "story").prevAll().removeAttr("data-type");
        storyLine.html($('[data-type="story"]').html());
    } else {
        $('[data-type="story"]').prev().attr("data-type", "story").nextAll().removeAttr("data-type");
        storyLine.html($('[data-type="story"]').html())
            .css("display", "none").slideDown(300);
    }
    $('#cur').html(i == 0 ? count : i);
    $('[data-page]').css("width", i == 0 ? "100%" : (i / count * 100) + "%"); // rangebar
}

function nextStory() {
    var i = $('[data-type="story"]').parent().find('span').index($('[data-type="story"]')) + 2;
    // 	console.log(i);
    if ($('[data-type="story"]').next().text() == "") {
        $('[data-type="story"]').parent().children('span').first().attr("data-type", "story").nextAll().removeAttr("data-type");
        storyLine.html($('[data-type="story"]').html());
    } else {
        $('[data-type="story"]').next().attr("data-type", "story").prevAll().removeAttr("data-type");
        storyLine.html($('[data-type="story"]').html())
            .css("display", "none").slideDown(300);
    }
    $('#cur').html(i == count + 1 ? 1 : i);
    $('[data-page]').css("width", i == count + 1 ? (1 / count * 100) + "%" : (i / count * 100) + "%"); // rangebar
}

/* 스토리 창 최소화 */
var minimize = 1

function minimization(self) { // 최소화 기능
    var tar = $(self).parent().parent().parent().parent();
    if (minimize == 1) {
        tar.toggleClass("minimize");
        tar.toggleClass("bg-dark");
        minimize = 0;
    }
}

function maximization(self) { // 최대화 기능
    var tar = $(self).parent().parent().parent().parent();
    if (minimize == 0) {
        tar.toggleClass("minimize");
        tar.toggleClass("bg-dark");
        minimize = 1;
        loction.href = "#window";
    }
}
var exitnum = 1;

function exit(self) { // exit function
    var tar = $(self).parent().parent().next().find('#storyLine');
    var tops = $('#window');
    if (exitnum == 1) {
        exitnum = 0;
        if (minimize == 1) {
            setTimeout(() => {
                storyLine.html("포트폴리오는 보고 오셨나요? <a href='/board/list/portfolio' class='btn btn-sm btn-outline-info'>바로가기</a> (" + 5 + ")");
            }, 0000);
            setTimeout(() => {
                storyLine.html("포트폴리오는 보고 오셨나요? <a href='/board/list/portfolio' class='btn btn-sm btn-outline-info'>바로가기</a> (" + 4 + ")");
            }, 1000);
            setTimeout(() => {
                storyLine.html("포트폴리오는 보고 오셨나요? <a href='/board/list/portfolio' class='btn btn-sm btn-outline-info'>바로가기</a> (" + 3 + ")");
            }, 2000);
            setTimeout(() => {
                storyLine.html("포트폴리오는 보고 오셨나요? <a href='/board/list/portfolio' class='btn btn-sm btn-outline-info'>바로가기</a> (" + 2 + ")");
            }, 3000);
            setTimeout(() => {
                storyLine.html("포트폴리오는 보고 오셨나요? <a href='/board/list/portfolio' class='btn btn-sm btn-outline-info'>바로가기</a> (" + 1 + ")");
            }, 4000);
            setTimeout(() => {
                storyLine.html($('[data-type="story"]').html());
            }, 5000);
            setTimeout(() => {
                exitnum = 1;
            }, 5000);
        } else {
            console.log('here');
            var span = document.createElement('span');
            span.setAttribute("class", "position-fixed zi-50");
            span.setAttribute("id", "newSpan");
            setTimeout(() => {
                var spans = $(span).html("포트폴리오는 보고 오셨나요? <a href='/board/list/portfolio' class='btn btn-sm btn-outline-info'>바로가기</a> (5)");
                tops.prepend(spans);
            }, 0);
            setTimeout(() => {
                var spans = $(span).html("포트폴리오는 보고 오셨나요? <a href='/board/list/portfolio' class='btn btn-sm btn-outline-info'>바로가기</a> (4)");
                tops.prepend(spans);
            }, 1000);
            setTimeout(() => {
                var spans = $(span).html("포트폴리오는 보고 오셨나요? <a href='/board/list/portfolio' class='btn btn-sm btn-outline-info'>바로가기</a> (3)");
                tops.prepend(spans);
            }, 2000);
            setTimeout(() => {
                var spans = $(span).html("포트폴리오는 보고 오셨나요? <a href='/board/list/portfolio' class='btn btn-sm btn-outline-info'>바로가기</a> (2)");
                tops.prepend(spans);
            }, 3000);
            setTimeout(() => {
                var spans = $(span).html("포트폴리오는 보고 오셨나요? <a href='/board/list/portfolio' class='btn btn-sm btn-outline-info'>바로가기</a> (1)");
                tops.prepend(spans);
            }, 4000);

            setTimeout(() => {
                tops.find("#" + $(span).attr("id")).remove("#" + $(span).attr("id"));
            }, 5000);
            setTimeout(() => {
                exitnum = 1;
            }, 5000);
        }
    }
}

/* 스토리 진행 코드 */
$('#btns>button').on('mouseenter', function () {
    if ($(this).html() == "prev") {
        $(this).html('<i class="fas fa-chevron-left"></i> ' + 'prev');
    }
    if ($(this).html() == "next") {
        $(this).html('next' + ' <i class="fas fa-chevron-right"></i>');
    }
});

$('#btns>button').on('mouseleave', function () {
    if ($(this).html().indexOf("prev") > -1)
        $(this).html('prev');
    if ($(this).html().indexOf("next") > -1)
        $(this).html('next');
});

$(window).scroll(function () { // 메인페이지 스크롤 반응 바
    var vw = $(window).height() / 10;
    if ($(window).scrollTop() > 100 + vw) {
        $('[data-float="who"]').addClass("floating");
        $('[data-float="origin"]').addClass("hide");
    } else if ($(window).scrollTop() <= 100 + vw) {
        $('[data-float="who"]').removeClass("floating");
        $('[data-float="origin"]').removeClass("hide");
    }
});

$('[data-folder="true"]').find('tr:nth-child(n+2)').css("display", "none");

function toggleBtn(self) {
    var tar = $(self).parent().parent().next();
    if ($('[data-folder]').attr("data-folder") == "true") {
        tar.attr("data-folder", "false");
        tar.find('tr:nth-child(n+2)').fadeIn(1000);
        $(self).html('접기');
    } else {
        tar.attr("data-folder", "true");
        tar.find('tr:nth-child(n+2)').fadeOut(1000);
        $(self).html('펼치기');
    }
}

// var i = 0;

// function commentSlide() {
//     if (i > 4) i = 0;
//     //	$('#commentslide>span').toggleClass("show");
//     setTimeout(() => {
//         $('#commentslide>span').toggleClass("show");
//     }, 1500);
//     if (i == 0)
//         $('#commentslide>span').html('<span>개발자가 되기 위해 공부중인 비전공자 입니다.</span>');
//     if (i == 1)
//         $('#commentslide>span').html('<span>Spring을 공부 중입니다.</span>');
//     if (i == 2)
//         $('#commentslide>span').html('<span>현재 포트폴리오를 만들며 취업을 준비하고 있습니다.</span>');
//     if (i == 3)
//         $('#commentslide>span').html('<span>다양한 취미를 가지고자 합니다. 자기계발을 중요하게 생각합니다.</span>');
//     if (i == 4)
//         $('#commentslide>span').html('<span>어제보다 더 발전 중입니다.</span>');
//     //	$('#commentslide>span').toggleClass("show");
//     setTimeout(() => {
//         $('#commentslide>span').toggleClass("show");
//     }, 8000);

//     setTimeout(commentSlide, 10000);
//     i++;
// }

// window.addEventListener('load', function () {
//     commentSlide();
// });