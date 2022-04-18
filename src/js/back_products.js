//目前頁面亮燈
let pages = document.querySelector(".aside_ul").querySelectorAll("h5");
pages.forEach(function(page){
    if ( page.innerHTML == "商品管理"){
        page.closest("a").classList.add("-on");
    }
});

// 取得資料 =========================================================================
document.addEventListener("DOMContentLoaded",function(){

    // var product = {
    //     prd_number: `${$('.prd_number')[i].innerText}`,
    //     prd_name: `${$('.prd_name')[i].innerText}`, // <-> "varchar"
    //     prd_cost: $('.prd_cost')[i].innerText,
    //     prd_price: $('.prd_price')[i].innerText,
    //     prd_inStock: $('.prd_inStock')[i].innerText,
    //     prd_pic: `${$('.prd_pic')[i].getAttribute("src")}`, //(主圖網址) "./img/producds/${品號}_top01"  <-> "varchar"
    //     prd_condition: `${$('.prd_condition')[i].innerText}`,
    //     prd_topImage: [`${$('.prd_pic')[i].getAttribute("src")}`], // (網址) ["./img/producds/${品號}_top01"] max=4
    //     prd_intro: [{src:"./img/products/papaya2_1200.jpg",text:"木瓜瓜"},{src:"./img/products/cow_1200.jpg",text:"本農場牛牛採天然放牧"},{src:"img/products/cow_1200.jpg",text:"本農場牛牛採天然放牧"}], //商品介紹,"varchar" [{"src","text"}]  (網址)[{"./img/producds/${品號}_01"},{}] max=5
    //     prd_kind: "食品", //和資料庫關聯
    //     prd_slog: ["六入組品嚐新鮮", "這是一段測試文字"], //促銷標語 max=2
    //     prd_ingredient: "糖、香料、美好的事物和小女孩", //innerHtml 商品規格
    // }

            let url = './php/back_products_putin.php';
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                // 送出內容轉成JSON送出
                body: JSON.stringify({
                    ID:1,
                }),
            })
           
                // 回應用json()轉回成JS物件   resp這行不可以{}換行,換行要記得return
                .then(resp =>  resp.json())   
                .then(body => {
                    //body也不可以console
                    const { successful, message, data } = body;
                    if (successful) {
                        // console.log(data);
                        data.forEach(function(v){
                            // console.log(v);
                             // 判斷狀態，寫入class
                            var condition = "";
                            var inner_style = ""

                            if (v.STATE == '上架中') {
                                condition = "on";
                                inner_style = '';
                                // console.log('list on');
                            } else {
                                condition = "off";
                                inner_style = 'style="display:none;opacity:1;"'
                                // console.log('list off');
                            };

                            let MAIN_PIC=JSON.parse(v.MAIN_PIC);

                            var list_html = `<li data-prd_number="${v.ID}" data-prd_name="${v.NAME}" data-prd_condition="${condition}" class="list_item -${condition}" ${inner_style}>
                            <label class="check_container">
                            <input type="checkbox"  class="select_item">
                            <span class="checkmark"></span>
                            </label>
                            <img src="${MAIN_PIC[0]}" alt="" class="prd_pic">
                            <p class="prd_number">${v.ID}</p>
                            <p class="prd_name">${v.NAME}</p>
                            <p class="prd_cost">${v.COST}</p>
                            <p class="prd_price">${v.UNIT_PRICE}</p>
                            <p class="prd_inStock">${v.STOCK}</p>
                            <p class="prd_condition">${v.STATE}</p>
                            <button type="button" class="btn-green prd_edit">修改</button>
                            </li>`;

                            $('#pds_list').append(list_html)
                        })

                    } else {
                        alert(message);
                    }
                })
        
})

// 取得資料 end =========================================================================
// 顯示未上架==========================================
$('#show_off').on('click', (e) => {
    let listt = document.querySelectorAll('.list_item');
    // console.log(listt);
    for (let i = 0; i < listt.length; i++) {
        if (e.target.checked == false) {
            // 隱藏未上架
            if (listt[i].getAttribute("data-prd_condition") == 'off') {
                listt[i].setAttribute("style", "display:none;");
                // console.log(e.target.checked);
            }
        } else {
            // 顯示未上架
            if (listt[i].getAttribute("data-prd_condition") == 'off') {
                listt[i].removeAttribute("style");
                // console.log(e.target.checked);
                // console.log(listt);
            }
        }
    }
})

// 顯示未上架end==========================================
// 刪除按鈕===============================

$(function () {
    $('#del_pd').on('click', () => {
        // console.log($(".list_item"));
        if (confirm("確定要刪除資料嗎？")) {
                            // 打勾的項目數量 
            for (var i = $('.select_item').length-1; i>0 ; i--) {
                if ($(".select_item")[i].checked == true) { //checke box 有打勾時
                    switch ($(".select_item")[i].closest("li").getAttribute("data-prd_condition")) {    //找出li的狀態
                        case "on":
                            alert("上架中的商品不能刪除");
                            break;

                        case "off":
                            // AJAX
                            // console.log($(".select_item")[i].checked);
                            let target_id = $(".select_item")[i].closest('li').getAttribute('data-prd_number');

                            fetch('./php/back_products_delete.php', {
                                method: 'POST',
                                headers: {
                                    'Content-type': 'application/json'
                                },
                                // 送出內容轉成JSON送出
                                body: JSON.stringify({
                                    ID:target_id,
                                }),
                            })
                           
                                // 回應用json()轉回成JS物件   resp這行不可以{}換行,換行要記得return
                                .then(resp =>  resp.json())   
                                .then(body => {
                                    //body也不可以console
                                    const { successful, message,end} = body;
                                    if (successful) {
                                        console.log(successful +'訊息'+message+'數'+end);
                                    } else {
                                        alert(message);
                                    }
                                })
                                .then($(".select_item")[i].closest('li').remove())


                            break;
                        default:
                            console.log("default");
                    }
                }
            }

        } else {
            console.log('取消刪除');
        }


    })
})

// 刪除按鈕 end===============================
// 修改上下架=========================

$("#on_pd").on('click', () => {

    for (var i = 0; i < $('.select_item').length; i++) {
        if ($(".select_item")[i].checked == true) {
            // console.log($('.select_item')[i]);
            $('.list_item')[i].setAttribute('data-prd_condition', 'on');
            $('.list_item')[i].setAttribute('class', 'list_item -on');
            $('.prd_condition')[i].innerText = '上架中';
            let item_nub = $('.list_item')[i].getAttribute("data-prd_number");
            // console.log(item_nub);
            let task = JSON.parse(localStorage.getItem('prd_list'))
            console.log(task);
            // 對筆資料，並更新值
            task.forEach(function (value, a) {
                if (item_nub == task[a].prd_number) {
                    console.log(task[a].prd_number);
                    task[a].prd_condition = "上架中";
                }
            })
            localStorage.setItem("prd_list", JSON.stringify(task));

        }

    }
})


$("#off_pd").on('click', () => {
    if (confirm("確定要下架商品嗎？")) {
        for (var i = 0; i < $('.select_item').length; i++) {
            if ($(".select_item")[i].checked == true) {
                // console.log($('.select_item')[i]);
                $('.list_item')[i].setAttribute('data-prd_condition', 'off');
                $('.list_item')[i].setAttribute('class', 'list_item -off');
                $('.prd_condition')[i].innerText = '未上架';
                let item_nub = $('.list_item')[i].getAttribute("data-prd_number");
                // console.log(item_nub);
                let task = JSON.parse(localStorage.getItem('prd_list'))
                console.log(task);
                // 對筆資料，並更新值
                task.forEach(function (value, a) {
                    if (item_nub == task[a].prd_number) {
                        console.log(task[a].prd_number);
                        task[a].prd_condition = "未上架";
                    }
                })
                localStorage.setItem("prd_list", JSON.stringify(task));

            }

        }
        alert('商品已完成下架');
    }
})


// 修改上下架end
// ==================================
// 商品搜尋

$('#search_pd').on('click', () => {
    let search_target = $('#search').val();
    console.log(search_target);
    let list_item_el = $('.list_item');
    $('.list_item').each((index, value) => {
        console.log('33333');
        if (value.getAttribute('data-prd_number').search(search_target) == -1 & value.getAttribute('data-prd_name').search(search_target) == -1) {
            console.log(value);
            value.setAttribute("style", "display:none;");
        } else if (search_target == "") {
            if ($('#show_off').has('checked') && value.getAttribute('data-prd_condition').search('on') > 0) {
                console.log('X');
                value.removeAttribute("style");
            } else if ($('#show_off').has('checked')) {
                console.log('v');
                value.removeAttribute("style");
            }
        }

    })

})


// 商品搜尋end
// ========================================
// 新增商品

$('#new_pd').on('click', () => {
    location.href = "./back_product_detail.html";
})

//=========================================

//停止頁籤預設行為
$('.page_hear').on('click', (e) => {
    e.preventDefault;
    // console.log('a');

})

$('.prev_page').on('click', (e) => {
    e.preventDefault;
    // console.log('a');
    if (!($('.page_hear').find("p").text() == '1')) {
        // console.log('hear');
        $('.page_hear').prev().addClass('page_hear');
        $('.page_hear')[1].classList.remove('page_hear');
    }
})

$('.next_page').on('click', (e) => {
    e.preventDefault;
    // console.log('a');
    if (!($('.page_hear').next().is('.next_page'))) {
        // console.log('hear');
        $('.page_hear').next().addClass('page_hear');
        $('.page_hear')[0].classList.remove('page_hear');
    }
})

// ========================================
// 修改按鈕>網址轉跳
    $(document).on('click', (e) => {
        // console.log(e.target);
        // console.log(e.target.getAttribute('class'));
        if(e.target.getAttribute('class') == 'btn-green prd_edit'){
            console.log('edit');
            let target_prd = $(e.target).closest('li').data('prd_number');
            console.log(target_prd);
            location.href = `./back_product_detail.html?prd_number=${target_prd}`;
        }
    })

// ===========================================


