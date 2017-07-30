var CountryData = new Array();

var Country_continent_code = new Array();

var selectedCountries = new Array();
var selectedCountries_ESData = new Object();

var load_state =
{
  "Page3Part1" : false,
  "Page3Part2" : false,
  "Page3Part3" : false,
  "Page3Part4" : false
}

d3.json('data/countrydata.json',function(e,d2){

  // console.log(e);
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

      if(id.indexOf("Page3") > -1){
        $(".fixed_horizontal").css('display','initial');
      }
      else{
        $(".fixed_horizontal").css('display','none');
      }

      if(id == "#Page1"){
        $("#Mark1").css('background-color','red');
        $("#Mark2").css('background-color','black');
      }
      else if(id == "#Page2"){
        $("#Mark1").css('background-color','black');
        $("#Mark2").css('background-color','red');
      }
      else{
        $("#Mark1").css('background-color','black');
        $("#Mark2").css('background-color','black');
      }


      $('html,body').animate({
          scrollTop: $(id).offset().top},
          'slow');

      $('html,body').animate({
          scrollLeft: '5px'},
          'slow');
  });

  function change_sub_mark(id){

    $("#SubMark1").css('background-color','black');
    $("#SubMark2").css('background-color','black');
    $("#SubMark3").css('background-color','black');
    $("#SubMark4").css('background-color','black');

    $(id).css('background-color','red');

  }

  $(".h_scroller").click(function(e){
    e.preventDefault();
    var id = $(this).attr('href');


    if (id == "#Page3Part1"){
      // Life Expectancy
      change_sub_mark("#SubMark1");
      $('html,body').animate({
          scrollLeft: $("#Page3Part1").offset().left},
          'slow');

      $(".fixed_horizontal").css('display','initial');
    }
    else if(id == "#Page3Part2"){
      // Infant Mortality
      //show_SocioEcoData_IM();
      change_sub_mark("#SubMark2");
      $('html,body').animate({
          scrollLeft: $("#Page3Part2").offset().left},
          'slow');

      $(".fixed_horizontal").css('display','initial');
    }
    else if(id == "#Page3Part3"){
      // Sanitation
      // show_SocioEcoData_SAN();
      change_sub_mark("#SubMark3");
      $('html,body').animate({
          scrollLeft: $("#Page3Part3").offset().left},
          'slow');

      $(".fixed_horizontal").css('display','initial');
    }
    else if(id == "#Page3Part4"){
      // Economic Indicator - GNI
      // show_SocioEcoData_GNI();
      change_sub_mark("#SubMark4");
      $('html,body').animate({
          scrollLeft: $("#Page3Part4").offset().left},
          'slow');

      $(".fixed_horizontal").css('display','initial');
    }

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

  sp.append("text").attr("x","10").attr("y",10).style("fill","rgb(105, 49, 132)").style("transform","scale(1.2)").text("Overview of the Data : Change in % of Rural Population between 1980 to 2014");

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
          // console.log(x + "," + y);
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
    })
    .on("click",function(d,i){
      if(selectedCountries.indexOf(d['Country Name']) == -1){
        selectedCountries.push(d['Country Name']);
        generatelistonScreen();
      }
    })
    ;

  // For the legend
  var l_w = 0.6 * $(window).width() - margin.right;

  var l_h = 0.7 * $(window).height();

  d3.select("#scatterplot").attr("width", width + 200 );

  var legend = d3.select("#scatterplot")
  .append("g")
  .attr("id","legend")
  .attr("width",100)
  .attr("height",100)
  .attr("transform","translate(" + l_w + "," + l_h + " )");

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
      .text("% of Rural Population in 2004");

};

$("#addCountriesToList").click(function(){
  var val = $("#sel1").find(":selected").text();
  if(val == "BRICS (Brazil, Russia, India, China, South Africa)"){
    selectedCountries = [];
    selectedCountries.push("India");
    selectedCountries.push("Brazil");
    selectedCountries.push("Russia");
    selectedCountries.push("China");
    selectedCountries.push("South Africa");
    generatelistonScreen();
  }
  else if (val == "Highly Developed (USA, Canada, Germany, Australia, Denmark)"){
    selectedCountries = [];
    selectedCountries.push("United States");
    selectedCountries.push("Canada");
    selectedCountries.push("Germany");
    selectedCountries.push("Australia");
    selectedCountries.push("Denmark");
    generatelistonScreen();
  }
  else if (val == "Least Developed (Afghanistan, Rwanda, Niger, Yemen, Bangladesh)") {
    selectedCountries = [];
    selectedCountries.push("Afghanistan");
    selectedCountries.push("Rwanda");
    selectedCountries.push("Niger");
    selectedCountries.push("Yemen");
    selectedCountries.push("Bangladesh");
    generatelistonScreen();
  }


});

function generatelistonScreen(){
  // console.log(selectedCountries);
  $("#selected_countries").html("");
  var html_ele = "";
  for(var i = 0 ; i < selectedCountries.length ; i++){
      html_ele = html_ele + "<button class='btn btn-info remove_click' style='margin-right:2px; margin-top:2px' country_name='" +selectedCountries[i] + "'>" + selectedCountries[i] + '&nbsp; <span class="glyphicon glyphicon-remove" style="color:red"></span></button>';
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

  // console.log('Fetching Data');
  selectedCountries_ESData = {};

  d3.json('data/document.json',function(e,dES){

    if (e){
      console.log(e);
    }
    else{
    for(var i = 0; i < selectedCountries.length ; i++){
      var o = new Object();
      o = dES[selectedCountries[i]];
      selectedCountries_ESData[selectedCountries[i]] = o;
    }
    selectedCountries_ESData['High Income'] = dES['High income'];
    selectedCountries_ESData['Low Income'] = dES['Low income'];
    selectedCountries_ESData['Middle Income'] = dES['Middle income'];

    $("#Mark1").css('background-color','black');
    $("#Mark2").css('background-color','black');

    // console.log(selectedCountries_ESData);
    show_SocioEcoData_LE();

    show_SocioEcoData_IM();

    show_SocioEcoData_SAN();

    show_SocioEcoData_GNI();

    $('html,body').animate({
        scrollTop: $("#Page3").offset().top},
        'slow');

    $(".fixed_horizontal").css('display','initial');

  };

  });


});

function show_SocioEcoData_LE(){

  d3.selectAll("#Soc_LE_Line > *").remove();

  var margin = {top: 20, right: 20, bottom: 50, left: 70};
  var width =  0.6 * $(window).width() - margin.left - margin.right;
  var height = $(window).height() - margin.top - margin.bottom;

  var line_graph = d3.select("#Soc_LE_Line")
    .attr("width",(width + margin.left + margin.right))
    .attr("height",(height + margin.top + margin.bottom))
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  d3.select("#Soc_LE_Line").attr("width", width + 200 );
  var l_w = 0.6 * $(window).width();

  var l_h = 0.8 * $(window).height();

  var legend = d3.select("#Soc_LE_Line").append("g").attr("id","legend_le").attr("width",100).attr("height",100).attr("transform","translate(" + l_w + "," + l_h + " )");
  legend.append("text").html("Legend").style('font-weight','bold').style("font-size",'18px');



  var timeParser = d3.timeParse("%d-%m-%Y");
  var complete_list_country = new Array();
  var date_extent_array = new Array();
  var only_countries = new Array();

  $.each(selectedCountries_ESData, function(cname, value_object){
    var o = value_object.SOC_LE;
    var temp_array = new Array();
    only_countries.push(cname);
    $.each(o, function(k,v){
      var new_o = new Object();

      var temp_date = '01-01-' + k;

      new_o.cname = cname;
      new_o.date = timeParser(temp_date);
      new_o.val = +v;
      temp_array.push(new_o);
      date_extent_array.push(new_o.date);
    });

    complete_list_country.push(temp_array);
  })

  var colors = d3.scaleOrdinal(d3.schemeCategory10);

  legend.selectAll("rect").data(only_countries).enter().append("g").append("rect")
        .attr("height","10")
        .attr("width","10")
        .style("fill",function(d){return colors(d)})
        .style("stroke",function(d){return colors(d)})
        .attr("y",function(d,i){ return i * 20 + 10 });

  d3.selectAll("#legend_le g")
    .data(only_countries)
    .append("text")
    .attr("y",function(d,i){ return 20 + ((i*20)) })
    .attr("x",function(d,i){ return 20})
    .text(function(d){ return d });

  console.log(complete_list_country);


  // UNCOMMENT HERE
  var extent_year = d3.extent(date_extent_array);
  // console.log(date_extent_array);
  // console.log(extent_year);
  var x = d3.scaleTime().range([0,width]).domain(extent_year);
  var y = d3.scaleLinear().range([height,0]).domain([0,100]);
  //
  var valueLine = d3.line().x(function(d){  return x(d.date) })
                           .y(function(d){  return y(d.val)  });

  var all_arrays = new Array();
  for (var i = 0; i < complete_list_country.length; i++){
    temp_array = complete_list_country[i];
    line_graph.append("path")
              .datum(temp_array)
              .attr("class","line")
              .attr("d",valueLine)
              .style("stroke",colors(temp_array[0].cname))
              .on('mouseover',function(d,i){
                console.log(d);
              });
    all_arrays = all_arrays.concat(temp_array);
  };

  var tooltip2 = d3.select("#tooltip2");

  line_graph.selectAll("circle").data(all_arrays).exit().remove();

  line_graph.selectAll("circle").data(all_arrays)
            .enter().append("circle")
            .attr("cx",function(d){ return x(d.date) })
            .attr("cy",function(d){ return y(d.val)})
            .attr("r","4")
            .style("fill",function(d){ return colors(d.cname) })
            .style('stroke','black')
            .on("mouseover",function(d,i){

                  // var x = d3.mouse(this)[0] + 120;
                  // var y =  d3.mouse(this)[1];
                  var x = d3.event.pageX;
                  var y = d3.event.pageY - 90;

                  tooltip2.style('opacity',0.7)
                         .style('left', x + 'px')
                         .style('top',  y + 'px')
                         .html(function(){

                            var str = "";
                            str = "Country Name : " + d['cname'];
                            str = str + "<br />";
                            str = str + " Year : " + d['date'].getFullYear() + "<br />" ;
                            str = str + " Value : " + d['val'] + "<br />" ;

                            return str;

                         });
                  // console.log(d3.mouse(this));
            })
            .on("mouseout",function(d,i){
              tooltip2.style('opacity',0);
            });


  line_graph.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

  line_graph.append("text")
            .attr("transform",
             "translate(" + (width/2) + " ," + (height + margin.top + 5) + ")")
             .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Year");

  line_graph.append("g")
            .call(d3.axisLeft(y));

  line_graph.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Life Expectancy in years");
};

// Infant Mortality
function show_SocioEcoData_IM(){

  d3.selectAll("#Soc_IM_Line > *").remove();

  var tooltip = d3.select("#tooltip");

  var margin = {top: 20, right: 20, bottom: 50, left: 70};
  var width =  0.6 * $(window).width() - margin.left - margin.right;
  var height = $(window).height() - margin.top - margin.bottom;

  var line_graph = d3.select("#Soc_IM_Line")
    .attr("width",(width + margin.left + margin.right))
    .attr("height",(height + margin.top + margin.bottom))
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  var timeParser = d3.timeParse("%d-%m-%Y");
  var complete_list_country = new Array();
  var date_extent_array = new Array();
  var value_range = new Array();
  var only_countries = new Array();


  $.each(selectedCountries_ESData, function(cname, value_object){
    var o = value_object.SOC_IM;
    var temp_array = new Array();
    only_countries.push(cname);

    $.each(o, function(k,v){
      var new_o = new Object();

      var temp_date = '01-01-' + k;

      new_o.cname = cname;
      new_o.date = timeParser(temp_date);
      new_o.val = +v;
      temp_array.push(new_o);

      date_extent_array.push(new_o.date);
      value_range.push(new_o.val);
    });

    complete_list_country.push(temp_array);
  })
  var colors = d3.scaleOrdinal(d3.schemeCategory10);
  // console.log(complete_list_country);
  // console.log(temp_array);

  var l_width = 0.6 * width;

  d3.select("#Soc_IM_Line").attr("width", width + 200 );

  var l_w = 0.6 * $(window).width();

var l_h = 0.8 * $(window).height();

  var legend = d3.select("#Soc_IM_Line").append("g").attr("id","legend_im").attr("width",100).attr("height",100).attr("transform","translate(" + l_w + "," + l_h + " )");
  legend.append("text").html("Legend").style('font-weight','bold').style("font-size",'18px');


  legend.selectAll("rect").data(only_countries).enter().append("g").append("rect")
        .attr("height","10")
        .attr("width","10")
        .style("fill",function(d){return colors(d)})
        .style("stroke",function(d){return colors(d)})
        .attr("y",function(d,i){ return i * 20 + 10 });

  d3.selectAll("#legend_im g")
    .data(only_countries)
    .append("text")
    .attr("y",function(d,i){ return 20 + ((i*20)) })
    .attr("x",function(d,i){ return 20})
    .text(function(d){ return d });


  // UNCOMMENT HERE
  var extent_year = d3.extent(date_extent_array);
  var extent_data = d3.extent(value_range);
  // console.log(date_extent_array);
  // console.log(extent_year);
  var x = d3.scaleTime().range([0,width]).domain(extent_year);
  var y = d3.scaleLinear().range([height,0]).domain(extent_data);
  //
  var valueLine = d3.line().x(function(d){  return x(d.date) })
                           .y(function(d){  return y(d.val)  });



  var all_arrays = new Array();
  for (var i = 0; i < complete_list_country.length; i++){
    temp_array = complete_list_country[i];
    line_graph.append("path")
              .datum(temp_array)
              .attr("class","line")
              .attr("d",valueLine)
              .style("stroke",colors(temp_array[0].cname));

    all_arrays = all_arrays.concat(temp_array);
  }

  var tooltip2 = d3.select("#tooltip2");
  line_graph.selectAll("circle").data(all_arrays)
            .enter().append("circle")
            .attr("cx",function(d){ return x(d.date) })
            .attr("cy",function(d){ return y(d.val)})
            .attr("r","4")
            .style("fill",function(d){ return colors(d.cname) })
            .style('stroke','black')
            .on("mouseover",function(d,i){

                  // var x = d3.mouse(this)[0] + 120;
                  // var y =  d3.mouse(this)[1];
                  var x = d3.event.pageX;
                  var y = d3.event.pageY - 90;

                  tooltip2.style('opacity',0.7)
                         .style('left', x + 'px')
                         .style('top',  y + 'px')
                         .html(function(){

                            var str = "";
                            str = "Country Name : " + d['cname'];
                            str = str + "<br />";
                            str = str + " Year : " + d['date'].getFullYear() + "<br />" ;
                            str = str + " Value : " + d['val'] + "<br />" ;

                            return str;

                         });
                  // console.log(d3.mouse(this));
            })
            .on("mouseout",function(d,i){
              tooltip2.style('opacity',0);
            });



  line_graph.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

  line_graph.append("text")
            .attr("transform",
                   "translate(" + (width/2) + " ," + (height + margin.top + 5) + ")")
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Year");

  line_graph.append("g")
            .call(d3.axisLeft(y));



  line_graph.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of deaths per 1000 births");

};

// Sanitation Data
function show_SocioEcoData_SAN(){

  d3.selectAll("#Soc_SAN_Line > *").remove();

  var margin = {top: 20, right: 20, bottom: 50, left: 70};
  var width =  0.6 * $(window).width() - margin.left - margin.right;
  var height = $(window).height() - margin.top - margin.bottom;

  var line_graph = d3.select("#Soc_SAN_Line")
    .attr("width",(width + margin.left + margin.right))
    .attr("height",(height + margin.top + margin.bottom))
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  var timeParser = d3.timeParse("%d-%m-%Y");
  var complete_list_country = new Array();
  var date_extent_array = new Array();
  var value_range = new Array();
  var only_countries = new Array();

  $.each(selectedCountries_ESData, function(cname, value_object){
    var o = value_object.SOC_SAN;
    var temp_array = new Array();
    only_countries.push(cname);

    $.each(o, function(k,v){
      var new_o = new Object();

      var temp_date = '01-01-' + k;

      new_o.cname = cname;
      new_o.date = timeParser(temp_date);
      new_o.val = +v;
      temp_array.push(new_o);
      date_extent_array.push(new_o.date);
      value_range.push(new_o.val);
    });

    complete_list_country.push(temp_array);
  })

  // console.log(complete_list_country);
  // console.log(temp_array);
  var colors = d3.scaleOrdinal(d3.schemeCategory10);

  d3.select("#Soc_SAN_Line").attr("width", width + 200 );
  var l_w = 0.6 * $(window).width();

 var l_h = 0.8 * $(window).height();

  var legend = d3.select("#Soc_SAN_Line").append("g").attr("id","legend_san").attr("width",100).attr("height",100).attr("transform","translate(" + l_w + "," + l_h + " )");
  legend.append("text").html("Legend").style('font-weight','bold').style("font-size",'18px');


legend.selectAll("rect").data(only_countries).enter().append("g").append("rect")
        .attr("height","10")
        .attr("width","10")
        .style("fill",function(d){return colors(d)})
        .style("stroke",function(d){return colors(d)})
        .attr("y",function(d,i){ return i * 20 + 10 });

  d3.selectAll("#legend_san g")
    .data(only_countries)
    .append("text")
    .attr("y",function(d,i){ return 20 + ((i*20)) })
    .attr("x",function(d,i){ return 20})
    .text(function(d){ return d });

  // UNCOMMENT HERE
  var extent_year = d3.extent(date_extent_array);
  var data_extent = d3.extent(value_range);
  // console.log(date_extent_array);
  // console.log(extent_year);
  var x = d3.scaleTime().range([0,width]).domain(extent_year);
  var y = d3.scaleLinear().range([height,0]).domain([0,120]);
  //
  var valueLine = d3.line().x(function(d){  return x(d.date) })
                           .y(function(d){  return y(d.val)  });






  var all_arrays = new Array();


  for (var i = 0; i < complete_list_country.length; i++){
    temp_array = complete_list_country[i];
    line_graph.append("path")
              .datum(temp_array)
              .attr("class","line")
              .attr("d",valueLine)
              .style("stroke",colors(temp_array[0].cname));

    all_arrays = all_arrays.concat(temp_array);
  }
  var tooltip2 = d3.select("#tooltip2");
  line_graph.selectAll("circle").data(all_arrays)
            .enter().append("circle")
            .attr("cx",function(d){ return x(d.date) })
            .attr("cy",function(d){ return y(d.val)})
            .attr("r","4")
            .style("fill",function(d){ return colors(d.cname) })
            .style('stroke','black')
            .on("mouseover",function(d,i){

                  // var x = d3.mouse(this)[0] + 120;
                  // var y =  d3.mouse(this)[1];
                  var x = d3.event.pageX;
                  var y = d3.event.pageY - 90;
                  console.log(x + " " + y);

                  tooltip2.style('opacity',0.7)
                         .style('left', x + 'px')
                         .style('top',  y + 'px')
                         .html(function(){

                            var str = "";
                            str = "Country Name : " + d['cname'];
                            str = str + "<br />";
                            str = str + " Year : " + d['date'].getFullYear() + "<br />" ;
                            str = str + " Value : " + d['val'] + "<br />" ;

                            return str;

                         });
                  // console.log(d3.mouse(this));
            })
            .on("mouseout",function(d,i){
              tooltip2.style('opacity',0);
            });


  line_graph.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

  line_graph.append("text")
            .attr("transform",
                     "translate(" + (width/2) + " ," + (height + margin.top + 5) + ")")
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Year");

  line_graph.append("g")
            .call(d3.axisLeft(y));

  line_graph.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Percetage of population with access to Sanitation");
};

// ECO LINE - GNI
function show_SocioEcoData_GNI(){

  // $('html,body').animate({
  //     scrollTop: $("#Page3").offset().top},
  //     'slow');
  //
  // $(".fixed_horizontal").css('display','initial');
  d3.selectAll("#ECO_GNI > *").remove();

  var margin = {top: 20, right: 20, bottom: 50, left: 70};
  var width =  0.6 * $(window).width() - margin.left - margin.right;
  var height = $(window).height() - margin.top - margin.bottom;

  var line_graph = d3.select("#ECO_GNI")
    .attr("width",(width + margin.left + margin.right))
    .attr("height",(height + margin.top + margin.bottom))
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  var timeParser = d3.timeParse("%d-%m-%Y");
  var complete_list_country = new Array();
  var date_extent_array = new Array();
  var data_extent_array = new Array();
  var only_countries = new Array();

  $.each(selectedCountries_ESData, function(cname, value_object){
    var o = value_object.ECO_GNI;
    var temp_array = new Array();
    only_countries.push(cname);

    $.each(o, function(k,v){
      var new_o = new Object();

      var temp_date = '01-01-' + k;

      new_o.cname = cname;
      new_o.date = timeParser(temp_date);
      if(typeof(v) == 'string'){
        v = v.replace(",","");
      }
      new_o.val = +v;
      temp_array.push(new_o);
      date_extent_array.push(new_o.date);
      data_extent_array.push(new_o.val);
    });

    complete_list_country.push(temp_array);
  })
  var colors = d3.scaleOrdinal(d3.schemeCategory10);
  // console.log(complete_list_country);
  // console.log(temp_array);

  d3.select("#ECO_GNI").attr("width", width + 200 );

  var l_w = 0.6 * $(window).width();

 var l_h = 0.8 * $(window).height();

  var legend = d3.select("#ECO_GNI").append("g").attr("id","legend_gni").attr("width",100).attr("height",100).attr("transform","translate(" + l_w + "," + l_h + " )");
  legend.append("text").html("Legend").style('font-weight','bold').style("font-size",'18px');


legend.selectAll("rect").data(only_countries).enter().append("g").append("rect")
        .attr("height","10")
        .attr("width","10")
        .style("fill",function(d){return colors(d)})
        .style("stroke",function(d){return colors(d)})
        .attr("y",function(d,i){ return i * 20 + 10 });

  d3.selectAll("#legend_gni g")
    .data(only_countries)
    .append("text")
    .attr("y",function(d,i){ return 20 + ((i*20)) })
    .attr("x",function(d,i){ return 20})
    .text(function(d){ return d });

  // UNCOMMENT HERE
  var extent_year = d3.extent(date_extent_array);
  var extent_gni = d3.extent(data_extent_array);
  // console.log(date_extent_array);
  // console.log(extent_year);
  var x = d3.scaleTime().range([0,width]).domain(extent_year);
  var y = d3.scaleLinear().range([height,0]).domain(extent_gni);
  //
  var valueLine = d3.line().x(function(d){  return x(d.date) })
                           .y(function(d){  return y(d.val)  });





  var all_arrays = new Array();

  for (var i = 0; i < complete_list_country.length; i++){
    temp_array = complete_list_country[i];
    line_graph.append("path")
              .datum(temp_array)
              .attr("class","line")
              .attr("d",valueLine)
              .style("stroke",colors(temp_array[0].cname));

    all_arrays = all_arrays.concat(temp_array);
  }
  var tooltip2 = d3.select("#tooltip2");
  line_graph.selectAll("circle").data(all_arrays)
            .enter().append("circle")
            .attr("cx",function(d){ return x(d.date) })
            .attr("cy",function(d){ return y(d.val)})
            .attr("r","4")
            .style("fill",function(d){ return colors(d.cname) })
            .style('stroke','black')
            .on("mouseover",function(d,i){

                  // var x = d3.mouse(this)[0] + 120;
                  // var y =  d3.mouse(this)[1];
                  var x = d3.event.pageX;
                  var y = d3.event.pageY - 90;

                  tooltip2.style('opacity',0.7)
                         .style('left', x + 'px')
                         .style('top',  y + 'px')
                         .html(function(){

                            var str = "";
                            str = "Country Name : " + d['cname'];
                            str = str + "<br />";
                            str = str + " Year : " + d['date'].getFullYear() + "<br />" ;
                            str = str + " Value : " + d['val'] + "<br />" ;

                            return str;

                         });
                  // console.log(d3.mouse(this));
            })
            .on("mouseout",function(d,i){
              tooltip2.style('opacity',0);
            });


  line_graph.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

  line_graph.append("text")
            .attr("transform",
                   "translate(" + (width/2) + " ," + (height + margin.top + 5) + ")")
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Year");

  line_graph.append("g")
            .call(d3.axisLeft(y));

  line_graph.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("GNI in US dollars");

};
