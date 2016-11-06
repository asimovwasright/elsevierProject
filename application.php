<?php

/*
 * This script will be called async by application.js
 * when a user chooses to list the titles or search a title.
 * All functions will return data in JSON format.
 */

// Which operation is requested:
/*
 * Either "ALL" for listing all titles, or "SEARCH",
 * in which case search parameter will be in POST data as "searchParam".
 */

isset($_GET['fn']) && $FN = $_GET['fn'];
isset($_POST['searchParam']) && $PARAM = $_POST['searchParam'];

if (empty($FN))
{
  echo "Sorry, this program expects a url parameter 'fn' to be filled with either 'SEARCH' or 'ALL'" ;
  return false;
}

// Grab the latest product list:
$SOURCE = file_get_contents("./example.json");
$DATA = json_decode($SOURCE, true);

// Initialise output data vars:
$flag = 'Something Went Wrong!';
$output = array();

/*
 * For the record, in production I wouldn´t place the JSON in the
 * puplic domain, and I would use a streaming parser, since the JSON
 * would most likely be a lot bigger than the provided example.
 */

if ($FN == "ALL") // Loop through the data to pull the titles into the output array.
{
  foreach ($DATA['worksById'] as $key => $value)
  {
    array_push($output, $value['Title']['TitleText']);
  }
  if (count($output) >= 1)
  {
    $flag = 'success';
  }
}
else if ($FN == "SEARCH")
{
  $flag = "potential";
  array_push($output, "<i>Perhaps you are looking for:</i><br /><br />");
  foreach ($DATA['worksById'] as $key => $value)
  {
    if (empty($PARAM))
    {
      $flag = "You forgot to specify a Title to search!";
      break;
    }
    if (strcasecmp($value['Title']['TitleText'], $PARAM )==0)
    {
      // This is the search title matched
      unset($output); // Wipe the potentials, we have an actual match.
      $output = array(); // Re-initialize;

      // Prepare the new array, fill it with matching title's parent array.
      array_push($output, $value);
      $flag = "success match";
      break;
    }
    else // The title does not match, but let's see if we can add it to a potentials list?
    {
      $sim = compareStrings(strtolower($PARAM), strtolower($value['Title']['TitleText']));
      if ($sim >= "1") // If there are 1 or more matching words between the itteration's title and search parameter.
      {
        array_push($output, array($sim,$value['Title']['TitleText'])); // Add it to the list of potntials.
      }
    }
  }
  if ($flag == 'potential') // No actual matches were found, but there was a search parameter.
  {
    if (count($output) == 1) // Then we know this is not a real potential match, only the prepended "Perhaps you are looking for?" text.
    {
      $flag = "Couldn't find similar Titles.";
    }
    else // There was at least one similar title found.
    {
      $flag = "success potentials";
    }
  }
}

/*
 * Function to compare the search param with each title,
 * to offer a suggestions box in case no direct match is found.
 * Roughly adapted from: http://stackoverflow.com/a/16521079/3749769
 */

 function compareStrings($s1, $s2)
 {
     //one is empty, so no result
     if (strlen($s1)==0 || strlen($s2)==0)
     {
         return 0;
     }

     //replace none alphanumeric characters

     $s1clean = preg_replace("/[^A-Za-z0-9 ]/", '', $s1);
     $s2clean = preg_replace("/[^A-Za-z0-9 ]/", '', $s2);

     //remove double spaces
     while (strpos($s1clean, "  ")!==false)
     {
         $s1clean = str_replace("  ", " ", $s1clean);
     }
     while (strpos($s2clean, "  ")!==false)
     {
         $s2clean = str_replace("  ", " ", $s2clean);
     }

     //create arrays
     $ar1 = explode(" ",$s1clean); // ar1 is always the search parameter.
     $ar2 = explode(" ",$s2clean); // ar2 is always the potential title being matched against.

     $matches = 0;

     //find matching words
     foreach($ar1 as $word)
     {
       foreach ($ar2 as $compare)
       {
         if ((strpos($word, $compare) !== false) || (strpos($compare, $word) !== false))
         {
           $matches++;
         }
       }

     }
     return $matches;
 }


$array=array
(
  "$flag",
  $output
);


$return = json_encode($array);
echo $return;

?>
