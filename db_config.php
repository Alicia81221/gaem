<?php
$db_host = 'localhost';
$db_name = 'users';
$db_username = 'root';
$db_password = '';
$dsn = "mysql:host=$db_host;dbname=$db_name";

try{
    $db_connection = new PDO($dsn,$db_username,$db_password);

}catch (Exception $e){
    echo "There was a failure";
}
if (!isset($_SESSION["email"])){
    header("Location: login.php");
    exit();
}
$username = $_SESSION["username"];
$viewer = "SELECT * FROM accounts WHERE user='$username'";
$row = $db_connection->query($viewer)->fetch();
if ($row['banned'] == 1){
    header("Location: login.php");
    exit();
}


?>