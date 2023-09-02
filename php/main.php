<?php

  if (isset($_GET['page'])){
    $page = $_GET['page'];
    if ($page == "login"){

      echo file_get_contents("../html/login.html");

    } elseif ($page == "main" || $page == "profil" || $page == "admin"){


      if($page == "main"){

        echo file_get_contents("../html/main.html");
        
      } elseif($page == "profil"){

        echo file_get_contents("../html/profil.html");

      } elseif($page == "admin"){

        echo file_get_contents("../html/admin.html");

      }

    }
  } else {
    header("Location: http://localhost:8000/php/main.php?page=login ");
  }

?>
