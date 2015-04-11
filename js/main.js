// JavaScript Document
(function() {
	var model= {
		
		currentCity:null,
		currentPlace:null,
		cities:["Bilbao"],
		foursquareData:[],
		filteredPlaces:[],
        filteredNames:[],
		pinPosterLocations:[],
		animation:"google.maps.Animation.BOUNCE"
		
	};
	
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

		getAnimation: function() {

			return model.animation;
		},

        setFilteredNames: function(names) {

           model["filteredNames"]=names;
        },


       getFilteredNames: function() {

         return model.filteredNames;
       }
		
		
		
		};
	
	var view= {
		
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
  
               $foursquareElem.text("Foursquare articles Could not be loaded");

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
		
		filterData: function() {
			var places= octopus.getFoursquareData();
			console.log(places);//ok
			var city= octopus.getCurrentCity();
			var i=0;
			var length= places.length;
			var locations=[];
            var placeNames=[];
			    
			for(i; i<length; i++) {
				
			   var country="ES";
			   var place= places[i];
			   var name= place.venue.name;
			   var address=place.venue.location.address;
			   var location= name+ ' , ' +address+ ' , ' +city+ ' , ' +country;
			   
			   locations.push(location);
               placeNames.push(name);
			   
			}
			//console.log(locations);
            //console.log(placeNames);


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

          //console.log(locations);
          console.log(placeNames);

           octopus.setFilteredPlaces(locations);
           octopus.setFilteredNames(placeNames);

           view.renderList();
			
			
		},
		
		renderList: function() {
			var filteredPlaces=[];
			//filteredPlaces= octopus.getFilteredPlaces();
			//console.log(filteredPlaces);
            filteredPlaces= octopus.getFilteredNames();
			var placesList=document.getElementById("places-list");
			var filteredPlace;
		    var elem;
			var i=0;
			var pinPosterPlaces=[];
		    var length=filteredPlaces.length;
			    placesList.innerHTML=" ";
		    //Create the map here
            var map;
            var locations;
            var markers=[];
            var mapOptions= {

              disableDefaultUI: false

            };

          map= new google.maps.Map(document.getElementById("mapDiv"), mapOptions);

				for(i; i<length; i++) {
					
					filteredPlace= filteredPlaces[i];
					elem= document.createElement('li');
					elem.textContent= filteredPlace;
					pinPosterPlaces.push(filteredPlace);
				    //call to pinPoster(filteredPlace) from here
					elem.addEventListener('click',(function (placeCopy) {
						
						return function() {
							
							//octopus.setPinPosterLocations(placeCopy);
							//here might be something related to the marker-->setAnimation?
							//octopus.setAnimation(google.maps.Animation.BOUNCE);
                            //console.log(markers);
                           console.log(placeCopy);
                            var j=0;
                            var length= markers.length;
                            for(j; j<length; j++) {

                              var marker= markers[j];

                              if(placeCopy===marker.title) {

                                marker.setAnimation(google.maps.Animation.BOUNCE);

                              }


                            }

						}
						
						
					})(filteredPlace));
					
					placesList.appendChild(elem);
				    	
				}
				octopus.setPinPosterLocations(pinPosterPlaces);
				//view.renderMap();
                //Or create map here
                //Check for markers? There might be a reference to the markers
                //Hint: indexOf() inside a loop?
			
		//},
		
		//renderMap: function() {
			
			/*var map;
			var locations;
			var markers=[];
			var mapOptions= {
				
				disableDefaultUI: false
				
			};
			
			map= new google.maps.Map(document.getElementById("mapDiv"), mapOptions);*/
			
			function locationFinder() {
			 var locations=[];
			 //locations= octopus.getPinPosterLocations();
             locations= octopus.getFilteredPlaces();
			 //console.log(locations);
        
			 return locations;	
				
			}
			
			function createMapMarker(placeData) {
			  
			  var lat = placeData.geometry.location.lat();  
              var lon = placeData.geometry.location.lng();  
              //var address = placeData.formatted_address;
			  var name= placeData.name;   
              var bounds = window.mapBounds;
			  
			  var marker = new google.maps.Marker({
                map: map,
                position: placeData.geometry.location,
                title: name//+ ", " +address,
                /*animation: function () {

                  var movement = octopus.getAnimation();

                  console.log(movement);
                  return movement;
                }*/
              });
      	
				
				markers.push(marker);
                console.log(markers);
                //marker.animation();
				
				
				var infoWindow = new google.maps.InfoWindow({
                  content: name//+ ", " +address
              });
			  
			   google.maps.event.addListener(marker, 'click', function() {
                infoWindow.open(map, marker);
              });

               bounds.extend(new google.maps.LatLng(lat, lon));
    
               map.fitBounds(bounds);

               map.setCenter(bounds.getCenter());
  
           }
		   
		   
		   function callback(results, status) {
              //var i=0;
              //var length= results.length;
              //console.log(length);
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                
				createMapMarker(results[0]);
                //for(i; i<length; i++ ) {
         
                //createMapMarker(results[i]);

               // }
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
	
	
	
octopus.init();

}());