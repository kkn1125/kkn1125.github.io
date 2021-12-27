'use strict';
const typer = Typer.init({
    typer: {
        // data-typer-name 지정태그에 텍스트 추가 모습
        words: {
            intro: ['사용자 공간, 시각 디자인등을 생각하는 건축에 매력을 느껴 실내건축을 전공했습니다.',
                '졸업 후 설계사무소에 입사하여 디자인, 프로젝트관리, 도면 작도 업무를 했고',
                '디자인 원리와 일정관리, 건축법규, 사용자입장의 사고를 배웠습니다.',
                '많은 분야에 실무자와 대면하며 각자 업무에 대한 여러 정보를 얻었고,',
                '새로운 분야에 대한 도전을 생각하게 되었습니다.',
                'AutoCAD로 도면을 그리면서 작도 능력향상을 위해 LISP언어를 알게 됐고,',
                '점점 프로그래밍에 관심을 가지면서 이직을 결심했습니다.',
                '학원을 이수하고 현재 Spring과 RestFul API를 공부 중입니다.'
            ],
            test4: [
                '이것은 추가된 텍스트입니다.',
                '얼마든지 추가 가능합니다.'
            ]
        },
        // 전역 스타일 값 지정
        speed: 0.1,
        delay: 1.5,
        loop: false,
        loopDelay: 1,
        start: 0,
        eraseMode: false,
        eraseSpeed: 0.1,
        style: {
            cursorBlink: 'horizontal'
        },
    }
})

// load lunr

function loadSearch(){
    // Create a new Index
    idx = lunr(function(){
        this.field('id')
        this.field('title', { boost: 10 })
        this.field('summary')
    })
 
    // Send a request to get the content json file
    $.getJSON('/content.json', function(data){
 
        // Put the data into the window global so it can be used later
        window.searchData = data
 
        // Loop through each entry and add it to the index
        $.each(data, function(index, entry){
            idx.add($.extend({"id": index}, entry))
        })
    })
 
    // When search is pressed on the menu toggle the search box
    $('#search').on('click', function(){
        $('.searchForm').toggleClass('show')
    })
 
    // When the search form is submitted
    $('#searchForm').on('submit', function(e){
        // Stop the default action
        e.preventDefault()
 
        // Find the results from lunr
        results = idx.search($('#searchField').val())
 
        // Empty #content and put a list in for the results
        $('#content').html('<h1>Search Results (' + results.length + ')</h1>')
        $('#content').append('<ul id="searchResults"></ul>')
 
        // Loop through results
        $.each(results, function(index, result){
            // Get the entry from the window global
            entry = window.searchData[result.ref]
 
            // Append the entry to the list.
            $('#searchResults').append('<li><a href="' + entry.url + '">' + entry.title + '</li>')
        })
    })
}