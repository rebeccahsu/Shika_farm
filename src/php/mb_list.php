<?php
     include ("./connection.php");

     //取得資料
     //透過php取得前端資料並解譯
     $body = json_decode(file_get_contents("php://input"), true);
     // 另新變數=資料內文
    //  $serch_value = $input_value['input_value'];
 
     $sql = "SELECT * , (select count(*) from TFD105_G6.ORDER_DETAIL where TFD105_G6.ORDER.ID = TFD105_G6.ORDER_DETAIL.ORDER_ID)as quantity FROM TFD105_G6.ORDER where MEMBER_ID = :id;";
     $stmt = $pdo->prepare($sql);
     $stmt->bindValue(":id", $body["memberID"]);
     $stmt->execute();
     $result = $stmt->fetchAll(); //把結果放在二為陣列裡
     
     echo json_encode($result);
    //  $resultCount = $stmt->rowCount();
    
?>