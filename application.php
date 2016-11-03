<!DOCTYPE html>
<html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">
<link rel="stylesheet" href="http://www.w3schools.com/lib/w3-theme-black.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<title>Elsevier Assignment></title>
<body>

<!-- Side Navigation -->
<nav class="w3-sidenav w3-white w3-card-2 w3-animate-left" style="display:none" id="mySidenav">
  <h1 class="w3-xxxlarge w3-text-teal">Side Navigation</h1>
  <a href="javascript:void(0)" onclick="w3_close()" class="w3-closenav w3-xxxlarge w3-text-theme">Hide Menu<i class="fa fa-remove"></i></a>
  <a href="javascript:void(0)">List Titles</a>
  <a href="javascript:void(0)">Search Titles</a>

</nav>

<!-- Header -->
<header class="w3-container w3-theme w3-padding" id="myHeader">
  <i onclick="w3_open()" class="fa fa-bars w3-xlarge w3-opennav"></i>
  <div class="w3-center">
  <h4>Application Assignment</h4>
  <h1 class="w3-xxxlarge w3-animate-bottom">Elsevier</h1>
    <div class="w3-padding-32">
      <button id="listButton" class="w3-btn w3-xlarge w3-dark-grey w3-hover-light-grey" style="font-weight:900;">List All Titles</button>
      <button class="w3-btn w3-xlarge w3-dark-grey w3-hover-light-grey" style="font-weight:900;">Search Title</button>
    </div>
  </div>
</header>

<section id="results">


</section>
<?php
echo 'Test Working <br /><br />';

// Grab the latest product list:
$SRC = "./example.json";
$JSON = file_get_contents($SRC);

// Button to list all titles.

// Create the objects required.
echo "
  <script>
    var productJSON = $JSON;
  //  var productObj = $.parseJSON(productJSON);
  </script>
  ";

 ?>
<script src="./application.js"></script>

</body>
</html>
