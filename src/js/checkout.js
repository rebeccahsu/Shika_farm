new Vue({
	el: "#step",
	data() {
		return {
			products: [],
			freight: 60,
			//==== 信用卡&貨到付款選項 ====
			payType: "card",
			//===== 步驟 =====
			step: "A",
			// ===== 付款 & 收件人資訊 =====
			userInfo: {
				name: "",
				phone: "",
				address: "",
			},
			cardInfo:{
				cardNum: {},
				cardName:"",
				cadrDate:{},
			},
		};
	},
	methods: {
		// 執行add這個function, index->陣列裡的第幾個物件 n->加1減1的值
		add(index, n) {
			// 如果按下加減後等於0
			if (this.products[index].count + n == 0) {
				return; // 就結束顯示預設數字 1
			}
			this.products[index].count += n; // 不然就可以做加減
		},
		//點擊垃圾桶 刪除
		del(index) {
			this.products.splice(index, 1);
			sessionStorage.setItem("products", JSON.stringify(this.products));
		},
		// 提交訂單
		sendOrder() {
			// 0.檢查收款人資訊是否填寫完整
			// console.log('aaa');
			if(this.userInfo.name == ""){
				alert('請輸入收件人姓名');
			}
			if(this.userInfo.phone.match(/^[0-9]{10}$/g) == null){
				alert('請輸入正確收件人電話');
			}
			if(this.userInfo.address == ""){
				alert('請輸入正確收件人地址');
			}
			// 1.傳送訂單詳細資訊給後台
			//  - 商品詳細資訊
			//  - 付款方式資訊
			// 2. 後台判斷結果
			// - 交易是否成功結果
			// - 訂單編號
			// 3. 交易成功後將locoalstroage(購物車)清空
		},
		goStepB() {
			if (this.products.length > 0) {
				this.step = "B";
			} else {
				alert("購物車是空的呦 !!");
			}
		},
		creditdown() {
			let cards = document.getElementsByClassName("payId");
			for (let i = 0; i < cards.length; i++) {
				// ----- 跨欄位刪除 & 只能輸入數字及刪除鍵 ---------//
				cards[i].addEventListener("keydown", function (e) {
					console.log(e.which); //e.which轉換成
					// 除了數字0-9及刪除鍵外，不得輸入其他字
					if (
						(e.which >= 48 && e.which <= 57) ||
						e.which == 8 ||
						(e.which >= 96 && e.which <= 105)
					) {
						// 刪除鍵可以跨欄位刪除
						if (e.target.value.length == 0 && e.which == 8) {
							let previous_el = this.previousElementSibling;
							previous_el.focus();
						}
					} else {
						e.preventDefault();
					}
				});
			}
		},
		creditup() {
			let cards = document.getElementsByClassName("payId");
			console.log("aaa");
			for (let i = 0; i < cards.length; i++) {
				// ----- 跨欄位輸入 & 中文字不能輸入 ------------//
				cards[i].addEventListener("keyup", function (e) {
					// 解決中文字可以輸入的情形
					// 使用正規式：所有非數字字元\D，g所有
					let str = e.target.value.replace(/\D/g, "");
					console.log(str);
					e.target.value = str; //將中文輸入值用空字串
					// 希望使用者可以一直輸入下去
					// console.log(str.length);a
					if (str.length == 4) {
						let next_el = this.nextElementSibling;
						if (next_el != null) {
							next_el.focus();
						}
					}
				});
			}
		},
		same() {
			fetch("./php/member.php", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: 19 }),
			})
			.then((res) => res.json())
			.then((res) => {
				// console.log(res);
				// console.log(country)
				// console.log(district)
				
				// name.value == res[0].NAME;
				// $("#name").val(res[0].NAME); //抓到資料庫的姓名塞進收件人輸入框
				// $("#phone").val(res[0].PHONE); //抓到資料庫的電話塞進電話輸入框
				// $("#address").val(res[0].COUNTRY + res[0].DISTRICT + res[0].STREET); //抓到資料庫的城市、區域、地址塞進地址輸入框
				// $('#address').val(`${res[0].COUNTRY}${res[0].DISTRICT}${res[0].STREET}`);
				if(this.userInfo.name == "" ||this.userInfo.phone == "" || this.userInfo.address == ""){
					this.userInfo.name = res[0].NAME;
					this.userInfo.phone = res[0].PHONE;
					this.userInfo.address = res[0].COUNTRY + res[0].DISTRICT + res[0].STREET;
				}else{
					this.userInfo.name = "";
					this.userInfo.phone = "";
					this.userInfo.address = "";
				}
				
			});
		},
	},
	// 進入頁面就要有初始值就要用created
	created() {
		// 1.取出localStorage的資料, 字串轉成物件 // ??判斷是否為null如果是就用空陣列
		let cart = JSON.parse(sessionStorage.getItem("products")) ?? [];
		// 2.把資料放入data裡的products
		// console.log(cart);
		this.products = cart;
	},
	computed: {
		// 總計 執行function
		sumTotal: function () {
			//預設 total=0
			let total = 0;
			// vue的products陣列執行foreach迴圈

			// console.log(this.freight);
			this.products.forEach((el) => {
				//陣列裡的物件執行這個涵式
				// 總計 = (物件的價格 * 物件的數量) + 運費  + el.freight
				total += el.price * el.count;
			});
			//把值傳回sumTotal這個變數
			return total + this.freight;
		},
		sumCount: function () {
			let count = 0;
			this.products.forEach((el) => {
				count = count + el.count;
			});
			return count;
		},
	},
});
