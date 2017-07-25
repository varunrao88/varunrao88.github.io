$(document).ready(function(){

var all_data = new Object();
var eco_data = new Object();
var soc_im = new Object();
var soc_le = new Object();
var soc_san = new Object();
var only_country = new Array();

d3.json('data/document.json',function(e,d){
  console.log(d);
  console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
})


d3.json('data/countrydata.json',function(e,d){
  // console.log(d);
  for (i = 0; i < d.length ; i++){
      var o = new Object();
      all_data[d[i]["Country Name"]] = {};
      only_country.push(d[i]["Country Name"]);
  }

  d3.json('data/ECONOMIC-GNI.json',function(e,d_gni){

      var o = new Object();

      for(var i = 0; i < d_gni.length ; i++){

        if(i > 0){
          if( d_gni[i]["Country Name"] == d_gni[i-1]["Country Name"] ){
            o[d_gni[i]["Year"]] = d_gni[i]["Value"];
          }else{
            eco_data[d_gni[i-1]["Country Name"]] = o;
            var o = new Object();
            o[d_gni[i]["Year"]] = d_gni[i]["Value"];
          }
        }else {
          o[d_gni[i]["Year"]] = d_gni[i]["Value"];
        }
      }
      eco_data[d_gni[i-1]["Country Name"]] = o;

      $.each(eco_data,function(k,v){
        if(all_data.hasOwnProperty(k) == true){
          all_data[k].ECO_GNI = v;
        }
        else{
          all_data[k] = {};
          all_data[k].ECO_GNI = v;
        }
      });

      // console.log(all_data);

      d3.json('data/SOCIAL-infantMortality.json',function(e,d_im){
        var o = new Object();

        for(var i = 0; i < d_im.length ; i++){

          if(i > 0){
            if( d_im[i]["Country Name"] == d_im[i-1]["Country Name"] ){
              o[d_im[i]["Year"]] = d_im[i]["Value"];
            }else{
              soc_im[d_im[i-1]["Country Name"]] = o;
              var o = new Object();
              o[d_im[i]["Year"]] = d_im[i]["Value"];
            }
          }else {
            o[d_im[i]["Year"]] = d_im[i]["Value"];
          }
        };
        soc_im[d_im[i-1]["Country Name"]] = o;

        $.each(soc_im,function(k,v){
          if(all_data.hasOwnProperty(k) == true){
            all_data[k].SOC_IM = v;
          }
          else{
            // all_data[k] = {};
            // all_data[k].SOC_IM = v;
            if (k == "World" || k == "Arab World" || k == "Caribbean small states" || k == "Central African Republic" || k == "Central Europe and the Baltics" || k == "Eritrea" || k == "Euro area" || k == "European Union" || k == "Fragile and conflict affected situations" || k == "Heavily indebted poor countries (HIPC)" || k == "Least developed countries: UN classification" || k == "Low & middle income" || k == "Lower middle income" || k == "Monaco" || k == "North America" || k == "OECD members" || k == "Other small states" || k == "Pacific island small states" || k == "Serbia" || k == "Singapore" || k == "Small states" || k == "South Asia" || k == "West Bank and Gaza" || k == "Upper middle income"){
                //do nothing
            }
            else if (k == "Bahamas, The") {
              all_data["Bahamas"].SOC_IM = v;
            }
            else if (k == "Brunei Darussalam"){
              all_data["Brunei"].SOC_IM = v;
            }
            else if (k == "Cabo Verde") {
              all_data["Cape Verde"].SOC_IM = v;
            }
            else if(k == "Congo, Dem. Rep."){
              all_data["Democratic Republic of the Congo"].SOC_IM = v;
            }
            else if (k == "Congo, Rep.") {
              all_data["Republic of the Congo"].SOC_IM = v;
            }
            else if (k == "Cote d'Ivoire") {
              all_data["Ivory Coast"].SOC_IM = v;
            }
            else if (k == "Egypt, Arab Rep.") {
              all_data["Egypt"].SOC_IM = v;
            }
            else if (k == "Gambia, The") {
              all_data["Gambia"].SOC_IM = v;
            }
            else if (k == "Iran, Islamic Rep.") {
              all_data["Iran"].SOC_IM = v;
            }
            else if (k == "Korea, Rep.") {
              all_data["South Korea"].SOC_IM = v;
            }
            else if (k == "Kyrgyz Republic") {
              all_data["Kyrgyzstan"].SOC_IM = v;
            }
            else if (k == "Lao PDR") {
              all_data["Laos"].SOC_IM = v;
            }
            else if (k == "Macedonia, FYR") {
              all_data["Macedonia"].SOC_IM = v;
            }
            else if (k == "Micronesia, Fed. Sts.") {
              all_data["Micronesia"].SOC_IM = v;
            }
            else if (k == "Russian Federation") {
              all_data["Russia"].SOC_IM = v;
            }
            else if (k == "Sao Tome and Principe") {
              all_data["São Tomé and Príncipe"].SOC_IM = v;
            }
            else if (k == "Slovak Republic") {
              all_data["Slovakia"].SOC_IM = v;
            }
            else if (k == "St. Kitts and Nevis") {
              all_data["Saint Kitts and Nevis"].SOC_IM = v;
            }
            else if (k == "St. Lucia") {
              all_data["Saint Lucia"].SOC_IM = v;
            }
            else if (k == "St. Vincent and the Grenadines") {
              all_data["Saint Vincent and the Grenadines"].SOC_IM = v;
            }
            else if (k == "Syrian Arab Republic") {
              all_data["Syria"].SOC_IM = v;
            }
            else if (k == "Timor-Leste") {
              all_data["East Timor"].SOC_IM = v;
            }
            else if (k == "Venezuela, RB") {
              all_data["Venezuela"].SOC_IM = v;
            }
            else if (k == "Yemen, Rep.") {
              all_data["Yemen"].SOC_IM = v;
            }
            else{
              console.log(k);
            }

          }
        });

        d3.json('data/SOCIAL-LifeExpect.json',function(e,d_le){
          var o = new Object();

          for(var i = 0; i < d_le.length ; i++){

            if(i > 0){
              if( d_le[i]["Country Name"] == d_le[i-1]["Country Name"] ){
                o[d_le[i]["Year"]] = d_le[i]["Value"];
              }else{
                soc_le[d_le[i-1]["Country Name"]] = o;
                var o = new Object();
                o[d_le[i]["Year"]] = d_le[i]["Value"];
              }
            }else {
              o[d_le[i]["Year"]] = d_le[i]["Value"];
            }
          };
          soc_le[d_le[i-1]["Country Name"]] = o;

          $.each(soc_le,function(k,v){
            if(all_data.hasOwnProperty(k) == true){
              all_data[k].SOC_LE = v;
            }
            else{
              // all_data[k] = {};
              // all_data[k].SOC_IM = v;
              if (k == "World" || k == "Arab World" || k == "Caribbean small states" || k == "Central African Republic" || k == "Central Europe and the Baltics" || k == "Eritrea" || k == "Euro area" || k == "European Union" || k == "Fragile and conflict affected situations" || k == "Heavily indebted poor countries (HIPC)" || k == "Least developed countries: UN classification" || k == "Low & middle income" || k == "Lower middle income" || k == "Monaco" || k == "North America" || k == "OECD members" || k == "Other small states" || k == "Pacific island small states" || k == "Serbia" || k == "Singapore" || k == "Small states" || k == "South Asia" || k == "West Bank and Gaza" || k == "Upper middle income" || k == "Channel Islands" || k == "Bermuda" || k == "Kosovo" || k == "Macao SAR, China" || k == "Sint Maarten (Dutch part)" || k == "St. Martin (French part)"){
                  //do nothing
              }
              else if (k == "Bahamas, The") {
                all_data["Bahamas"].SOC_LE = v;
              }
              else if(k == "Virgin Islands (U.S.)"){
                all_data["U.S. Virgin Islands"].SOC_LE = v;
              }
              else if (k == "Brunei Darussalam"){
                all_data["Brunei"].SOC_LE = v;
              }
              else if (k == "Cabo Verde") {
                all_data["Cape Verde"].SOC_LE = v;
              }
              else if(k == "Congo, Dem. Rep."){
                all_data["Democratic Republic of the Congo"].SOC_LE = v;
              }
              else if (k == "Congo, Rep.") {
                all_data["Republic of the Congo"].SOC_LE = v;
              }
              else if (k == "Cote d'Ivoire") {
                all_data["Ivory Coast"].SOC_LE = v;
              }
              else if(k == "Hong Kong SAR, China"){
                all_data["Hong Kong"].SOC_LE = v;
              }
              else if (k == "Egypt, Arab Rep.") {
                all_data["Egypt"].SOC_LE = v;
              }
              else if (k == "Gambia, The") {
                all_data["Gambia"].SOC_LE = v;
              }
              else if (k == "Iran, Islamic Rep.") {
                all_data["Iran"].SOC_LE = v;
              }
              else if (k == "Korea, Rep.") {
                all_data["South Korea"].SOC_LE = v;
              }
              else if (k == "Kyrgyz Republic") {
                all_data["Kyrgyzstan"].SOC_LE = v;
              }
              else if (k == "Lao PDR") {
                all_data["Laos"].SOC_LE = v;
              }
              else if (k == "Macedonia, FYR") {
                all_data["Macedonia"].SOC_LE = v;
              }
              else if (k == "Micronesia, Fed. Sts.") {
                all_data["Micronesia"].SOC_LE = v;
              }
              else if (k == "Russian Federation") {
                all_data["Russia"].SOC_LE = v;
              }
              else if (k == "Sao Tome and Principe") {
                all_data["São Tomé and Príncipe"].SOC_LE = v;
              }
              else if (k == "Slovak Republic") {
                all_data["Slovakia"].SOC_LE = v;
              }
              else if (k == "St. Kitts and Nevis") {
                all_data["Saint Kitts and Nevis"].SOC_LE = v;
              }
              else if (k == "St. Lucia") {
                all_data["Saint Lucia"].SOC_LE = v;
              }
              else if (k == "St. Vincent and the Grenadines") {
                all_data["Saint Vincent and the Grenadines"].SOC_LE = v;
              }
              else if (k == "Syrian Arab Republic") {
                all_data["Syria"].SOC_LE = v;
              }
              else if (k == "Timor-Leste") {
                all_data["East Timor"].SOC_LE = v;
              }
              else if (k == "Venezuela, RB") {
                all_data["Venezuela"].SOC_LE = v;
              }
              else if (k == "Yemen, Rep.") {
                all_data["Yemen"].SOC_LE = v;
              }
              else{
                console.log(k);
              }

            }
          });

          d3.json('data/SOCIAL-sanitation.json',function(e,d_san){
            var o = new Object();

            for(var i = 0; i < d_san.length ; i++){

              if(i > 0){
                if( d_san[i]["Country Name"] == d_san[i-1]["Country Name"] ){
                  o[d_san[i]["Year"]] = d_san[i]["Value"];
                }else{
                  soc_san[d_san[i-1]["Country Name"]] = o;
                  var o = new Object();
                  o[d_san[i]["Year"]] = d_san[i]["Value"];
                }
              }else {
                o[d_san[i]["Year"]] = d_le[i]["Value"];
              }
            };
            soc_san[d_san[i-1]["Country Name"]] = o;

            $.each(soc_san,function(k,v){
              if(all_data.hasOwnProperty(k) == true){
                all_data[k].SOC_SAN = v;
              }
              else{
                // all_data[k] = {};
                // all_data[k].SOC_IM = v;
                if (k == "World" || k == "Arab World" || k == "Caribbean small states" || k == "Central African Republic" || k == "Central Europe and the Baltics" || k == "Eritrea" || k == "Euro area" || k == "European Union" || k == "Fragile and conflict affected situations" || k == "Heavily indebted poor countries (HIPC)" || k == "Least developed countries: UN classification" || k == "Low & middle income" || k == "Lower middle income" || k == "Monaco" || k == "North America" || k == "OECD members" || k == "Other small states" || k == "Pacific island small states" || k == "Serbia" || k == "Singapore" || k == "Small states" || k == "South Asia" || k == "West Bank and Gaza" || k == "Upper middle income" || k == "Channel Islands" || k == "Bermuda" || k == "Kosovo" || k == "Macao SAR, China" || k == "Sint Maarten (Dutch part)" || k == "St. Martin (French part)" || k == "Cayman Islands"){
                    //do nothing
                }
                else if (k == "Bahamas, The") {
                  all_data["Bahamas"].SOC_SAN = v;
                }
                else if(k == "Virgin Islands (U.S.)"){
                  all_data["U.S. Virgin Islands"].SOC_SAN = v;
                }
                else if (k == "Brunei Darussalam"){
                  all_data["Brunei"].SOC_SAN = v;
                }
                else if (k == "Cabo Verde") {
                  all_data["Cape Verde"].SOC_SAN = v;
                }
                else if(k == "Congo, Dem. Rep."){
                  all_data["Democratic Republic of the Congo"].SOC_SAN = v;
                }
                else if (k == "Congo, Rep.") {
                  all_data["Republic of the Congo"].SOC_SAN = v;
                }
                else if (k == "Cote d'Ivoire") {
                  all_data["Ivory Coast"].SOC_SAN = v;
                }
                else if(k == "Hong Kong SAR, China"){
                  all_data["Hong Kong"].SOC_SAN = v;
                }
                else if (k == "Egypt, Arab Rep.") {
                  all_data["Egypt"].SOC_SON = v;
                }
                else if (k == "Gambia, The") {
                  all_data["Gambia"].SOC_SAN = v;
                }
                else if (k == "Iran, Islamic Rep.") {
                  all_data["Iran"].SOC_SAN = v;
                }
                else if (k == "Korea, Rep.") {
                  all_data["South Korea"].SOC_SAN = v;
                }
                else if (k == "Kyrgyz Republic") {
                  all_data["Kyrgyzstan"].SOC_SAN = v;
                }
                else if (k == "Lao PDR") {
                  all_data["Laos"].SOC_SAN = v;
                }
                else if (k == "Macedonia, FYR") {
                  all_data["Macedonia"].SOC_SAN = v;
                }
                else if (k == "Micronesia, Fed. Sts.") {
                  all_data["Micronesia"].SOC_SAN = v;
                }
                else if (k == "Russian Federation") {
                  all_data["Russia"].SOC_SAN = v;
                }
                else if (k == "Sao Tome and Principe") {
                  all_data["São Tomé and Príncipe"].SOC_SAN = v;
                }
                else if (k == "Slovak Republic") {
                  all_data["Slovakia"].SOC_SAN = v;
                }
                else if (k == "St. Kitts and Nevis") {
                  all_data["Saint Kitts and Nevis"].SOC_SAN = v;
                }
                else if (k == "St. Lucia") {
                  all_data["Saint Lucia"].SOC_SAN = v;
                }
                else if (k == "St. Vincent and the Grenadines") {
                  all_data["Saint Vincent and the Grenadines"].SOC_SAN = v;
                }
                else if (k == "Syrian Arab Republic") {
                  all_data["Syria"].SOC_SAN = v;
                }
                else if (k == "Timor-Leste") {
                  all_data["East Timor"].SOC_SAN = v;
                }
                else if (k == "Venezuela, RB") {
                  all_data["Venezuela"].SOC_SAN = v;
                }
                else if (k == "Yemen, Rep.") {
                  all_data["Yemen"].SOC_SAN = v;
                }
                else{
                  console.log(k);
                }
              }
            });
            $("#str").text(JSON.stringify(all_data));
            console.log(all_data);

          });

        });

      });



  });
})
});
