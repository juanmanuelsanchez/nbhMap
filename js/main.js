// JavaScript Document

//CREDITS AUTOCOMPLETE LIBRARY:

/*Copyright 2012 DevBridge and other contributors
 http://www.devbridge.com/projects/autocomplete/jquery/

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

 (function() {

   //Model
	var model= {

		currentCity:null,
		currentPlace:null,
		cities:["Bilbao"],
		foursquareData:[],
		filteredPlaces:[],
        filteredNames:[],
		pinPosterLocations:[],
        markers:[],
        infoWindows:[]

	};

    //Controller
	var octopus= {

		init: function() {
			model.currentCity= model.cities[0];
			view.retrieveData();
		},

		getCurrentCity: function() {

			return model.currentCity;

		},

		getFoursquareData: function() {

			return model.foursquareData;

		},

		setFoursquareData: function(data) {

			model["foursquareData"]=data;

		},

		setFilteredPlaces: function(places) {

			model["filteredPlaces"]=places;

		},

		getFilteredPlaces: function() {

		   return model.filteredPlaces;

		},

		setPinPosterLocations: function(placeCopy){

		   model["pinPosterLocations"]= placeCopy;

		},

		getPinPosterLocations: function() {

			return model.pinPosterLocations;

		},

		setAnimation: function(animation) {

			model["animation"]=animation;
		},

        setFilteredNames: function(names) {

           model["filteredNames"]=names;
        },

       getFilteredNames: function() {

         return model.filteredNames;
       },

       setMarkers: function(marker) {

        model.markers.push(marker);
       },

       getMarkers: function() {

        return model.markers;
       },

       setInfoWindows: function(infoWindow) {

        model.infoWindows.push(infoWindow);
       },

       getInfoWindows: function() {

        return model.infoWindows;
       }

    };

    //View
	var view= {
        //Retrieve data from Foursquare API
		retrieveData: function() {

		   var currentCity= octopus.getCurrentCity();
		   var $foursquareElem= $('#foursquare-places');
		   $foursquareElem.text("");
		   var clientID='WMGXUPU15HUVPMTMGK3WZPHVGBXKPXWMUQ5WW3DMRSOZUIH5';
           var clientSecret='RFUOHDP441JSHFBS1AS0KLAGRVVRGNL2VACN0RHIJJNC5AT2';
		   var foursquareUrl='https://api.foursquare.com/v2/venues/explore?near=' +currentCity+ '&&client_id=' +clientID+ '&client_secret=' +clientSecret+ '&v=20130815&query=sushi';
		   var foursquareContent=[];
		    function getDataFoursquare(callback) {

              $.getJSON(foursquareUrl, function(data) {

                var places=[];
                places= data.response.groups[0].items;

                 callback(places);

              }).error(function(e){

               $foursquareElem.text("Sorry, Foursquare articles could not be loaded");

             });

               return false;

           }

		   getDataFoursquare(function(placesData){


            foursquareContent= placesData;

            octopus.setFoursquareData(foursquareContent);
            view.filterData();

         });


             return false;

        },

        //Filter data
		filterData: function() {
			var places= octopus.getFoursquareData();
			console.log(places);//ok
			var city= octopus.getCurrentCity();
			var i=0;
			var length= places.length;
			var locations=[];
            var placeNames=[];
            var replaces=[];

			for(i; i<length; i++) {

			   var country="ES";
			   var place= places[i];
			   var name= place.venue.name;
			   var address=place.venue.location.address;
			   var location= name+ ' , ' +address+ ' , ' +city+ ' , ' +country;

			   locations.push(location);
               placeNames.push(name);

			}



           locations.splice(1,1);
           locations.splice(3,1);
           locations.splice(5,1);
           locations.splice(7,1);
           locations.splice(8,1);

           placeNames.splice(1,1);
           placeNames.splice(3,1);
           placeNames.splice(5,1);
           placeNames.splice(7,1);
           placeNames.splice(8,1);


           placeNames.sort();
          //console.log(placeNames);

           var regEx1=/Kuma/g;
           var regEx2=/Mao Restaurante/g;
          //var regEx3=/SUMO Ledesma/g;
           var regEx4=/SUMO Poza/g;
           var regEx5=/Sakura/g;
           var regEx6=/Wasabi Bilbao Restaurante Japones/g;


		   var replace1= placeNames[0];
           var replace2= placeNames[1].replace(regEx1, "KUMA");
           var replace3= placeNames[2].replace(regEx2, "Mao");
		   var replace4= placeNames[3];//.replace(regEx3, "SUMO");
           var replace5= placeNames[4].replace(regEx4, "SUMO Pozas");
		   var replace6= placeNames[5].replace(regEx5, "Restaurante Sakura");
           var replace7= placeNames[6];//Sushi Artist
           var replace8= placeNames[7].replace(regEx6, "Restaurante Wasabi Bilbao");
		   replaces.push(replace1);
		   replaces.push(replace2);
		   replaces.push(replace3);
		   replaces.push(replace4);
		   replaces.push(replace5);
		   replaces.push(replace6);
           replaces.push(replace7);
           replaces.push(replace8);
		  //console.log(replaces);

           octopus.setFilteredPlaces(locations);
           octopus.setFilteredNames(replaces);

           view.render();


		},

        //Render listView and map with the data
		render: function() {

			var filteredPlaces=[];
            filteredPlaces= octopus.getFilteredNames();
            var filteredLocations=[];
            filteredLocations=octopus.getFilteredPlaces();
			var placesList=document.getElementById("places-list");
            var showButton= document.getElementById("show");
            var hideButton= document.getElementById("hide");
			var filteredPlace;
		    var elem;
			var i=0;
			var pinPosterPlaces=[];
		    var length=filteredPlaces.length;
			    placesList.innerHTML=" ";
            var map;
            var locations;
            var markers=[];
            markers=octopus.getMarkers();
            var infoWindows=[];
            infoWindows=octopus.getInfoWindows();
            var mapOptions= {

              disableDefaultUI: false

            };

		    $('#autocomplete').devbridgeAutocomplete ({

                  lookup:filteredLocations,
                  minChars: 1,
                  onSearchComplete: function(filteredLocations,suggestions) {
                    console.log(suggestions);
                    var listSuggestions=[];

                    for(suggestion in suggestions){

                      var location= suggestions[suggestion].value;
                      listSuggestions.push(location);
                    }
                    clearMarkers();
                    pinPoster(listSuggestions);

                  },
                  onSelect: function(suggestion) {
                     var newList=[];
                     var newLocation= suggestion.value;
                     newList.push(newLocation);
                     clearMarkers();
                    pinPoster(newList);

                  },
                  showNoSuggestionNotice: true,
                  noSuggestionNotice: 'Sorry, no matching results'

            });

            map= new google.maps.Map(document.getElementById("mapDiv"), mapOptions);

				for(i; i<length; i++) {

					filteredPlace= filteredPlaces[i];
					elem= document.createElement('li');
					elem.textContent= filteredPlace;
					pinPosterPlaces.push(filteredPlace);

					elem.addEventListener('click',(function (placeCopy) {

						return function() {

                          var j = 0;
                          var i = 0;
                          var lengthInfoWindows = infoWindows.length;
                          var length = markers.length;
                          if (length >= 8) {

                            for (i, j; i < lengthInfoWindows, j < length; i++, j++) {

                              var marker = markers[j];
                              var info = infoWindows[i];

                              if (placeCopy == info.content && placeCopy === marker.title) {

                                if (marker.getAnimation() != null) {

                                  marker.setAnimation(null);
                                  info.close(map, marker);

                                } else {

                                  marker.setAnimation(google.maps.Animation.BOUNCE);
                                  info.open(map, marker);

                                }

                              }

                            }
                          }else{

                            return;
                          }

                        }



					})(filteredPlace));

					placesList.appendChild(elem);

				}
				octopus.setPinPosterLocations(pinPosterPlaces);


			   function locationFinder() {
			     var locations=[];
                 locations= octopus.getFilteredPlaces();

			     return locations;

               }

			    function createMapMarker(placeData) {

			     var lat = placeData.geometry.location.lat();
                 var lon = placeData.geometry.location.lng();
			     var name= placeData.name;
                 var bounds = window.mapBounds;

			     var marker = new google.maps.Marker({
                   map: map,
                   position: placeData.geometry.location,
                   title: name
                 });


                  octopus.setMarkers(marker);


                  var infoWindow = new google.maps.InfoWindow({
                  content: name
                 });

                  octopus.setInfoWindows(infoWindow);

			      google.maps.event.addListener(marker, 'click', function() {

                    infoWindow.open(map, marker);

                  });

                  bounds.extend(new google.maps.LatLng(lat, lon));

                  map.fitBounds(bounds);

                  map.setCenter(bounds.getCenter());

                }


		       function callback(results, status) {

                 if (status == google.maps.places.PlacesServiceStatus.OK) {

				   createMapMarker(results[0]);

                 }
               }

               function pinPoster(locations) {

                 var service = new google.maps.places.PlacesService(map);

                 for (place in locations) {

                   var request = {
                   query: locations[place]

                   };

                   service.textSearch(request, callback);
                 }
               }

               showButton.addEventListener('click', function() {

                 showMarkers();

               }, false);


               hideButton.addEventListener('click', function() {

                 clearMarkers();

               }, false);

               function setAllMap(map) {

                 var j=0;
                 var length= markers.length;

                for(j; j<length; j++) {

                   markers[j].setMap(map);
                }

               }

              function showMarkers() {

			    setAllMap(map);

		      }

              function clearMarkers() {

                setAllMap(null);
              }

		      window.mapBounds = new google.maps.LatLngBounds();

              locations = locationFinder();
              pinPoster(locations);



              window.addEventListener('resize', function(e) {
              map.fitBounds(mapBounds);

             })

        },

   };


   //Initialize controller
   octopus.init();

 }());
