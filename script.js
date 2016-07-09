function initialize() {
			var map = new google.maps.Map(document.getElementById("map"), {
			  center: {
			      lat: 50.4483293, 
			      lng: 30.5416351
			    },
			  zoom: 12,
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			});
			
			getDirections(map);

			var origin_place_id = null;
  var destination_place_id = null;
  var travel_mode = google.maps.TravelMode.WALKING;
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);

  var origin_input = document.getElementById('origin-input');
  var destination_input = document.getElementById('destination-input');

  var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
  origin_autocomplete.bindTo('bounds', map);
  var destination_autocomplete =
      new google.maps.places.Autocomplete(destination_input);
  destination_autocomplete.bindTo('bounds', map);

  function expandViewportToFitPlace(map, place) {
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  }

  origin_autocomplete.addListener('place_changed', function() {
    var place = origin_autocomplete.getPlace();
    console.log(place.geometry.location.lat());
    console.log(place.geometry.location.lng());
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
    expandViewportToFitPlace(map, place);

    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    origin_place_id = place.place_id;
    route(origin_place_id, destination_place_id, travel_mode,
          directionsService, directionsDisplay);
  });

  destination_autocomplete.addListener('place_changed', function() {
    var place = destination_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
    expandViewportToFitPlace(map, place);

    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    destination_place_id = place.place_id;
    route(origin_place_id, destination_place_id, travel_mode,
          directionsService, directionsDisplay);

  });
  function route(origin_place_id, destination_place_id, travel_mode,
                 directionsService, directionsDisplay) {
    if (!origin_place_id || !destination_place_id) {
      return;
    }
    directionsService.route({
      origin: {'placeId': origin_place_id},
      destination: {'placeId': destination_place_id},
      travelMode: travel_mode
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        computeTotalDistance(directionsDisplay.directions);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  function computeTotalDistance(result) {
    var time = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
      time += myroute.legs[i].duration.text;
    }
    time = time.replace('год','годин');
    time = time.replace('хв','хвилин');
    while(time.charAt(0) === '0')
      time = time.substr(1);
    document.getElementById('timetogo').innerHTML = "Час Вашого руху " + time;
      time = time.replace('хвилин','');
    console.log("I send you an e-mail");
    var currentdate = new Date();
    var time2 = +currentdate.getMinutes() + +time;
    if (time2 > 59) {
        var hours = +currentdate.getHours() + 1;
        time2 -= 60;
        if (time2 < 10)
          time2 = "0" + time2;
        var datetime = "Ви прибудете о " + hours + ":" + time2;
    } else {
      var datetime = "Ви прибудете о " + currentdate.getHours() + ":" + time2;
    }
    document.getElementById('timetobe').innerHTML = datetime;
  }
		}
		function moveMarker(map, marker, latlng) {
			marker.setPosition(latlng);
		}
		function autoRefresh(map, pathCoords) {
			var i, k, marker;
			
			marker = new google.maps.Marker({map:map, icon:"http://maps.google.com/mapfiles/ms/micons/bus.png"});
			for (i = 0; i < pathCoords.length; i++) {				
				setTimeout(function(coords) {
					moveMarker(map, marker, coords);
				}, 2500 * i, pathCoords[i]);
			}
			
		}
		
		function getDirections(map) {
			var directionsService = new google.maps.DirectionsService();
			
			var start = new google.maps.LatLng(50.443571, 30.44156499999997);
			var end = new google.maps.LatLng(50.442322, 30.495398000000023);
			var request = {
				origin:start,
				destination:end,
				travelMode: google.maps.TravelMode.TRANSIT
			};
			directionsService.route(request, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					autoRefresh(map, result.routes[0].overview_path);
				}
			});

			var start2 = new google.maps.LatLng(50.446065, 30.498516999999993);
			var end2 = new google.maps.LatLng(50.44658999999999, 30.466570000000047);
			var request2 = {
				origin:start2,
				destination:end2,
				travelMode: google.maps.TravelMode.DRIVING
			};
			directionsService.route(request2, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					autoRefresh(map, result.routes[0].overview_path);
				}
			});
		}
		google.maps.event.addDomListener(window, 'load', initialize);