<?php 
  function validateUsername($username) {
      if(strlen($username) <= 0) {
          return "errBlank";
      }
      else if(strpos($username, " ") > 0) {
          return "errSpace";
      } 
      else if(strlen($username) < 8) {
          return "errMin";
      }
      return "errNo";
  }
  
  function validatePass($password) {
      if(strlen($password) <= 0) {
          return "errBlank";
      }
      else if(strpos($password, " ") > 0) {
          return "errSpace";
      } 
      else if(strlen($password) < 8) {
          return "errMin";
      }
      return "errNo";
  }
  
  function validateEmail($email) {
      if(strlen($email) <= 0) {
          return "errBlank";
      }
      else if(strpos($email, " ") > 0) {
          return "errSpace";
      } 
      else if(strlen($email) < 8) {
          return "errMin";
      }
      else if(!isRightEmailFormat($email))
         return "errEmail";
       
      return "errNo";
  }

  function validateBirthday($birthday) {
      if(strlen($birthday) <= 0) {
          return "errBlank";
      }
      else if(strpos($birthday, " ") > 0) {
          return "errSpace";
      } 
      else if(strlen($birthday) < 8) {
          return "errMin";
      }
      return "errNo";
  }

  function isRightEmailFormat($email) {
      $emailFormat = preg_match("/^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/",$email);
      if(!$emailFormat) return false;
      return true;    
  }

 
	$username_db = "htqhtqhtq";
	$password_db = "htqhtqhtq";
	$username = $_GET["username"];
	$password = $_GET["pass"];
	$email = $_GET["email"];
	$birthday = $_GET["birthday"];
  $isSubmited = true;
  $isUsernameExist = false;
  
  $username = trim($username);
  $password = trim($password);
  $email = trim($email);
  $birthday = trim($birthday);

  $server_username = "root";
  $server_password = "";
  $server_host = "localhost";
  $database = 'quyen';
  
  // Validate user data
  $usernameErr = validateUsername($username);
  $passwordErr = validatePass($password);
  $emailErr = validateEmail($email);
  $birthdayErr = validateBirthday($birthday);
  
  if($usernameErr != "errNo" || $passwordErr != "errNo" || $emailErr != "errNo" || $birthdayErr != "errNo") {
      $isSubmited = false; 
  }

  // Check username is already existed in database
  $conn = mysqli_connect($server_host,$server_username,$server_password,$database) or die("không thể kết nối tới database");
  mysqli_query($conn,"SET NAMES 'UTF8'");
  
  $sql="select * from users where username='$username'";
  $kt = mysqli_query($conn, $sql);
  if(mysqli_num_rows($kt)  > 0){
      $isUsernameExist = true; 
  }else{
      $sql = "INSERT INTO `users` (`username`, `password`, `email`, `birthday`) VALUES ('$username', '$password', '$email', '$birthday');";
      mysqli_query($conn,$sql);
  }   
  
  // Return confirm infomation to client side
  $dataErr = array($isSubmited, $isUsernameExist, $usernameErr, $passwordErr, $emailErr, $birthdayErr);
  echo '{"js_arr":'.json_encode($dataErr).'}';
  exit();  
?>