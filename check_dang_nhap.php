<?php
	$username_db = "htqhtqhtq";
	$password_db = "htqhtqhtq";
	$username = $_GET["username"];
	$password = $_GET["pass"];
 
  
	// Nếu thông tin đăng nhập chính xác, trả về giá trị là 1
	if ($username == $username_db || $password == $password_db) {
		echo 1;
		exit();
	}
 
	// Nếu thông tin đăng nhập sai, trả về giá trị là 0
	// echo 0;
  echo 0;
	exit();
?>