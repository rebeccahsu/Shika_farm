<?php
    include ("./connection.php");
    
    $body = json_decode(file_get_contents("php://input"), true);
    
    $sql = 'select * from ACTIVITY where ID = :id';

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(":id", $body["id"]);
    $stmt->execute();
    $activity = $stmt->fetchAll();
    
    echo json_encode($activity);
?>