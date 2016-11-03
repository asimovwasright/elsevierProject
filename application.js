/*
 * This is the main script for
 * handling all functions required
 * by application.
 */

 $("#listButton").click(function()
 {
   // Look through the JSON and pull all Titles.
   $.each(productJSON.worksById, function(key,value)
   {
     //console.log(key+" : "+value);
     $("body").append(productJSON.worksById[key].Title.TitleText+"<br/>");
   });
 });
