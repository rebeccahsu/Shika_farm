// $('#city')

$.ajax({
	url: "../JSON/city.json",
	method: "GET",
    success: function (res) {
      function state(a) {
        for (let i = 0; i < res[a].districts.length; i++) {
          //console.log(res[a].districts[i].name)
          $("#area").append(
            "<option value=" +
              res[a].districts[i].name +
              ">" +
              res[a].districts[i].name +
              "</option>"
          );
        }
      }
      // 初始畫面的縣市呈現
      $.each(res, function (index, ele) {
        // console.log(index);
        $("#city").append(
          "<option value=" + index + ">" + res[index].name + "</option>"
        );
      });
      // 改變縣市
      $("#city").on("change", function () {
        //console.log($(this).children("option:selected").val());
        var num = $(this).children("option:selected").val();
        $("#area").find("option").remove();
        state(num); //num 是縣市的索引值  state是縣市區域的函式
      });
    }
});
	// success: function (res) {
	// 	// console.log(res);
	// 	for (let i = 0; i < res.length; i++) {
	// 		$("#city").append(`
    //             <option value="${res[i].name}">${res[i].name}</option>
    //         `);

	// 		$("select#city").on("change", function () {
	// 			for (let j = 0; j < res[i].districts.length; j++) {
                    
	// 				let city = $('#city :selected').val();
    
                   
                   
	// 				if(city == res[i].name) {
    //                     console.log(res[j].districts)

	// 				    $('#area').append(`
	// 				    <option>${res[j].districts.name}</option>
	// 				    `)
	// 				}
	// 			}
	// 		});
	// 	}
		// $("select#city").on("change", function () {
		// 	console.log(res);
		//     for (let i = 0; i < res.length; i++) {

		//     }

		// 	// for (let i = 0; i < res.length; i++) {
		// 	// 	for (let j = 0; j < res[i].length; j++) {
		// 	// 		$("#area").append(`
		//     //             <option>${res[i][j].name}</option>
		//     //         `);
		// 	// 	}
// 		// 	// }
// 		// });
// 	},
// });


var el =document.querySelector('.ch_pw');
el.addEventListener('click' ,function(e){
e.preventDefault();
console.log('test');
});