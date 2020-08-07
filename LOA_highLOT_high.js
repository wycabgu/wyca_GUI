var toggleBtn, backview, fw, bw, left, right, stp;
var fireRate = 100, fireInterval=null;
var bat_state;
var livingroom, bedroom, diningroom, kitchen, chargingpt;
var theX=0, theY=0, theZ=0;
var Rfeedback;
var RposeX;
var movebaseState;
var myVideo;
var speedvalue = 0.1;
var speedmessage;



	var ros = new ROSLIB.Ros({
		//url : 'ws://132.73.207.247:9090'
		url : 'ws://192.168.0.100:9090'
	});

	ros.on('connection', function(){
		console.log('Connected to websocket server.');
		document.getElementById("wifi_on").style.display = "block";
	    document.getElementById("wifi_off").style.display = "none";
	})

	 ros.on('error', function(error) {
	   console.log('Error connecting to websocket server: ', error);
	   document.getElementById("wifi_on").style.display = "none";
	   document.getElementById("wifi_off").style.display = "block";
	   		document.getElementById("b25").style.display = "block";
		document.getElementById("b50").style.display = "none";
		document.getElementById("b75").style.display = "none";
		document.getElementById("b100").style.display = "none";	 
	 });

	  ros.on('close', function() {
	   console.log('Connection to websocket server closed.');
	   document.getElementById("wifi_on").style.display = "none";
	   document.getElementById("wifi_off").style.display = "block";
	   		document.getElementById("b25").style.display = "block";
		document.getElementById("b50").style.display = "none";
		document.getElementById("b75").style.display = "none";
		document.getElementById("b100").style.display = "none";	 
	 });

	  cmd_vel_listener = new ROSLIB.Topic({
	    ros : ros,
	    name : "/cmd_vel/teleop_safe",
	    messageType : 'geometry_msgs/Twist'
	  });

	  bat_listener = new ROSLIB.Topic({
	  	ros: ros,
	  	name: "/keylo_api/energy/battery_state",
	  	messageType: 'std_msgs/Int8'
	  });


	  pose_listener = new ROSLIB.Topic ({
	    ros : ros,
	    name : "/move_base_simple/goal",
	    messageType : 'geometry_msgs/PoseStamped'
	  });

	  goal_status_listener = new ROSLIB.Topic ({
		ros : ros,
	    name : "/keylo_api/navigation/robot_pose",//"/move_base/status",
	    messageType : 'geometry_msgs/Pose2D'//'actionlib_msgs/GoalStatus'
	  });

	  move_base_goal_status_listener = new ROSLIB.Topic ({
		ros : ros,
	    name : "/move_base/status",
	    messageType : 'actionlib_msgs/GoalStatusArray'
	  });

	  speed_listener = new ROSLIB.Topic ({
		ros : ros,
		name :"/cmd_vel" ,
		messageType :'geometry_msgs/Twist' 
	  });

	  document.getElementById("outputFeedback").innerHTML="Currently in standby mode, waiting for instruction";
	  document.getElementById("mode").innerHTML="Operating mode: Autonomous";


function gotoLivingroom() {

	theX= 7.13;//5.87;//3.89; //1.596
    theY= 5.84;//; //5.02
    theZ= 1.48; //0.00
		   
 
           var d = new Date();
               var s = Math.floor(d.getTime() / 1000);
               var ns = d * 1000 - s * 1000000;
	       var gotomsg_sequence=0;
 
           var pose = {
               position: { x: theX, y: theY, z: 0.0 },
               orientation: { x: 0.0, y: 0.0, z: theZ, w: 2.0 }
           };
          
           var header = {
               seq: gotomsg_sequence++,
               stamp: {sec: s, nsec: ns},
               frame_id: "map"
           };
           //console.log(pose);
		   pose_listener.publish({ header, pose });

		
		// feedback if destination 1 is reached
	   goal_status_listener.subscribe(function(message){
		RposeX = message.x
		if (RposeX>=7.09 && RposeX<=7.17){
			//console.log(message.x);		
			document.getElementById("outputFeedback").innerHTML="Stopping because I'm currently in the living room";
		}
		else {
		document.getElementById("outputFeedback").innerHTML="On the way to the living room because I found a feasible path";
		}
	});

	move_base_goal_status_listener.subscribe(function(message){
		movebaseState = message.status_list[0].status;
		console.log(movebaseState);

		if (movebaseState==4 || movebaseState==5){
			document.getElementById("outputFeedback").innerHTML="Cannot get to the living room because I did not find a feasible path";
		}

	});
}


function gotoBedroom() {

	theX= 7.3;//5.92;//6.59;//5.92;//7.99;//1.01;
    theY= 10.63;//3.99;//3.31;//4.95; //4.82;
    theZ= 2.41;//-4.13; //2.15; //0.63;//0.97;

           var d = new Date();
               var s = Math.floor(d.getTime() / 1000);
               var ns = d * 1000 - s * 1000000;
	       var gotomsg_sequence=0;
 
           var pose = {
               position: { x: theX, y: theY, z: 0.0 },
               orientation: { x: 0.0, y: 0.0, z: theZ, w: 1.0 }
           };
          
           var header = {
               seq: gotomsg_sequence++,
               stamp: {sec: s, nsec: ns},
               frame_id: "map"
           };
           //console.log(pose);
           pose_listener.publish({ header, pose });

	   // feedback if destination 2 is reached (using pose)
	   goal_status_listener.subscribe(function(message){
		RposeX = message.x
		if (RposeX>=6.9 && RposeX<=7.7){
			//console.log(message.x);		
			document.getElementById("outputFeedback").innerHTML="Stopping because I'm currently in the bedroom";
		}

		else {
		document.getElementById("outputFeedback").value="On the way to the bedroom because I found a feasible path";
		}
	});	

	move_base_goal_status_listener.subscribe(function(message){
		movebaseState = message.status_list[0].status;
		console.log(movebaseState);

		if (movebaseState==4 || movebaseState==5){
			document.getElementById("outputFeedback").innerHTML="Cannot get to the living room because I did not find a feasible path";
		}

	});
}

function gotoDiningroom() {

	theX= 4.89;//5.87;//3.89; //1.596
	theY= 6.2;//; //5.02
	theZ= 1.84; //0.00	   
 
		   var d = new Date();
			   var s = Math.floor(d.getTime() / 1000);
			   var ns = d * 1000 - s * 1000000;
		   var gotomsg_sequence=0;
 
		   var pose = {
			   position: { x: theX, y: theY, z: 0.0 },
			   orientation: { x: 0.0, y: 0.0, z: theZ, w: 1.0 }
		   };
		  
		   var header = {
			   seq: gotomsg_sequence++,
			   stamp: {sec: s, nsec: ns},
			   frame_id: "map"
		   };
		   //console.log(pose);
		   pose_listener.publish({ header, pose });

		
		// feedback if destination 1 is reached
	   goal_status_listener.subscribe(function(message){
		RposeX = message.x
		if (RposeX>=4.85 && RposeX<=4.93){
			//console.log(message.x);		
			document.getElementById("outputFeedback").innerHTML="Stopping because I'm currently in the dining room";
		}
		else {
		document.getElementById("outputFeedback").innerHTML="On the way to the dining room because I found a feasible path";
		}
	});

	move_base_goal_status_listener.subscribe(function(message){
		movebaseState = message.status_list[0].status;
		console.log(movebaseState);

		if (movebaseState==4 || movebaseState==5){
			document.getElementById("outputFeedback").innerHTML="Cannot get to the living room because I didn't find a feasible path";
		}

	});
}


function gotoKitchen() {
	theX= 3.69;//5.87;//3.89; //1.596
	theY= 9.55;//; //5.02
	theZ= 1.61; //0.00
 
		   var d = new Date();
			   var s = Math.floor(d.getTime() / 1000);
			   var ns = d * 1000 - s * 1000000;
		   var gotomsg_sequence=0;
 
		   var pose = {
			   position: { x: theX, y: theY, z: 0.0 },
			   orientation: { x: 0.0, y: 0.0, z: theZ, w: 1.5 }
		   };
		  
		   var header = {
			   seq: gotomsg_sequence++,
			   stamp: {sec: s, nsec: ns},
			   frame_id: "map"
		   };
		   //console.log(pose);
		   pose_listener.publish({ header, pose });

		
		// feedback if destination 1 is reached
	   goal_status_listener.subscribe(function(message){
		RposeX = message.x
		if (RposeX>=3.65 && RposeX<=3.73){
			//console.log(message.x);		
			document.getElementById("outputFeedback").innerHTML="Stopping because I'm currently facing the kitchen";
		}
		else {
		document.getElementById("outputFeedback").innerHTML="On the way to the kitchen because I found a feasible path";
		}
	});

	move_base_goal_status_listener.subscribe(function(message){
		movebaseState = message.status_list[0].status;
		console.log(movebaseState);

		if (movebaseState==4 || movebaseState==5){
			document.getElementById("outputFeedback").innerHTML="Cannot get to the living room because I didn't find a feasible path";
		}

	});
}


function gotoCharging() {
	theX= 8.96;//5.87;//3.89; //1.596
	theY= 5.81;//; //5.02
	theZ= -0.06; //0.00
 
		   var d = new Date();
			   var s = Math.floor(d.getTime() / 1000);
			   var ns = d * 1000 - s * 1000000;
		   var gotomsg_sequence=0;
 
		   var pose = {
			   position: { x: theX, y: theY, z: 0.0 },
			   orientation: { x: 0.0, y: 0.0, z: theZ, w: 1.0 }
		   };
		  
		   var header = {
			   seq: gotomsg_sequence++,
			   stamp: {sec: s, nsec: ns},
			   frame_id: "map"
		   };
		   //console.log(pose);
		   pose_listener.publish({ header, pose });

		
		// feedback if destination 1 is reached
	   goal_status_listener.subscribe(function(message){
		RposeX = message.x
		if (RposeX>=8.9 && RposeX<=9.00){
			//console.log(message.x);		
			document.getElementById("outputFeedback").innerHTML="Stopping because I'm currently at my charging point";
		}
		else {
		document.getElementById("outputFeedback").innerHTML="On the way to charge because I found a feasible path";
		}
	});

	move_base_goal_status_listener.subscribe(function(message){
		movebaseState = message.status_list[0].status;
		console.log(movebaseState);

		if (movebaseState==4 || movebaseState==5){
			document.getElementById("outputFeedback").innerHTML="Cannot get to my chargingpt because I didn't find a feasible path";
		}

	});
}


function start(linear, angular){
	move(linear, angular);
	fireInterval = setInterval(move, fireRate, linear, angular);

}

// operating mode functions
function modeChangeToManual(){
	document.getElementById("mode").innerHTML="Operating mode: Switched to Manual mode";
}

function modeChangeToAuto(){
	document.getElementById("mode").innerHTML="Operating mode: Returned to Autonomous mode"
}

function stop(){
	clearInterval(fireInterval);
}
function move(linear, angular) {
	    var twist = new ROSLIB.Message({
	      linear: {
	        x: linear,
	        y: 0,
	        z: 0
	      },
	      angular: {
	        x: 0,
	        y: 0,
	        z: angular
	      }
	    });
	    cmd_vel_listener.publish(twist);
}

// handlers
fw = document.getElementById("up");
bw = document.getElementById("down");
left = document.getElementById("left");
right = document.getElementById("right");
stp = document.getElementById("stop");
livingroom = document.getElementById("livingroombtn");
bedroom = document.getElementById("bedroombtn");
diningroom = document.getElementById("diningroombtn");
kitchen = document.getElementById("kitchenbtn");
chargingpt = document.getElementById("chargingptbtn");
myVideo = document.getElementById("myVideocanvas");
//Rfeedback = document.getElementById("lblFeedback");

fw.addEventListener("mousedown", function(){start(0.15,0.0);},false);
fw.addEventListener("mousedown", modeChangeToManual);
fw.addEventListener("mouseup", modeChangeToAuto);
fw.addEventListener("mouseup", stop);
bw.addEventListener("mousedown", function(){start(-0.15,0.0);},false);
bw.addEventListener("mousedown", modeChangeToManual);
bw.addEventListener("mouseup", modeChangeToAuto);
bw.addEventListener("mouseup", stop);
left.addEventListener("mousedown", function(){start(0.0,0.2);},false);
left.addEventListener("mousedown", modeChangeToManual);
left.addEventListener("mouseup", modeChangeToAuto);
left.addEventListener("mouseup", stop);
right.addEventListener("mousedown", function(){start(0.0,-0.2);},false);
right.addEventListener("mousedown", modeChangeToManual);
right.addEventListener("mouseup", modeChangeToAuto);
right.addEventListener("mouseup", stop);
stp.addEventListener("mousedown", function(){start(0,0.0);},false);
stp.addEventListener("mousedown", modeChangeToManual);
stp.addEventListener("mouseup", modeChangeToAuto);
//stp.addEventListener("mouseup", stop);


livingroom.addEventListener("click", function(){gotoLivingroom();},false);
bedroom.addEventListener("click", function(){gotoBedroom();},false);
diningroom.addEventListener("click", function(){gotoDiningroom();},false);
kitchen.addEventListener("click", function(){gotoKitchen();},false);
chargingpt.addEventListener("click", function(){gotoCharging();},false);


window.setInterval(function(){
	bat_listener.subscribe(function(message){
		bat_state = message.data;
	});
	if(bat_state<=25){
		document.getElementById("b25").style.display = "block";
		document.getElementById("b50").style.display = "none";
		document.getElementById("b75").style.display = "none";
		document.getElementById("b100").style.display = "none";
	}
	else if(bat_state>25 && bat_state<50){
		document.getElementById("b25").style.display = "none";
		document.getElementById("b50").style.display = "block";
		document.getElementById("b75").style.display = "none";
		document.getElementById("b100").style.display = "none";
	}
	else if(bat_state>50 && bat_state<75){
		document.getElementById("b25").style.display = "none";
		document.getElementById("b50").style.display = "none";
		document.getElementById("b75").style.display = "block";
		document.getElementById("b100").style.display = "none";
	}
	else if(bat_state>75){
		document.getElementById("b25").style.display = "none";
		document.getElementById("b50").style.display = "none";
		document.getElementById("b75").style.display = "none";
		document.getElementById("b100").style.display = "block";
	}
},1000);

// speed display
speed_listener.subscribe(function(message){
	speedvalue = (message.linear.x+message.angular.z);
	//console.log(speedvalue);
	//document.getElementById("robotspeed").innerHTML=speedvalue;
});
if(speedvalue<=-0.05){
	speedmessage="low";
	document.getElementById("robotspeed").innerHTML="very low";
}
else if(speedvalue>-0.05 && speedvalue<=0.07){
	document.getElementById("robotspeed").innerHTML="low";
}
else if(speedvalue>0.07 && speedvalue<=0.6){
	document.getElementById("robotspeed").innerHTML="med";
}
else if(speedvalue>0.6){
	document.getElementById("robotspeed").innerHTML="high";
}
else{
	document.getElementById("robotspeed").innerHTML="stopped";
}

