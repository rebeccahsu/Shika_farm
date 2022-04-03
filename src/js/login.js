// import * as is from 'is_js'
// import { char } from './vendors/is';

// 關閉按鈕和範圍==============

$('#back_bg').on('click', function (e) {
    closebg();
})

$('.bi-x').on('click', function (e) {
    closebg();
});

$('#login_box').on('click', function (e) {
    e.stopPropagation();
})

function closebg(t) {
    // console.log(t);
    $('#back_bg').remove();
}

// 關閉按鈕和範圍end
// ============================

// 驗證信箱格式
const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
const passwordRule = /^[\w_-]{4,16}$/;
$('#userMail').on('blur',()=>{
    // console.log('object');
    if($('#userMail').val().search(emailRule) == -1){
        $('label[for="userMail"]').html("<h5>電子郵件<span>*e-mail格式不正確</span></h5>");
    }else{
        // console.log('c');
        $('label[for="userMail"]').html("<h5>電子郵件</h5>");
    }
})

// 驗證密碼格式
$('#password').on('keyup',()=>{
    let psd = $('#password').val();
    console.log(psd);
    if(psd.length < 4 || psd.length > 16){
        $('label[for="password"]').html("<h5>密碼<span>*密碼須為4~16字以內</span></h5>");
    }else if(psd.search(passwordRule) == -1){
        $('label[for="password"]').html("<h5>密碼<span>*請輸入半形的英文和數字</span></h5>");
    }else{
        // console.log('c');
        $('label[for="password"]').html("<h5>密碼</h5>");
    }

})

$('#repassword').on('blur',()=>{
    if($('#password').val() !== $('#repassword').val() ){
        $('label[for="repassword"]').html("<h5>確認密碼<span>*和密碼不一致</span></h5>");
    }
})

// 密碼驗證end
// ============================================

// 停止預設行為，切換內容
$('.forget').on('click',(e)=>{
    console.log(e.target);
})

$('#login_btn').on('click',(e)=>{
    console.log(e.target);
})


$('#FBlogin_btn').on('click',(e)=>{
    console.log(e.target);
})

// 這側會員連結
$('.register').on('click',(e)=>{
    console.log(e.target);
})

// 註冊送出帳密
$('#next').on('click',(e)=>{
    console.log(e.target);
})

// 註冊送出詳細資料
$('#send').on('click',(e)=>{
    console.log(e.target);
})

// 忘記密碼時
$('#send_mail').on('click',(e)=>{
    console.log(e.target);
})

// 重設密碼
$('#send_psd').on('click',(e)=>{
    console.log(e.target);
})

// 註冊完成、重設密碼完成
$('#register_complete').on('click',(e)=>{
    console.log(e.target);
})




// ====================================

// 








// ============================
// ============郵遞區號============
// $('.twzipcode').twzipcode();
// $('#twz').twzipcode({
//     language: 'lang/zh-tw' //不需加上 .js
//   });

//   $('#twz').twzipcode('set', {
//     'county': '臺北市',
//     'district': '信義區',
//     'zipcode': 110
// });


/*

// Initialize
$(document).ready(function () {
    const twzipcode = new TWzipcode(".twzipcode");
    var county = $("select[name='county']").val();  // 取縣市的值
    var district = $("select[name='district']").val();  // 取鄉鎮市區的值
    var zipcode = $("select[name='zipcode']").val();  // 取郵遞區號的值

    let get = twzipcode.get();

    $('#twz').TWzipcode({
        //   css: ['', '', ''], // 套用自訂樣式，順序為縣市 / 鄉鎮市區 / 郵遞區號
        countyName: 'county', // 設定取得縣市的name
        districtName: 'district', // 設定取得鄉鎮市區的name
        zipcodeName: 'zipcode', // 設定取得郵遞區號的name
        countySel: '台北市', // 縣市預設值
        districtSel: '信義區', // 鄉鎮市區預設值
        zipcodeSel: '110', // 郵遞區號預設值
        hideCounty: [], // 隱藏縣市
        hideDistrict: [], // 隱藏鄉鎮市區
        detect: function (coords) { },  //  偵測用戶位置(需支援Google Geo Location API)
        onCountySelect: function () { },  //  選擇縣市後執行
        onDistrictSelect: function () { },  //  選擇鄉鎮市區後執行
        onZipcodeKeyUp: function () { }  //  輸入郵遞區號後執行
    });
});

*/

// ==========郵遞區號END============

// document.addEventListener('click',function(e){
//     console.log(e.target);
// })

// document.addEventListener('click',closebg(this))