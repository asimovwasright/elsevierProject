/*
 * This is the main JavaScript for
 * handling all user interactions required
 * by the application. I have left big
 * gaps between blocks to help you
 * identify the code more transparently.
 * I also left good comments and tried to
 * write in a self documenting, semantic way.
 */




 // This function set will handle listing all of the titles when called.

 $("#listButton").click(function()
 {
   // Scroll to the right spot, esspecially for mobiles.
   $('html, body').animate({
     scrollTop: $("#results").offset().top
   }, 1000);
   // Clear out old results, and place the loading GIF.
   $("#results .list span").html('<img id="loadingIMGlist" src="resources/loading.gif"/><br />');
   // Show the list result box:
   $("#results .search").hide();
   $("#results .list").show();
   var promise = $.ajax({type:'GET', url: 'application.php?fn=ALL', success: function(response)
   {
    var received = JSON.parse(response); // See application.php to understand the JSON response.
    if (received[0] == "success")
    {
      $('#results .list span').html(function()
      {
        for (i=0;i<received[1].length;i++)
        {
          $("#results .list span").append("<div onclick='quickLookup(\""+received[1][i]+"\")' class='potential fontMedium'>"+received[1][i]+"</div>");
        }
      });
    }
    else
    {
      $('#results .list span').html("<span style='color: #75070D;'>Sorry, we could not find the list.<br /><br />Reason: "+received[0]+"</span><br /><br />");
    }
    }});
    // Done loading, remove gif.
    promise.done(function()
    {
      $('#loadingIMGlist').hide()
    });
 });









 // This function set handles all aspects of the search form.

 $("#searchButton").click(function()
 {
   // Scroll to the right spot, esspecially for mobiles.
   $('html, body').animate({
     scrollTop: $("#results").offset().top
   }, 1000);
   $("#results .list").hide();
   $("#results .search").show();
 });

 // This is the script to handle searches.
 var stagger = false; // Avoid event flooding and accidental double clicks by adding a stagger.
 $("#searchSubmit").click(function()
 {
   if (!stagger)
   {
     stagger = true; // Stagger any new calls until complete.
     // Hide the button for better UX
     $("#searchSubmit").css('opacity','0');
     // Clear out old results, replace with the loading GIF.
     $("#results .search span").html('<img id="loadingIMGsearch" src="resources/loading.gif"/>');
     // Make the AJAX call to application.php, and set a promise to know for sure when it's complete. (Asynchonous)
     var promise = $.ajax({type:'POST', url: 'application.php?fn=SEARCH', data:$('#searchTitles').serialize(), success: function(response)
      {
        var received = JSON.parse(response);
        if (received[0] == "success potentials")
        {
          /* At this point, the search application didn't find
           * a perfect match, so it has prepared an array of
           * potentials based on word matching between the
           * search parameter and the actual titles in the
           * data-store. Each potential is an array with two
           * indexes:
           *  [0]:The number of matched words found (the higher, the better)
           *  [1]:The partially matched Title.
           * With this info, we can build a list of likely
           * candidates to offer the user, in order of relevance.
           */

          $('#results .search span').html(function()
          {
            $("#results .search span").append("<h5>"+received[1][0]+"</h5>");
            for (i=1;i<received[1].length;i++)
            {
              $("#results .search span").append("<div data-relevance='"+received[1][i][0]+"' onclick='quickLookup(\""+received[1][i][1]+"\")' class='potential fontMedium'>"+received[1][i][1]+"</div>");
            }
          });
          // Call sorting function:
          sort();
        }
        else if (received[0] == "success match")
        {
          /* The search application returned a perfect match on title.
           * At this point, output (received[1]) will contain
           * the object covering all available extra
           * information about this title in the following format:
           * Obj-Property will be the label for the information, and
           * Obj-Propert:Value will be the title specific information
           * under said label, potentially another object.
           */
           $("#results .search span").append("<h4>Product Details</h4><div class='productTitle fontBig'>"+received[1][0].Title.TitleText+"</div>");
           $("#results .search span").append(loopArray(received[1][0]));
           // This sub-function will allow expanding deeper into the tree of product details.
           $('.more').click(function()
           {
             if ($(this).next().is(':visible'))
             {
               $(this).next().hide();
             }
             else
             {
               $(this).next().show();
             }
           });


          /* This is a self-expanding loop that will loop through
           * every object within the given title's parent object, and finally
           * return a UL that recursivley represents all available
           * data stored within the same JSON tree as the matching title.
           */
           function loopArray(obj)
           {
             var out = '<ul>';
             $.each(obj, function(key,value)
             {
               if (typeof value == 'object')
               {
                 out += "<li><span class='productKey fontSmall more'>"+key+"</span> &#8628;"+loopArray(obj[key])+"</li>";
               }
               else
               {
                 out += "<li><span class='productKey fontSmall'>"+key+"</span><span class='productValue fontMedium'>"+value+"</span></li>";
               }
             });
             out += "</ul>";
             return out;
           }
        }
        else // There was not match, and no potentials. In this case, the recieved[0] will be an explanation.
        {
          $('#results .search span').html("<span style='color: #75070D;'>Sorry, your search returned nothing at all.<br /><br /><strong>"+received[0]+"</strong></span><br /><br />");
        }
      }});
      // Done loading, remove gif.
      promise.done(function()
      {
        $('#loadingIMGsearch').hide()
      });
      setTimeout(function() // Reverse the stagger to allow a new search.
      {
        stagger = false;
        $("#searchSubmit").html('Go!');
        $("#searchSubmit").css('opacity','1');
      },1000);
    }
 });



 // Prevent the default action on enter key press, and attach the submit button instead.
 $('#searchTitles').on('keyup keypress', function(e) {
   var keyCode = e.keyCode || e.which;
   if (keyCode === 13) {
     e.preventDefault();
     $("#searchSubmit").click();
   }
 });


 // These two functions will sort the potential search results in order or relevance.
 function sort()
 {
   var sortedDivs = $("#results .search span").find("div").toArray().sort(sorter);
   $.each(sortedDivs, function (index, value) {
       $("#results .search span").append(value);
   });
 }
 function sorter(a, b) {
   return b.getAttribute('data-relevance') - a.getAttribute('data-relevance');
 }


 // This function allows a quick lookup from the list of titles.
 function quickLookup(title)
 {
   // Where title will be the search parameter.
   $("#searchButton").click();
   $('#searchTitles input').val(title);
   $("#searchSubmit").click();
 }
