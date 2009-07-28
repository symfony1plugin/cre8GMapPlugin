<div>
<?php echo DistanceCalculator::getDistance(51.562105076015385, -0.07676482200622559, 51.526486, -0.279919, 'kilometers'); ?> km
</div>


<div id='mapka' style='width: 700px; height: 300px; border: 1px solid black; background: gray;'>
<!-- tu będzie mapa -->
</div>

<input type="text" id="distance" />

<script type='text/javascript'>  

function mapaStart()  
{  
    if(GBrowserIsCompatible())  // sprawdzamy, czy przeglądarka jest kompatybilna  
    {  
    	_mPreferMetric=true;

    	venueGLatLng = new GLatLng(<?php echo $venueLocation['lat']; ?>,<?php echo $venueLocation['lng']; ?>); 
    	venueMarker = new GMarker(venueGLatLng);

    	var destination;
    	
        map = new GMap2(document.getElementById("mapka"));  
        map.setCenter(venueGLatLng,12);


//        map.addControl(new GMapTypeControl(1));
        map.addControl(new GLargeMapControl3D() );
        map.addControl(new GScaleControl(250));

        map.enableContinuousZoom();
        map.enableDoubleClickZoom();

        new GKeyboardHandler(map);

        draw();  

		map.addOverlay(venueMarker);

		add();


		// test:
		marker2 = new GLatLng(51.526486, -0.279919);
		map.addOverlay(new GMarker(marker2));
		measure();
        
    }  
}  

mapaStart();
//////////////////////////////////////////////


function add()
{
  var marker1 = venueMarker;
  var marker2;
  var label1;
  var label2;
  var button=0;
  var dist=0;
  var line;
  var poly;

  function measure(){
    if(marker1&&marker2)
    line = [marker1.getPoint(),marker2.getPoint()];
    dist=marker1.getPoint().distanceFrom(marker2.getPoint());
    dist=dist.toFixed(0)+"m";
    distInMeters = parseInt(dist);
    if(parseInt(dist)>1000){dist=(parseInt(dist)/1000).toFixed(1)+"km";}
    if(poly) map.removeOverlay(poly);
    var colour = ( (distInMeters / 1000) > <?php echo sfConfig::get('app_cre8_ordering_system_distance_radius', 2); ?>) ? '#FF0000' : '#00FF00';
    poly = new GPolyline(line,colour, 8, 1)
    map.addOverlay(poly);
    document.getElementById('distance').value = dist;
  }

  GEvent.addListener(map, 'click', function(overlay,pnt) 
  {
    if(pnt&&button==0)
    {
      marker2 = new GMarker(pnt,{draggable: true});
      map.addOverlay(marker2);
      marker2.enableDragging();

      GEvent.addListener(marker2,"drag",function(){measure();});
      GEvent.addListener(marker2,"dblclick",function(){clr();});
      button++;
      measure();
    }
//  
  });


  function clr(){
    map.removeOverlay(poly);
    map.removeOverlay(marker2);
    document.getElementById('distance').value = '';
    button=0;
    dist=0;
    }
}
   
////////////////////////// circle///////////////////////////////

function draw(pnt)
{
 map.clearOverlays();
 bounds = new GLatLngBounds();
 var givenRad = <?php echo sfConfig::get('app_cre8_ordering_system_distance_radius', 2); ?>*1;
 var givenQuality = <?php echo sfConfig::get('app_cre8_ordering_system_segments', 40); ?>*1;
 var centre = pnt || new GLatLng(<?php echo $venueLocation['lat']; ?>,<?php echo $venueLocation['lng']; ?>) || map.getCenter()
 drawCircle(centre, givenRad, givenQuality);
// fit();
}

   
 function drawCircle(center, radius, nodes, liColor, liWidth, liOpa, fillColor, fillOpa)
 {
 	//calculating km/degree
 	var latConv = center.distanceFrom(new GLatLng(center.lat()+0.1, center.lng()))/100;
 	var lngConv = center.distanceFrom(new GLatLng(center.lat(), center.lng()+0.1))/100;

 	//Loop 
 	var points = [];
 	var step = parseInt(360/nodes)||10;
 	for(var i=0; i<=360; i+=step)
 	{
 	var pint = new GLatLng(center.lat() + (radius/latConv * Math.cos(i * Math.PI/180)), center.lng() + 
 	(radius/lngConv * Math.sin(i * Math.PI/180)));
 	points.push(pint);
 	bounds.extend(pint); //this is for fit function
 	}
 	points.push(points[0]); // Closes the circle, thanks Martin
 	fillColor = fillColor||liColor||"#0055ff";
 	liWidth = liWidth||2;
 	var poly = new GPolygon(points,liColor,liWidth,liOpa,fillColor,fillOpa);
 	map.addOverlay(poly);
 }
 /////////////////////////////////////////////////////////////////////



</script>