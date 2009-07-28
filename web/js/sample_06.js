_mPreferMetric=true;

document.observe('dom:loaded', initSample6);

function initSample6()
{
	alert('test');
	geocoder = new GClientGeocoder();
	
	draw();
	
	
}

/*
var map = new GMap2(document.getElementById("map"));
var start = new GLatLng(60.213,24.88);
map.setCenter(start, 14);

map.addControl(new GMapTypeControl(1));
map.addControl(new GLargeMapControl());
map.addControl(new GScaleControl(250));
new GKeyboardHandler(map);
map.enableContinuousZoom();
*/

function add()
{
  var marker1;
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
    if(parseInt(dist)>10000){dist=(parseInt(dist)/1000).toFixed(1)+"km";}
    label1.setContents(dist);label2.setContents(dist);
    label1.setPoint(marker1.getPoint());
    label1.setContents(dist);
    label2.setPoint(marker2.getPoint());
    if(poly)map.removeOverlay(poly);
    poly = new GPolyline(line,'#FFFF00', 8, 1)
    map.addOverlay(poly);
  }

  document.getElementById("add").value="click on map";

  GEvent.addListener(map, 'click', function(overlay,pnt) 
  {
  if(pnt&&button==0)
  {
    marker1 = new GMarker(pnt,{draggable: true});
    map.addOverlay(marker1);
    marker1.enableDragging();
    label1=new ELabel(pnt, dist,"labelstyle",new GSize(2,20),60);
    map.addOverlay(label1);
    marker2 = new GMarker(pnt,{draggable: true});
    map.addOverlay(marker2);
    marker2.enableDragging();
    label2=new ELabel(pnt, dist,"labelstyle",new GSize(2,20),60);
    map.addOverlay(label2);
  }
  GEvent.addListener(marker1,"drag",function(){measure();});
  GEvent.addListener(marker1,"dblclick",function(){clr();});
  GEvent.addListener(marker2,"drag",function(){measure();});
  GEvent.addListener(marker2,"dblclick",function(){clr();});
  document.getElementById("add").value="You Have a Ruler";
  button++;
  });


  function clr(){
    map.removeOverlay(poly);
    map.removeOverlay(marker1);
    map.removeOverlay(marker2);
    map.removeOverlay(label1);
    map.removeOverlay(label2);
    button=0;
    document.getElementById("add").value="New Ruler";
    dist=0;
    }
}

///Geo


function showAddress(address)
{
  geocoder.getLatLng(address,function(point){
  if(!point){
    alert(address+" not found");
  }else{
    map.panTo(point);
  }
  })
}


/////////////

//Version 0.2      the .copy() parameters were wrong
//version 1.0      added .show() .hide() .setContents() .setPoint() .setOpacity() .overlap



function ELabel(point, html, classname, pixelOffset, percentOpacity, overlap) 
{
     // Mandatory parameters
 this.point = point;
 this.html = html;
 
 // Optional parameters
 this.classname = classname||"";
     this.pixelOffset = pixelOffset||new GSize(0,0);
     if (percentOpacity) {
       if(percentOpacity<0){percentOpacity=0;}
       if(percentOpacity>100){percentOpacity=100;}
     }        
     this.percentOpacity = percentOpacity;
     this.overlap=overlap||false;
} 
   
   ELabel.prototype = new GOverlay();

   ELabel.prototype.initialize = function(map) {
     var div = document.createElement("div");
 div.style.position = "absolute";
 div.innerHTML = '<div class="' + this.classname + '">' + this.html + '</div>' ;
 map.getPane(G_MAP_FLOAT_SHADOW_PANE).appendChild(div);
 this.map_ = map;
 this.div_ = div;
 if (this.percentOpacity) {        
   if(typeof(div.style.filter)=='string'){div.style.filter='alpha(opacity:'+this.percentOpacity+')';}
   if(typeof(div.style.KHTMLOpacity)=='string'){div.style.KHTMLOpacity=this.percentOpacity/100;}
   if(typeof(div.style.MozOpacity)=='string'){div.style.MozOpacity=this.percentOpacity/100;}
   if(typeof(div.style.opacity)=='string'){div.style.opacity=this.percentOpacity/100;}
     }
     if (this.overlap) {
       var z = GOverlay.getZIndex(this.point.lat());
       this.div_.style.zIndex = z;
     }
   }

   ELabel.prototype.remove = function() {
     this.div_.parentNode.removeChild(this.div_);
   }

   ELabel.prototype.copy = function() {
     return new ELabel(this.point, this.html, this.classname, this.pixelOffset, this.percentOpacity, this.overlap);
   }

   ELabel.prototype.redraw = function(force) {
     var p = this.map_.fromLatLngToDivPixel(this.point);
     var h = parseInt(this.div_.clientHeight);
     this.div_.style.left = (p.x + this.pixelOffset.width) + "px";
 this.div_.style.top = (p.y +this.pixelOffset.height - h) + "px";
   }

   ELabel.prototype.show = function() {
     this.div_.style.display="";
   }
   
   ELabel.prototype.hide = function() {
     this.div_.style.display="none";
   }
   
   ELabel.prototype.setContents = function(html) {
     this.html = html;
     this.div_.innerHTML = '<div class="' + this.classname + '">' + this.html + '</div>' ;
     this.redraw(true);
   }
   
   ELabel.prototype.setPoint = function(point) {
     this.point = point;
     if (this.overlap) {
       var z = GOverlay.getZIndex(this.point.lat());
       this.div_.style.zIndex = z;
     }
     this.redraw(true);
   }
   
   ELabel.prototype.setOpacity = function(percentOpacity) {
     if (percentOpacity) {
       if(percentOpacity<0){percentOpacity=0;}
       if(percentOpacity>100){percentOpacity=100;}
     }        
     this.percentOpacity = percentOpacity;
     if (this.percentOpacity) {        
       if(typeof(this.div_.style.filter)=='string'){this.div_.style.filter='alpha(opacity:'+this.percentOpacity+')';}
   if(typeof(this.div_.style.KHTMLOpacity)=='string'){this.div_.style.KHTMLOpacity=this.percentOpacity/100;}
   if(typeof(this.div_.style.MozOpacity)=='string'){this.div_.style.MozOpacity=this.percentOpacity/100;}
   if(typeof(this.div_.style.opacity)=='string'){this.div_.style.opacity=this.percentOpacity/100;}
     }
   }

   
   
////////////////////////// circle///////////////////////////////
 	
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




