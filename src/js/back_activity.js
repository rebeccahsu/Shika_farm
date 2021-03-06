//目前頁面
let pages = document.querySelector(".aside_ul").querySelectorAll("h5");
pages.forEach(function(page){
    if ( page.innerHTML == "活動管理"){
        page.closest("a").classList.add("-on");
    }
});

// sweetalert
function sAlert(msg, icon, btn) {
    Swal.fire({
        title: msg,
        icon: icon,
        showConfirmButton: true, // 確認按鈕（預設會顯示不用設定)
        confirmButtonText: btn, //　按鈕顯示文字
        confirmButtonAriaLabel: btn, // 網頁無障礙用
        // showDenyButton: true, // 否定按鈕
        showCancelButton: false, // 取消按鈕
        buttonsStyling: false, // 是否使用sweetalert按鈕樣式（預設為true）
        customClass: {
                        confirmButton: 'btn-yellow margintop_15 marginleft_2 marginright_2',
                        cancelButton: 'btn-red margintop_15 marginleft_2 marginright_2'
                    },
    })
}

const activityList = new Vue({
    el: '#back_activity',
    // data: {
    //     activities: [
    //         { IMG: './img/activity/riding.jpg', NAME:'我要當牛仔', S1_START: '09:30', S1_END: '11:00', S2_START: '13:00~14:30', S3_START: '16:30~18:00', STATE: '上架中'},
    //         { IMG: './img/activity/pigrun.jpg', NAME:'小豬賽跑', S1_START: '10:00~10:30', S2_START: '13:00~13:30', S3_START: '15:00~15:30', STATE: '上架中' },
    //         { IMG: './img/activity/fur.jpg', NAME:'剃羊毛秀', S1_START: '09:30~10:30', S2_START: '14:00~15:00', S3_START: '17:00~18:00', STATE: '上架中' },
    //         { IMG: './img/activity/horseshow.jpg', NAME:'馬術秀', S1_START: '11:00~12:00', S2_START: '13:00~14:00', S3_START: '16:00~17:00', STATE: '未上架'},
    //         { IMG: './img/activity/alpacawalk.jpg', NAME:'草泥馬散步秀', S1_START: '10:30~11:30', S2_START: '13:30~14:30', S3_START: '15:30~16:30', STATE: '上架中' },
    //     ],
        // dates: ["2022/05/01", "2022/05/02", "2022/05/03"],
        // members: [
        //     {id: '20', people: '3', time: '2022/03/15 18:22'},
        //     {id: '3', people: '5', time: '2022/03/12 09:32'},
        // ],
    // },
    data: {
        activities: [],
        dates: ["2022-05-06", "2022-05-07", "2022-05-08"],
        members: [],
        activityId: '',
        overlay: {
            date: '選擇日期',
            session: '選擇場次時間',
        }
    },
    created() {
        fetch('./php/back_activity.php')
        .then(res => res.json())
        .then(res => this.activities = res)
        .then(res => {
            let on_arr = [];
            res.forEach(function(act){
                if (act.STATE == "未上架"){
                    let i = res.indexOf(act);
                    let offAct = document.querySelectorAll('.actList');
                    offAct[i].classList.add("-off");
                }else{
                    on_arr.push(act);
                }
            })
            let on_activity_count = document.querySelector(".actAvailable");
            on_activity_count.innerHTML = on_arr.length;

        })
    },
    methods: {
        // ==== 上架按鈕 ====
        onAct(){
            let checkbox = document.querySelectorAll(".check-act");
            let checked_arr  = [];
            checkbox.forEach(function(box){
                if (box.checked){
                    let on_li = box.closest(".actList");
                    checked_arr.push(on_li);
                }
            });
            
            // 判斷是否有勾選的項目
            if ( checked_arr.length > 0 ){
                Swal.fire({
                    title: `<h5>您確定要上架這 ${checked_arr.length} 個活動嗎？</h5>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: 'btn-green marginright_20',
                        cancelButton: 'btn-red'
                    },
                })
                .then(function(res) {
                    if (res.value) {
                        checked_arr.forEach(function(act){
                            let id = $(act).data('actid');
                            fetch('./php/back_activity_update_status.php', {
                                method: 'POST',
                                headers: {
                                    'Content-type': 'application/json'
                                },
                                body: JSON.stringify({
                                    id: id,
                                    state: '上架中',
                                }),
                            })
                            .then(res =>  res.json())   
                            .then(res => {
                                if (res.successful) {
                                    $(act).removeClass("-off");
                                    $(act).find(".state-text").html("上架中");
                                    sAlert(`<h5>已成功上架 ${checked_arr.length} 個活動！</h5>`, 'success', 'OK');
                                    checkbox.forEach(function(box){
                                        if (box.checked){
                                            box.checked = false;
                                        }
                                    });
                                } else {
                                    sAlert(`<h5>您所選的活動皆已是上架狀態</h5>`, 'warning', 'OK');
                                }
                                activityList.checkAvailability();       
                            });
                        });
                    };
                });
            }else{
                sAlert(`<h5>您尚未勾選任何活動</h5>`, 'warning', 'OK');
            };
                
        },
        // ==== 下架按鈕 ====
        offAct(){

            let checkbox = document.querySelectorAll(".check-act");
            let checked_arr  = [];
            checkbox.forEach(function(box){
                if (box.checked){
                    let off_li = box.closest(".actList");
                    checked_arr.push(off_li);
                }
            });
            // 判斷是否有勾選的項目
            if ( checked_arr.length > 0 ){
                Swal.fire({
                    title: `<h5>您確定要下架這 ${checked_arr.length} 個活動嗎？</h5>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    buttonsStyling: false,
                    customClass: {
                        confirmButton: 'btn-green marginright_20',
                        cancelButton: 'btn-red'
                    },
                })
                .then(function(res) {
                    if (res.value) {
                        checked_arr.forEach(function(act){
                            let id = $(act).data('actid');
                            fetch('./php/back_activity_update_status.php', {
                                method: 'POST',
                                headers: {
                                    'Content-type': 'application/json'
                                },
                                body: JSON.stringify({
                                    id: id,
                                    state: '未上架',
                                }),
                            })
                            .then(res =>  res.json())   
                            .then(res => {
                                if (res.successful) {
                                    $(act).addClass("-off");
                                    $(act).find(".state-text").html("未上架");
                                    sAlert(`<h5>已成功下架 ${checked_arr.length} 個活動！</h5>`, 'success', 'OK');
                                    checkbox.forEach(function(box){
                                        if (box.checked){
                                            box.checked = false;
                                        }
                                    });
                                } else {
                                    sAlert(`<h5>您所選的活動皆已是下架狀態</h5>`, 'warning', 'OK');
                                }
                                activityList.checkAvailability();       
                            });
                        });
                    };
                });
            }else{
                sAlert(`<h5>您尚未勾選任何活動</h5>`, 'warning', 'OK');
            };
            
        },
        // ==== 上架中活動數量 ====
        checkAvailability (){
            let activity_li = document.querySelectorAll(".actList");
            let on_activity = [];
            activity_li.forEach(function(li){
                if (li.classList.contains("-off")){
                }else{
                    on_activity.push(li);
                }
            })
            let on_activity_count = document.querySelector(".actAvailable");
            on_activity_count.innerHTML = on_activity.length;
        },
        // ==== 刪除按鈕 ====
        deleteAct(){
            let checkbox = document.querySelectorAll(".check-act");
            let checked_arr  = [];
            let state_arr = [];
            checkbox.forEach(function(box){
                if (box.checked){
                    let del_li = box.closest(".actList");
                    checked_arr.push(del_li);
                    // 檢查勾選的項目中有無上架中的活動
                    if (! $(del_li).hasClass('-off')){
                        state_arr.push('false');
                    }
                }
            });

            // 判斷是否有勾選的項目
            if ( checked_arr.length > 0 ){
                if (state_arr.length > 0 ){
                    sAlert(`<h5>勾選的項目中有上架中的活動，<br>因此無法刪除</h5>`, 'warning', 'OK');
                }else{
                    Swal.fire({
                        title: `<h5>確定要刪除這 ${checked_arr.length} 個活動嗎？</h5>`,
                        showCancelButton: true,
                        buttonsStyling: false,
                        confirmButtonText: '確定',
                        cancelButtonText: '取消',
                        customClass: {
                            confirmButton: 'btn-green marginright_20',
                            cancelButton: 'btn-red'
                        },      
                    })
                    .then((result) => {
                        
                        if (result.value) {
                            let success_arr = [];
                            let fail_arr = [];
                            checked_arr.forEach(function(act){

                                let id = $(act).data('actid');
                                // 是否有預約
                                fetch('./php/activity_signed_members.php', {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(
                                        {activityId: id, }
                                    ),
                                })
                                .then(res => res.json())
                                .then(res => {
                                    
                                    function deleteNews(res){
                                        if(res.length == 0){
                                            // console.log('無人預約');
                                            success_arr.push(act);
                                            
                                        }else{
                                            // console.log('return');
                                            fail_arr.push(act);
                                            return;
                                        }

                                        fetch('./php/back_activity_delete.php', {
                                            method: 'POST',
                                            headers: {
                                                'Content-type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                ID: id,
                                            }),
                                        })
                                        .then(res =>  res.json())   
                                        .then(res => {
                                            if (res.successful) {
                                                $(act).addClass("fade_out");
                                                setTimeout(function(){
                                                    act.remove();
                                                }, 1000);
                                                $(act).find('.check-act').checked = false;
                                                
                                            } else {
                                                sAlert(`<h5>刪除失敗，請稍後再試</h5>`, 'error', 'OK');
                                            }
                                            activityList.checkAvailability();       
                                        });

                                    }

                                    deleteNews(res);
                            
                                    if(success_arr.length == 0){   
                                        sAlert(`<h5>尚有會員預約場次的活動無法刪除</h5>`, 'warning', 'OK');
                                    }else{
                                        if(fail_arr.length != 0){
                                            sAlert(`<h5>已成功刪除 ${success_arr.length} 個活動，<br>有 ${fail_arr.length} 個活動尚有會員預約的場次，<br>因此無法刪除</h5>`, 'warning', 'OK');
                                        }else{
                                            sAlert(`<h5>已成功刪除 ${success_arr.length} 個活動！</h5>`, 'success', 'OK');
                                        }
                                    }
   
                                });

                            });

                            checkbox.forEach(function(box){
                                if (box.checked){
                                    box.checked = false;
                                }
                            });  
                        }

                    });
                }
            }else{
                sAlert(`<h5>您尚未勾選任何活動</h5>`, 'warning', 'OK');
            }
        },
        // ==== 顯示已上架按鈕切換 ====
        switchShow(){
            let activity_li = document.querySelectorAll(".actList");
            let switch_button = document.querySelector(".show-switch-btn");
            if ( switch_button.checked ){
                activity_li.forEach(function(li){
                    li.style.display = 'flex';
                })
            }else{
                activity_li.forEach(function(li){
                    if (li.classList.contains("-off")){
                        li.style.display = 'none';
                    }
                })
            }
        },
        // ==== 修改按鈕 ====
        modifyActivity(e){
            let targetId = $(e.target).closest('li').data('actid');
            location.href = `./back_activity_modify.html?activity_id=${targetId}`;
        },
        // ==== 已報名會員按鈕 ====
        signedMembers(e){
            // 開啟彈窗
            let name = $(e.target).closest(".act-content").find(".name").html();
            $("h5.o-activity-title").html(name);
            $('.act-member-overlay').addClass('-on');
            $('.act-mask').addClass('-on');
            let activity_li = e.target.closest(".act-content");
            let all_time = activity_li.querySelectorAll(".activity-time");
            let overlay_time = document.querySelectorAll(".o-time");
            for(let i = 0; i < all_time.length; i++){
                overlay_time[i].innerHTML = all_time[i].innerHTML;
            };
            let id = $(e.target).closest('.actList').data('actid');
            this.activityId = id;

            fetch('./php/activity_signed_members.php', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {activityId: id, }
                ),
            })
            .then(res => res.json())
            .then(res => {
                if(res.length == 0){
                    this.members = [];
                    console.log('nobody');
                    $('.nobody').html('此活動目前無人報名');
                }else{
                    this.members = [];
                    $('span.capacity').html(res[0].OPACITY);
                    $('.nobody').html('請選擇日期及場次時間');
                }        
            })
            
        },
        selectDate(){
            fetch('./php/activity_signed_members.php', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {activityId: this.activityId, }
                ),
            })
            .then(res => res.json())
            .then(res => {
                if(res.length == 0){
                    this.members = [];
                    console.log('nobody');
                    $('.nobody').html('此日期目前無人報名');
                }else{
                    this.members = [];
                    if( this.overlay.session != '選擇場次時間'){
                        activityList.selectTime();
                    }else{
                        $('.nobody').html('請選擇場次時間');
                    }
                }        
            })
        },
        selectTime(){
            let selectStart = (this.overlay.session).slice(0, 5);
            let selectDate = this.overlay.date;
            fetch('./php/activity_signed_members.php', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {activityId: this.activityId, }
                ),
            })
            .then(res => res.json())
            .then(res => {
                if(res.length == 0){
                    this.members = [];
                    $('.nobody').html('此場次目前無人報名');
                }else{
                    let result = [];
                    res.forEach(function(data){
                        let memberStart = (data.SESSION).slice(0, 5);
                        // console.log(memberStart);
                        // console.log(selectStart);
                        // console.log(data.DATE);
                        if (data.DATE == selectDate && memberStart == selectStart){
                            result.push(data);  
                        }
                    });
                    // console.log(result);
                    if (result.length != 0){
                        $('.nobody').html('');
                        this.members = result;
                        $('span.capacity').html(this.members[0].OPACITY);
                    }else{
                        if( this.overlay.date == '選擇日期'){
                            $('.nobody').html('請選擇日期');
                        }else{
                            $('.nobody').html('此場次目前無人報名');
                            this.members = [];
                        }
                        
                        // $('span.capacity').html('0');
                    }
                    
                }
                
            })
        },
        // ==== 關閉彈窗 ====
        closeOverlay(){
            $('.act-member-overlay').removeClass('-on');
            $('.act-mask').removeClass('-on');
            this.members = [];
            $('span.capacity').html('0');
            this.overlay.date = '選擇日期';
            this.overlay.session = '選擇場次時間';

        },  
    },
    computed: {
        total(){
            let count = 0;

            this.members.forEach(function(data){
                count += parseInt (data.ATTENDANCE);
            });
            return count;
        },
    },
});



