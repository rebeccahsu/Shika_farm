// 套件================================
// import Splide from './vendors/splide.min.js';

new Splide(".splide01").mount();

document.addEventListener("DOMContentLoaded", function () {
// 讀取資料==========================================
// const editRule = /[prd_number=]\d{8}$/
    let urlParams = new URLSearchParams (window.location.search); 
	let id = urlParams.get('prd_number');
	console.log(id);
        // AJAX
        fetch('./php/product_load.php', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            // 送出內容轉成JSON送出
            body: JSON.stringify({
                ID:id,
            }),
        })
            // 回應用json()轉回成JS物件   resp這行不可以{}換行,換行要記得return
            .then(resp =>  resp.json())   
            .then(body => {
                //body也不可以console
                const { successful, message ,data} = body;
                if (successful == true) {
                    console.log(successful + "訊息" +message+"資料"+data);
					let bread = document.querySelector(".pd_bread");

					
					bread.innerText=`首頁 | 周邊產品 | ${data[0].NAME}`;
					putin_top_pic(data[0].MAIN_PIC);

                  
                } else {
                    console.log(successful+' 訊息'+message);
                }
            })
            
// 讀取資料end========================================

let sp1= $("#splide01").find(".splide__list");
sp1.on("change" ,function(){


// 掛載套件=========
	var main_1 = new Splide(".splide01", {
		type: "splide",
		rewind: true,
		pagination: false,
		// arrows: false,
		// fixedHeight: 500,
		padding: { bottom: 10 },
		// マウスホイールによるスライダーの移動を有効
		wheel: true,
		releaseWheel: true,
	});

	var thumbnails_1 = new Splide("#thumbnail-slider1", {
		fixedWidth: 183,
		fixedHeight: 183,
		gap: 10,
		rewind: true,
		pagination: false,
		cover: true,
		isNavigation: false,
		arrows: false,
		padding: { top: 10, left: 0, right: 0 },
		breakpoints: {
			1200: {
				fixedWidth: 163,
				fixedHeight: 163,
			},
			992: {
				fixedWidth: 130,
				fixedHeight: 130,
				gap: 10,
			},
			768: {
				// destroy:true,  //廢棄會將此段套件失效
				// autoWidth: false
			},
		},
	});

	main_1.sync(thumbnails_1);
	main_1.mount();
	thumbnails_1.mount();
});

var main_2 = new Splide("#splide02", {
	fixedWidth: "90",
	autoHeight: true,
	type: "splide",
	rewind: true,
	pagination: true,
	arrows: true,
	gap: 20,
	padding: { bottom: 10 },
	mediaQuery: "min", //mediaQuery:'min'or'max'配合breakpoints: 尺寸
	// destroy: false,  //廢棄會將此段套件區塊會display:none
	breakpoints: {
		992: {
			drag: false,
		},
	},
}).mount();

if (window.innerWidth > 992) {
	removeSplide();
}
})

// for resize
function addSplide() {
	$(".pd_recommend").children("div").attr("id", "splide02");
	$(".pd_recommend_list").parent("div").addClass("splide__track");
	$(".pd_recommend_list").addClass("splide__list");
	$(".pd_recommend_list").find("li").addClass("splide__slide");
}

function removeSplide() {
	$(".pd_recommend").children("div").removeAttr("id", "splide02");
	$(".pd_recommend_list").parent("div").removeClass("splide__track");
	$(".pd_recommend_list").removeClass("splide__list");
	$(".pd_recommend_list").find("li").removeClass("splide__slide");
}

$(window).on("resize", function () {
	// console.log(innerWidth);
	if (window.innerWidth > 992.98) {
		if ($(".pd_recommend").has("#splide02")) {
			removeSplide();
			// console.log("object");
		}
	} else {
		addSplide();
	}
});
// for resize end========================
function putin_top_pic(top_pic){
top_pic = JSON.parse(top_pic);
console.log(top_pic);
let sp1= $("#splide01").find(".splide__list");
top_pic.forEach((v) => {
	sp1.append(`<li class="splide__slide"><img src="${v}" alt=""></li>`);
});

let sp1_under=$("#thumbnail-slider1").find(".splide__list");
$.each(top_pic,(i,v) => {
	sp1_under.append(`<li class="splide__slide"><img src="${v}" alt=""></li>`)
});

}
// 套件與讀取資料end=========================================================

// 數量調整按鍵
var stockCount = document.querySelector("#pd_stockCount_input");
var inStock = document.querySelector("#pd_inStock");

$("#pd_stockCount_minus").on("click", (e) => {
	stockChack(-1);
});
$("#pd_stockCount_plus").on("click", (e) => {
	stockChack(+1);
});
$("#pd_stockCount_input").on("keyup", (e) => {
	// 濾除其他字
	var str = e.target.value.replace(/\D/g, "");
	console.log("keyin");
	if (str <= parseInt(inStock.innerText)) {
		stockCount.value = str;
	} else {
		stockCount.value = 1;
		alert("sorry! 超過在庫數量");
	}
});

function stockChack(el) {
	// -+按鈕
	// 當el= -1 檢查是否大於2
	switch (el) {
		case -1:
			console.log("--");
			if (parseInt(stockCount.value) > 1) {
				stockCount.value = parseInt(stockCount.value) - 1;
			}
			break;
		// 當el = +1 檢查是否<庫存
		default:
			console.log("++");
			if (parseInt(stockCount.value) < parseInt(inStock.innerText)) {
				stockCount.value = parseInt(stockCount.value) + 1;
			}
			break;
	}
}
// 數量調整按鍵end
// ==========================================

$("#pd_info_cart").on("click", (e) => {
	e.preventDefault();
	let cart_data = JSON.parse(sessionStorage.getItem("products"));
	// console.log(cart_data)
	if (cart_data == null || cart_data == false) {
		let img = document
			.querySelector(".splide__list li img")
			.getAttribute("src");
		let name = document.querySelector("#pd_info_name").innerText;
		let price = document.querySelector("#pd_info_pricr").innerText;
		let count = document.querySelector("#pd_stockCount_input").value;
		let urlParams = new URLSearchParams(window.location.search);
		let id = urlParams.get('prd_number');
		let products = [
			{
				id: id,
				img: img,
				name: name,
				price: price,
				count: Number(count),
			},
		];
		sessionStorage.setItem("products", JSON.stringify(products));
		// let cart_count = document.querySelector(".quantity");
		// // console.log(cart_count);
		// cart_count.value = count;
	} else {
		let img = document
			.querySelector(".splide__list li img")
			.getAttribute("src");
		let name = document.querySelector("#pd_info_name").innerText;
		let price = document.querySelector("#pd_info_pricr").innerText;
		let count = document.querySelector("#pd_stockCount_input").value;
		let overlayCount = parseInt(count) + parseInt(cart_data[0].count);
		let urlParams = new URLSearchParams(window.location.search);
		let id = urlParams.get('prd_number');

		let products = [
			{
				id: id,
				img: img,
				name: name,
				price: price,
				count: overlayCount,
			},
		];
		sessionStorage.setItem("products", JSON.stringify(products));
		let cart_count = document.querySelector(".quantity");
		cart_count.value = overlayCount;
	}

	// let img = document.querySelector(".splide__list li img").getAttribute("src");
	// let name = document.querySelector("#pd_info_name").innerText;
	// let price = document.querySelector("#pd_info_pricr").innerText;
	// let count = document.querySelector("#pd_stockCount_input").value;
	// let products = [
	// 	{
	// 		img: img,
	// 		name: name,
	// 		price: price,
	// 		count: Number(count),
	// 	},
	// ];
	// sessionStorage.setItem("products", JSON.stringify(products));
});

$("#pd_info_buy").on("click", (e) => {
	e.preventDefault();
	console.log("buy");
});

// 放入購物車、直接購買end
// ==========================================
// 庫存0時，停用按鈕、加入購物車和購買
// 沒有庫存時
$(function () {
	if ($("#pd_inStock").text() == 0) {
		$("#pd_info_cart").attr(
			"style",
			"background-color: #fff;  color: #ccc;  border: 1px dotted #ccc;"
		);
		$("#pd_info_buy").attr(
			"style",
			"background-color: #fff;  color: #ccc;  border: 1px dotted #ccc;"
		);
		$(".pd_stockCount_btn").attr("disabled");
		$(".pd_stockCount_btn").attr(
			"style",
			"background-color: #fff;  color: #ccc;  border: 1px dotted #ccc;"
		);
		$("#pd_stockCount_input").attr(
			"style",
			"background-color: #fff;  color: #ccc;  border: 1px dotted #ccc;"
		);
	}
});
//
