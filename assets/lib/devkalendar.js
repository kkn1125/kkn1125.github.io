/**
 * @author : devkimson
 * @description : 세팅변수는 이후에 변수자체로 설정값 받아서 사용해야하므로 이후 변경
 * @since : 2021.07.17
 * @version : 1.1.0 ver
 * @namespace : com.devkimson.calendar
 * @site : https://devkimson.herokuapp.com/
 */

var _$ = {};
_$.isEmpty = (obj) => {
	if (obj.constructor === Object &&
		Object.keys(obj).length === 0) {
		return true;
	}
	return false;
}

let __id="";

var click = 0;

_$.fixed = {
	year: new Date().getFullYear(), // 고정 올해
	month: new Date().getMonth(), // 고정 이번달
	date: new Date().getDate() // 고정 오늘
}
var now = {
	$$year: new Date().getFullYear(),
	$$month: new Date().getMonth(),
	$$date: new Date().getDate(),
	$$hour: new Date().getHours(),
	$$minute: new Date().getMinutes(),
	$$second: new Date().getSeconds()
}

dates=0;

var com;
if (!com) com = {};
if (!com.devkimson) com.devkimson = {};

com.devkimson.calendar = { // 기능들

	_id: "", // id값 객체내 변수로 저장시키기
	_settings: {},

	create: function (_id, _settings) {
		this._id = _id;
		this._settings = _settings || {};
		this.Calendar();
		this.SetList();
	},

	Timeset: function (__year, __month) { // 기본 시간 설정

		// time settings
		this.$time = __year !== undefined && __month !== undefined ?
			new Date(__year, __month) : new Date();
		this.$year = this.$time.getFullYear();
		this.$month = this.$time.getMonth();
		this.$day = this.$time.getDay(); // 오늘 요일 0~6
		this.$date = this.$time.getDate(); // 오늘 일 수
		this.$hour = this.$time.getHours();
		this.$minute = this.$time.getMinutes();
		this.$second = this.$time.getSeconds();
		this.$first = new Date(this.$year, this.$month, 1).getDay(); // 이번달 시작 요일
		this.$last = new Date(this.$year, this.$month + 1, 0).getDate(); // 이번달 말일
		// console.log("now : " + this.$year + ":" + this.$month);
		// style settings
	},

	Init: function () { // 초기화 작업
		var thead = this._id.getElementsByTagName('thead');
		var tbody = this._id.getElementsByTagName('tbody');
		var tfoot = this._id.getElementsByTagName('tfoot');
		if (thead.length == 1 && tbody.length == 1) {
			thead[0].remove();
			tbody[0].remove();
			tfoot[0].remove();
		}
		var marker = document.getElementById("current");
		if (marker != undefined) {
			marker.remove();
			click = 0;
		}
		if (!com.devkimson.calendar){
			com.devkimson.todo = {};
		}
	},

	SetNav: function () { // calendar navigator btn
		var span = document.createElement("span");

		var tr = document.createElement("tr");
		var td = document.createElement("td");
		// prev btn
		var btn = document.createElement("button");
		var node = document.createTextNode("prev");
		btn.setAttribute("class", "btn btn-secondary text-capitalize");
		btn.addEventListener("click", (event) => {
			this.Prev();
		});
		btn.appendChild(node);
		span.appendChild(btn);

		// year select
		var span2 = document.createElement("span");
		var select = document.createElement("select");
		select.setAttribute("class", "form-select");
		select.addEventListener("change", (event) => {
			now.$$year = parseInt(event.target.value);
			this.Calendar(now.$$year, now.$$month);
		});
		select.style.width = "200px";
		for (var i = 1999; i < 2199; i++) {
			var option = document.createElement("option");
			node = document.createTextNode(i);
			option.setAttribute("value", i);
			if (now.$$year == i) option.setAttribute("selected", "true");
			option.appendChild(node);
			select.appendChild(option);
		}
		span2.appendChild(select)

		// month select
		select = document.createElement("select");
		select.setAttribute("class", "form-select");
		select.addEventListener("change", (event) => {
			now.$$month = parseInt(event.target.value);
			this.Calendar(now.$$year, now.$$month);
		});
		select.style.width = "100px";
		for (var i = 0; i < 12; i++) {
			var option = document.createElement("option");
			node = document.createTextNode(i + 1);
			option.setAttribute("value", i);
			if (now.$$month == i) option.setAttribute("selected", "true");
			option.appendChild(node);
			select.appendChild(option);
		}
		span2.appendChild(select)
		// span2 attr
		span2.setAttribute("class", "d-flex justify-content-center");
		span.appendChild(span2);

		// next btn
		btn = document.createElement("button");
		node = document.createTextNode("next");
		btn.setAttribute("class", "btn btn-secondary text-capitalize");
		btn.addEventListener("click", (event) => {
			this.Next();
		});
		btn.appendChild(node);
		span.appendChild(btn);

		// span attr
		span.setAttribute("class", "d-flex justify-content-between");
		td.setAttribute("colspan", "7");

		td.appendChild(span);
		tr.appendChild(td);
		return tr;
	},

	SetDay: function () { // 요일 세팅
		var thead = document.createElement("thead");
		var tr = document.createElement("tr");
		var td = document.createElement("td");
		thead.appendChild(this.SetNav());
		var $etting = this._settings || {}; // or 연산자는 있는 값을 택해서 값을 저장시킴
		if (!$etting.table) $etting.table = {};

		if (this._id.getAttribute("class").indexOf("custom") == -1) { // 테이블 설정
			$etting.table.width !== undefined ? // 테이블 셀별로 크기 조정
				$(this._id).css({
					"width": $etting.table.width?$etting.table.width:"auto",
					"marginLeft": "auto",
					"marginRight": "auto"
				}) : "";

			// $etting.table.height !== undefined ?
			// 	$(this._id).css("height", $etting.table.height) : $(this._id).css("height", "25rem");

			$etting.table.color !== undefined ?
				this._id.setAttribute("class", this._id.getAttribute("class") + " " + $etting.table.color) :
				this._id.setAttribute("class", this._id.getAttribute("class") + " text-muted");

			$etting.table.bgColor !== undefined ?
				this._id.setAttribute("class", this._id.getAttribute("class") + " " + $etting.table.bgColor) :
				this._id.setAttribute("class", this._id.getAttribute("class") + "");

			$etting.table.padding !== undefined ?
				this._id.style.padding = $etting.table.padding :
				this._id.style.padding = "2rem";
			// console.log(this._id.style.padding);

			$etting.table.collapse !== undefined ?
				this._id.style.borderCollapse = $etting.table.collapse :
				this._id.style.borderCollapse = "collapse";
			// console.log(this._id.style.collapse);

			$etting.table.spacing !== undefined ?
				this._id.style.borderSpacing = $etting.table.spacing :
				this._id.style.borderSpacing = "0px";
			// console.log(this._id.style.spacing);
		}

		for (var i = 0; i < 7; i++) {
			var day = "일";
			if (i == 1) {
				day = "월";
			}
			if (i == 2) {
				day = "화";
			}
			if (i == 3) {
				day = "수";
			}
			if (i == 4) {
				day = "목";
			}
			if (i == 5) {
				day = "금";
			}
			if (i == 6) {
				day = "토";
			}
			td = document.createElement("td");
			var dayNode = document.createTextNode(day);
			td.appendChild(dayNode);
			// newM 삼항연산자는 괄호하고 컴마로 구분하여 여러 설정을 넣을수 있다.

			tr.setAttribute("class", "fw-bold");
			tr.appendChild(td);
		}
		thead.appendChild(tr);
		this._id.appendChild(thead);

	},

	Calendar: function (__year, __month) { // 달력 만드는 기능
		this.Init(); // 초기화
		this.SetDay(); // 요일 세팅
		cal = new this.Timeset(now.$$year, now.$$month); // 인스턴스 생성
		var tbody = document.createElement("tbody");
		var tr = document.createElement("tr");
		
		for (var i = 0; i < cal.$first; i++) { // fill Empty
			var td = document.createElement("td");
			var emptyNode = document.createTextNode("");
			td.appendChild(emptyNode);
			tr.appendChild(td);
		}

		for (var q = 1; q <= cal.$last; q++) {
			var td = document.createElement("td");
			var node = document.createTextNode(q);
			td.setAttribute("id", q);
			if (_$.fixed.date == q && _$.fixed.month == cal.$month && _$.fixed.year == cal.$year) {
				// 달과 일수가 같을 때 오늘 표시
				td.setAttribute("class", "fw-bold");
				td.style.color = this._settings.today.color;
			}
			td.addEventListener('click', (event) => {
				var snum = event.target.getAttribute("id"); // 1.1.0ver 타겟 지정 값 수정
				this.Marker(snum);
			});
			td.appendChild(node);
			tr.appendChild(td);
			if ((q + cal.$first) % 7 == 0) {
				tr = document.createElement("tr");
			}
			$(tr).attr("valign","middle")
			.css("height","50px");
			tbody.appendChild(tr);
		}

		if ((cal.$first + cal.$last) % 7 != 0) { // 마지막 일이 딱 떨어지지 않을때 빈칸으로 채움
			for (var o = 0; o < (7 - (cal.$first + cal.$last) % 7); o++) {
				var td = document.createElement("td");
				var emptyNode = document.createTextNode("");
				td.appendChild(emptyNode);
				tr.appendChild(td);
			}
		} else {
			// $(tbody).find('tr:last-child()').remove();
			// 마지막 일자가 토요일에 딱 떨어질때 추가되는 빈 tr을 제거
		}

		this._id.appendChild(tbody);

		var tfoot = document.createElement("tfoot");
		tr = document.createElement('tr');
		var td = document.createElement('td');
		var btn = document.createElement("button");
		var node = document.createTextNode("Today");
		$(btn).addClass("btn btn-outline-warning w-100")
		.attr("onclick","com.devkimson.calendar.Now()");
		btn.appendChild(node);
		$(td).attr("colspan","7");
		td.appendChild(btn);
		tr.appendChild(td);
		tfoot.appendChild(tr);
		this._id.appendChild(tfoot);

		// todo marker place
		if(this.data.year[cal.$year]!=undefined && this.data.year[cal.$year].month[cal.$month]!=undefined) // json구조 바뀌면서 변경
		for(key of Object.keys(this.data.year[cal.$year].month[cal.$month].date)){
			// todo marker
			var span = document.createElement('span');
			var len = Object.keys(this.data.year[cal.$year].month[cal.$month].date[key]).length;
			$(span).css({
				"display":"block",
				"position":"absolute",
				"bottom":"calc(50% + .5rem)",
				"left":"calc(50% + .8rem)",
				"border":"1px solid black",
				"borderRadius":"50%",
				"backgroundColor":"red",
				"width":".5rem",
				"height":".5rem",
				"pointerEvents":"none",
				"fontSize":".8rem"
			}).html(`<span style="pointer-events:none;position:absolute;top:-150%;left:150%;">+${len}</span>`);
			$(`#${key}`).append(span).css({
				"position":"relative"
			});
		}
	},

	Prev: function () { // 저번달
		now.$$month -= 1;
		if (now.$$month == -1) {
			now.$$month = 11;
			now.$$year--;
		}
		this.Calendar(now.$$year, now.$$month);
	},

	Next: function () { // 다음달
		now.$$month += 1;
		if (now.$$month == 12) {
			now.$$month = 0;
			now.$$year++;
		}
		this.Calendar(now.$$year, now.$$month);
	},

	Now: function(){
		now.$$year = _$.fixed.year;
		now.$$month = _$.fixed.month;
		this.Calendar(now.$$year, now.$$month);
	},

	Marker: function ($marker) { // 클릭 날짜 표시
		if (click == 0) {
			var mark = document.createElement("span");
			var node = document.createTextNode("");
			mark.appendChild(node);
			mark.setAttribute("id", "current");
			mark.setAttribute("class", "position-absolute");
			document.body.appendChild(mark);
			click += 1;
		}
		var cur = document.getElementById("current");

		this.GetList(now.$$year, now.$$month, $marker);
		
		var ids = $marker == undefined ? document.getElementById(now.$$date) : document.getElementById($marker);
		
		var $top = $(ids).offset().top;
		var $left = $(ids).offset().left;
		var $height = $(ids).height();
		var $width = $(ids).width();
		var $etting = this._settings || {}; // or 연산자는 있는 값을 택해서 값을 저장시킴
		if (!$etting.marker) $etting.marker = {};
		if (!$etting.transition) $etting.transition = {};
		if (!$etting.attr) $etting.attr = {};

		// newM 새로운 사실
		// console.log($etting.marker.thick||"3px")을 뒤에두면 존재값 있고 없고에 따라
		// 존재값 혹은 디폴트값으로 부여된다.
		// 순서를 존재여부 값을 먼저 앞에 두고 디폴트값
		// ".5s cubic-bezier(1, 0, 0, 1)"

		var _mset = {
			transition: ($etting.marker.speed || ".5s") + " " + ($etting.marker.bezier || "cubic-bezier(1, 0, 0, 1)"), // settable

			display: "inline-block",

			borderBottom: ($etting.marker.thick || "3px") // settable
				+
				" " + ($etting.marker.style || "solid") +
				" " + ($etting.marker.color || "rgba(255, 173, 173, 0.5)"),

			width: $etting.marker.width || $width + "px", // settable

			height: $height + "px",

			top: "calc(" + $top + "px + 1rem)",

			left: "calc(" + ($left) + "px + .5rem)"
		};

		cur.style.transition = _mset.transition; // settable
		cur.style.display = _mset.display;
		cur.style.borderBottom = _mset.borderBottom; // settable
		cur.style.width = _mset.width; // settable
		cur.style.height = _mset.height;
		cur.style.top = _mset.top;
		cur.style.left = _mset.left;
		this.display(now.$$year, now.$$month, $marker);
		// window.location.href='#todoContainer'; // Todo list 바로가기
	},
	
	display: function(year, month, date){ // 지정한 날짜 디스플레이 기능
		var div = com.devkimson.calendar.tmp.containerDiv;
		// tmp에 저장된 객체 끌어오기
		if($('#dateLine'))
			$('#dateLine').remove();
		$(div).prepend(`<span id="dateLine">
		${year} ${month+1} <span class="h3">${date}</span>
		</span>`);
	},

	_day: function(day){
		let _day;
		if(day==0) _day="일";
		else if(day==1) _day="월";
		else if(day==2) _day="화";
		else if(day==3) _day="수";
		else if(day==4) _day="목";
		else if(day==5) _day="금";
		else if(day==6) _day="토";
		return _day;
	},
	SetList: function(){ // init
		var par = $(this._id).parent();
		var div = document.createElement('div');
		// 일자 클릭시 내용 출력 container
		com.devkimson.calendar.tmp={containerDiv:div};
		// 객체를 스코프 바깥에서 사용하기 위해 임시저장공간으로
		// 저장시킴
		var btnlist = document.createElement('div');
		var list = document.createElement('div');
		var h3 = document.createElement('h3');
		var node = document.createTextNode('TODO LIST');
		var $ettings = this._settings;
		// 객체 프로퍼티 스코프 때문에 변수로 불러옴
		$(h3).css({
			"marginTop":"1rem"
		});

		$(btnlist).attr("id","btnlist").css({
			"marginTop":"1rem"
		});
		
		$(list).attr({
			"id":"list"
		}).css({
			"borderTop":"3px solid gray",
			"borderBottom":"3px solid gray",
			"borderRadius":"5px",
			"padding":"1rem",
			"marginTop":"1rem",
			"backgroundColor":"rgba(0,0,0,0.02)"
		});

		$(list).html(`
			<span class="fw-bold w-100 d-block text-muted text-center">
				요일을 선택하시면 리스트가 나옵니다.
			</span>
		`);

		$(div).attr({
			"id":"todoContainer",
			"class":"container"
		});

		h3.append(node);
		div.append(h3); // 리스트 네임(title)
		div.append(list); // 리스트 표시부분
		div.append(btnlist); // 텍스트 입력 및 버튼
		par.append(div);
	},
	GetList: function(year, month, date){
		var btn = document.createElement('button');
		node = document.createTextNode('할일 추가');
		$(btn).attr({
			"id":"adding",
			"class":"btn btn-lg btn-outline-info mt-3",
			"onclick":`com.devkimson.calendar.AddList(${year},${month},${date})`
		});
		btn.append(node);

		var tar = document.createElement('textarea');
		$(tar).attr({
			"id":"content",
			"class":"form-control",
			"rows":"5",
			"placeholder":"Kalendar TODO List\n\n생각은 금방 사라집니다.\n여기에 기록하여 생각을 남기세요."
		});

		$('#btnlist').html(''); // init
		$('#btnlist').append(tar);
		$('#btnlist').append(btn);

		if(this.data!=undefined){ // data와 연결해야하는 부분
			for(key of Object.keys(this.data.year).values()){
				if(key==year){ // year compare
					for(key2 of Object.keys(this.data.year[key].month)){
						if(key2==month){ // month compare
							for(key3 of Object.keys(this.data.year[key].month[key2].date)){
								var todos = "";
								if(key3==date){
									for(key4 of this.data.year[key].month[key2].date[date]){ 	// todolist
										todos += 
										`
											<div class="mb-2 clearfix">▷ ${key4.todo}
												<span class="badge text-muted float-end">${key4.time}</span>
											</div>
										`; // todo
										$('#list').html(todos);
									}
								}
							}
						}
					}
				}
				if(this.data.year[key]==undefined || this.data.year[key].month[month]==undefined || this.data.year[key].month[month].date[date]==undefined){
					// 연월일별 리스트 없는 항목 누를시 띄우는 메세지
					$('#list').html(`
					<span class="fw-bold w-100 d-block text-muted text-center">
						등록된 할 일이 없습니다.
					</span>
				`); // init
				}
			}
		}
	},
	
	AddList: function(year, month, date){ // 추가
		// console.log('add');
		// data에 연결해서 추가하는 부분 (json처리)
		var node = $("#content").val();
		var div = document.createElement('div');
		$(div).text(`${node}`);
		// console.log(this.data.year[year])
		if(node=="" || node.length==0 || node == " "){
			alert("내용을 기입하셔야합니다.");
		} else {
			if(this.data.year[year]==undefined){ // 연도 없을 시 생성
				this.data.year[year] = {"month":{month}};
				console.log('first');
				console.log(this.data.year)
			}
			if(this.data.year[year].month[month]==undefined){ // 월 없을 시 생성
				this.data.year[year].month[month] = {"date":{date}};
				console.log('second');
				console.log(this.data.year[year].month)
			}
			if(this.data.year[year].month[month].date[date]==undefined){ // 일자 없을 시 생성
				this.data.year[year].month[month].date[date] = []; // 배열 추가
				this.data.year[year].month[month].date[date][0] = {
					todo:node,
					time:`${_$.fixed.year}-${_$.fixed.month+1}-${_$.fixed.date} ${now.$$hour}:${now.$$minute}`
				}; // 첫번째 노드 추가
				
				console.log('third');
			} else {
				var len = Object.keys(this.data.year[year].month[month].date[date]).length;
				this.data.year[year].month[month].date[date][len] = {
					todo:node,
					time:`${_$.fixed.year}-${_$.fixed.month+1}-${_$.fixed.date} ${now.$$hour}:${now.$$minute}`
				};
				// 첫번째 노드 이후부터 차례로 추가
			}
			// console.log(this.data.year[year].month[month].date)
			$("#content").val(""); // 텍스트 박스 초기화
			$('#list').append(div);
			// todo marker place
			this.Calendar(); // 달력 할일추가표시 업데이트
			this.GetList(year, month, date); // list부분 초기화
		}
	},

	DeleteList: function(num){
		// 삭제 처리 데이터 연결에 따라 다르므로 비움
	},

	data:{ // 임시 data
		year:{
			2021:{
				month:{
					6:{
						date:{
							23:[
								{
									todo:"도비네 가서 이사짐 옮기기",
									time:"2021-7-23 15:37"
								},
								{
									todo:"할머니댁 방문",
									time:"2021-7-23 15:38"
								}
							],
							22:[
								{
									todo:"정원 잔디깎기 약속",
									time:"2021-7-23 15:38"
								},
								{
									todo:"코.. 코딩하는 날...",
									time:"2021-7-23 15:38"
								}
							]
						}
					},
					5:{
						date:{
							20:[
								{
									todo:"코딩하는 날",
									time:"2021-7-23 15:38"
								}
							]
						}
					}
				}
			},
			2020:{
				month:{
					7:{
						date:{
							21:[
								{
									todo:"헬스장 시작한 날",
									time:"2021-7-23 15:37"
								}
							]
						}
					}
				}
			}
		}
	}

}
