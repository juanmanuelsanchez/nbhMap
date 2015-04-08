// JavaScript Document
(function() {
	var model= {
		
		currentCity:null,
		currentPlace:null,
		cities:["Bilbao"],
		foursquareData:[],
		filteredPlaces:[],
		pinPosterLocations:[],
		
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

         })


             return false;

        },
		
		filterData: function() {
			var places= octopus.getFoursquareData();
			console.log(places);//ok
			var city= octopus.getCurrentCity();
			var i=0;
			var length= places.length;
			var locations=[];
		    var filteredLocations=[];
			    
			for(i; i<length; i++) {
				
			   var country="ES";
			   var place= places[i];
			   var name= place.venue.name;
			   var address=place.venue.location.address;
			   var location= name+ ' , ' +address+ ' , ' +city+ ' , ' +country;
			   
			   locations.push(location);
			   
			}
			
			filteredLocations= locations.slice(5,-3);
			octopus.setFilteredPlaces(filteredLocations);
			view.renderList();
			
			
		},
		
		renderList: function() {
			var filteredPlaces=[];
			filteredPlaces= octopus.getFilteredPlaces();
			//console.log(filteredPlaces);
			var placesList=document.getElementById("places-list");
			var filteredPlace;
		    var elem;
			var i=0;
		    var length=filteredPlaces.length;
			    placesList.innerHTML=" ";
				for(i; i<length; i++) {
					
					filteredPlace= filteredPlaces[i];
					elem= document.createElement('li');
					elem.textContent= filteredPlace;
					
					elem.addEventListener('click',(function (placeCopy) {
						
						return function() {
							
							octopus.setPinPosterLocations(placeCopy);
							//here migth be something related to the marker
							view.renderMap();
						}
						
						
					})(filteredPlace));
					
					placesList.appendChild(elem);
				    	
				}
			
		},
		
		renderMap: function() {
			
			
			var locations= octopus.getPinPosterLocations();
			console.log(locations);
			
			
		},
		
    };
	
	
	
octopus.init();

}());