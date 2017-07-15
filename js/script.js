$(function(){

  $("#search-form").on("submit", function(){
    $("#loading-spinner-div").show();
    var param = $("#query-input").val();
    IOs.getSearch(param).done(function(data){
      UI.updateSearchResults(data);
    }).fail(function(error){
      console.log(error);
      $("#search-result-div").html(error.statusText);
    }).always(function(){
      $("#loading-spinner-div").hide();
    });
  });

  $("body").on("click", ".show-more-btn", function(){
    var $btn = $(this);
    var $container = $btn.closest(".result-div");
    $container.find(".description").show();
    $container.find(".brief").hide();
  });

  $("body").on("click", ".show-less-btn", function(){
    var $btn = $(this);
    var $container = $btn.closest(".result-div");
    $container.find(".brief").show();
    $container.find(".description").hide();
  });

});

var IOs = {
  getSearch(param){
    return $.ajax({
      method: "GET",
      url: "searchFor?q=" + param,
      dataType : "json"
    });
    /*var deferred = new $.Deferred();
    setTimeout(function(){deferred.resolve(sample)}, 5000);
    return deferred.promise();*/
  }
}

var UI = {
  updateSearchResults: function(data){
    var $resultsContainer = $("#search-result-div");
    $.each(data, function(_, item){
      if(item && item["_source"]){
        var $itemDiv = UI.createResultItem(item);
        $resultsContainer.append($itemDiv);
      } else {
          console.log("ERROR: Invalid item data structure");
      }
    });
  },
  createResultItem: function(item){
    var $template =  $("#hidden-result-template").clone();
    $template.attr("id", item["_source"]["Title"]).show();
    $template.find(".title").text(item["_source"]["Title"]);
    $template.find(".brief .text").text(String(item["_source"]["Description"]).substring(0, 100) + "...");
    $template.find(".description .text").text(item["_source"]["Description"].join("\n"));
    return $template;
  }
}
