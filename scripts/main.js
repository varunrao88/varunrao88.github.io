var CountryData = new Array();

var Country_continent_code = new Array();

var selectedCountries = new Array();
var selectedCountries_ESData = new Array();

d3.json('data/countrydata.json',function(e,d2){

  console.log(e);
  CountryData = d2;

  d3.json('/data/continent_data.json',function(e,d){
    Country_continent_code = d;
    proc_data();
  });
});

function proc_data(){

  // Add an index value into the above Array
  for(var i = 0 ; i < CountryData.length ; i++){
      CountryData[i].index_val = i;
  };

  var population = new Array();

  // Get the population into a separate Array
  CountryData.forEach(function(e){
      population.push(parseInt(e.Population.replace(/,/g,"")));
      var cc = Country_continent_code.filter(function(el){
        if (el.name == e["Country Name"]){
          return el;
        }
      });
      var obj = cc[0];
      if (typeof(obj) !== "undefined"){
        e.Continent = obj["continent"];
      }
  });

  // To get the colors for the circles to be displayed
  var sequentialScale = d3.scaleSequential()
    .domain([0, 7])
    .interpolator(d3.interpolateRainbow);

  var pop_range = d3.extent(population)

  var circle_size = d3.scaleLog().domain([pop_range[0],pop_range[1]]).range([2,10]);

  var window_width = $(window).width();
  var window_ht = $(window).height();

  $("#Page1").css({width: window_width , height : window_ht });
  $("#Page2").css({width: window_width , height : window_ht });
  $("#Page3").css({width: 4 * window_width , height : window_ht });
  $("#Page3Part1").css({width: window_width , height : window_ht });
  $("#Page3Part2").css({width: window_width , height : window_ht });
  $("#Page3Part3").css({width: window_width , height : window_ht });
  $("#Page3Part4").css({width: window_width , height : window_ht });


  $(".scroller").click(function(e) {
      e.preventDefault();
      var id = $(this).attr('href');
      // console.log(id);
      $('html,body').animate({
          scrollTop: $(id).offset().top},
          'slow');
  });

  $(".h_scroller").click(function(e){
    e.preventDefault();
    var id = $(this).attr('href');
    // console.log(id);
    $('html,body').animate({
        scrollLeft: $(id).offset().left},
        1000);
    e.preventDefault();
  })

  var margin = {top: 20, right: 20, bottom: 50, left: 70};
  var width =  0.6 * $(window).width() - margin.left - margin.right;
  var height = $(window).height() - margin.top - margin.bottom;

  var x_new = d3.scaleLinear()
                .domain([-5,100])
                .range([0,width]);

  var y_new = d3.scaleLinear()
                .domain([-5,100])
                .range([0,height]);

  var tooltip = d3.select("#tooltip");

  var ContMaster = {
    "Africa" : 0,
    // "Antarctica":1,
    "Asia":2,
    "Europe":3,
    "North America":4,
    "Oceania":5,
    "South America":6
  };

  var ContList = ["Africa","Asia","Europe","North America","Oceania","South America"];

  var sp = d3.select("#scatterplot")
    .attr("width",(width + margin.left + margin.right))
    .attr("height",(height + margin.top + margin.bottom))
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  sp.selectAll("circle")
    .data(CountryData)
    .enter().append("circle")
    .attr("r",function(d){ return circle_size(parseInt(d["Population"].replace(/,/g,""))) })
    .attr("cx",function(d) { return x_new(d[1980])  })
    .attr("cy",function(d) { return height - y_new(d[2014])  })
    // .attr("data-legend",function(d){ return d["Continent"] })
    .style("stroke",function(d,i){ return sequentialScale(ContMaster[d["Continent"]]) })
    .on("mouseover",function(d,i){
          var stroke_val = d3.select(this).style("stroke");
          d3.select(this).style("fill",stroke_val);

          var x = d3.mouse(this)[0] + 120;
          var y =  d3.mouse(this)[1];
          // var x = d3.event.pageX;
          // var y = d3.event.pageY;
          console.log(x + "," + y);
          //console.log("In");
          tooltip.style('opacity',0.7)
                 .style('left', x + 'px')
                 .style('top',  y + 'px')
                 .html(function(){

                    var str = "";
                    str = "Country Name : " + d['Country Name'];
                    str = str + "<br />";
                    str = str + "% 1980 : " + d[1980] + "<br />" ;
                    str = str + "% 2014 : " + d[2014] + "<br />" ;
                    str = str + "Continent : " + d["Continent"];
                    return str;

                 });
          // console.log(d3.mouse(this));
    })
    .on("mouseout",function(d,i){
      tooltip.style('opacity',0)
      d3.select(this).style("fill","none");
      console.log(d3.mouse(this));
      //console.log("Out");
    })
    .on("click",function(d,i){
      if(selectedCountries.indexOf(d['Country Name']) == -1){
        selectedCountries.push(d['Country Name']);
        generatelistonScreen();
      }
    })
    ;

  // For the legend
  var legend = d3.select("#scatterplot")
  .append("g")
  .attr("id","legend")
  .attr("width",100)
  .attr("height",100)
  .attr("transform","translate(100,30)");

  legend.append("text").html("Legend").style('font-weight','bold').style("font-size",'18px');

  legend.selectAll("rect")
  .data(ContList)
  .enter()
  .append("g")
  .append("rect")
  .attr("height",20)
  .attr("width",20)
  .style("fill",function(d,i){ return sequentialScale(ContMaster[d]) })
  .style("stroke",function(d,i){ return sequentialScale(ContMaster[d]) })
  .attr("y",function(d,i){ return i * 30 + 10 });

  // d3.select("#scatterplot #legend")

  var t = d3.transition()
      .duration(500)
      .ease(d3.easeLinear);


  d3.selectAll("#scatterplot g g").append("text").attr("y",function(d,i){ return 25 + ((i*30)) }).attr("x",function(d,i){ return 30}).text(function(d){return d});

  d3.selectAll("#scatterplot g g rect").on('mouseover',function(d,i){
    var selcont = d;
    // console.log("In" + d);
    var sel = d3.selectAll("circle").each(function(d1){
        if(d1["Continent"] != selcont){
          if(d3.active(this) == null){
            d3.select(this).transition(t).style("opacity","0.2").style("fill","none");
          }
          else{
            d3.select(this).interrupt();
            d3.select(this).transition(t).style("opacity","0.2").style("fill","none");
          }
        }
        else{
          if(d3.active(this) == null){
            d3.select(this).transition(t).style("opacity","1").style("fill",function(d,i){return sequentialScale(ContMaster[d["Continent"]])});
            // d3.select(this).style("fill",function(d,i){ console.log(); });
          }
          else{
            d3.select(this).interrupt();
            d3.select(this).transition(t).style("opacity","1").style("fill",function(d,i){return sequentialScale(ContMaster[d["Continent"]])});
          }
          //  d3.select(this).style("opacity","1");
        }
    });
  }).
  on('mouseout',function(d,i){
    var selcont = d;
    // console.log("Out" + d);
    var sel = d3.selectAll("circle").each(function(d1){
        if(d1["Continent"] != selcont){
          if(d3.active(this) == null){
            d3.select(this).transition(t).style("opacity","1");
            d3.selectAll("circle").style("fill","none");
          }
          else{
            d3.select(this).interrupt();
            d3.select(this).transition(t).style("opacity","1");
            d3.selectAll("circle").style("fill","none");
          }
        }

    });

  });
    sp.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x_new.nice()));

    sp.append("text")
       .attr("transform",
             "translate(" + (width/2) + " ," + (height + margin.top + 5) + ")")
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("% of Rural Population in 1980");

    var y_scale_axis = d3.scaleLinear()
                        .domain([100,-10])
                        .range([0,height]).nice();

    sp.append("g")
      .call(d3.axisLeft(y_scale_axis));

    sp.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("% of Rural Population in 204");

};

function generatelistonScreen(){
  console.log(selectedCountries);
  $("#selected_countries").html("");
  var html_ele = "";
  for(var i = 0 ; i < selectedCountries.length ; i++){
      html_ele = html_ele + "<button class='btn btn-info remove_click' style='margin-right:2px' country_name='" +selectedCountries[i] + "'>" + selectedCountries[i] + '&nbsp; <span class="glyphicon glyphicon-remove" style="color:red"></span></button>';
  }

  if(selectedCountries.length > 0){
    $("#ESIndicators").prop('disabled',false);
  }
  else{
    $("#ESIndicators").prop('disabled',true);
  }


  $("#selected_countries").html(html_ele);

}

$('#selected_countries').on('click','.remove_click',function(){
  var sel = $(this).attr('country_name');
  var ind = selectedCountries.indexOf(sel);

  selectedCountries.splice(ind,1);
  generatelistonScreen();
});

$('#ESIndicators').click(function () {

  console.log('Fetching Data');
  d3.json('data/document.json',function(e,dES){

    for(var i = 0; i < selectedCountries.length ; i++){
      var o = new Object();
      o = dES[selectedCountries[i]];
      selectedCountries_ESData[selectedCountries[i]] = o;
    }

    console.log(selectedCountries_ESData);
    show_SocioEcoData();


  });


});

function show_SocioEcoData(){
  $('html,body').animate({
      scrollTop: $("#Page3").offset().top},
      'slow');
}

$("#clickme").click(function () {

console.log(d3.selectAll("circle").filter(function(d) { return d.continent = "Asia" }))

});
