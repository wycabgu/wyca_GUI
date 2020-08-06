var toggleBtn, backview, fw, bw, left, right, stp;
var fireRate = 100, fireInterval=null;
var bat_state;
var locate1, locate2;
var theX=0, theY=0, theZ=0;
var Rfeedback;
var RposeX;
var movebaseState;
var myVideo;
var speedvalue = 0.1;
var speedmessage;



	var ros = new ROSLIB.Ros({
		//url : 'ws://132.73.207.247:9090'
		url : 'ws://172.16.176.19:9090'
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


function gotoPose1() {

	theX= 5.87;//3.89; //1.596
    theY= 7.9; //5.02
    theZ= 3.08; //0.00
		   
 
           var d = new Date();
               var s = Math.floor(d.getTime() / 1000);
               var ns = d * 1000 - s * 1000000;
	       var gotomsg_sequence=0;
 
           var pose = {
               position: { x: theX, y: theY, z: 0.0 },
               orientation: { x: 0.0, y: 0.0, z: theZ, w: 0.0 }
           };
          
           var header = {
               seq: gotomsg_sequence++,
               stamp: {sec: s, nsec: ns},
               frame_id: "map"
           };
           console.log(pose);
           pose_listener.publish({ header, pose });

		
		// feedback if destination 1 is reached
	   goal_status_listener.subscribe(function(message){
		RposeX = message.x
		if (RposeX>=5.83 && RposeX<=5.92){
			console.log(message.x);		
			document.getElementById("outputFeedback").innerHTML="Currently in the destination requested";
		}
		else {
		document.getElementById("outputFeedback").innerHTML="On the way to the requested destination";
		}
	});
}


function gotoPose2() {

	theX= 5.92;//6.59;//5.92;//7.99;//1.01;
    theY= 3.99;//3.31;//4.95; //4.82;
    theZ= -4.13; //2.15; //0.63;//0.97;



 
           var d = new Date();
               var s = Math.floor(d.getTime() / 1000);
               var ns = d * 1000 - s * 1000000;
	       var gotomsg_sequence=0;
 
           var pose = {
               position: { x: theX, y: theY, z: 0.0 },
               orientation: { x: 0.0, y: 0.0, z: theZ, w: 3.0 }
           };
          
           var header = {
               seq: gotomsg_sequence++,
               stamp: {sec: s, nsec: ns},
               frame_id: "map"
           };
           console.log(pose);
           pose_listener.publish({ header, pose });

	   // feedback if destination 2 is reached (using pose)
	   goal_status_listener.subscribe(function(message){
		RposeX = message.x
		if (RposeX>=7.94 && RposeX<=8.05){
			console.log(message.x);		
			document.getElementById("outputFeedback").innerHTML="Location1 reached";
			document.getElementById("outputFeedback").innerHTML="On the way to destination you requested";
		}

		else {
		document.getElementById("lblFeedback").value="Feeback from robot";
		}
	});

	// feedback if destination 2 is reached (using move_base_goal)
	/*
	    move_base_goal_status_listener.subscribe(function(message){
		movebaseState = message.status_list[0].status;
		console.log(movebaseState);

		if (movebaseState==3){	
			document.getElementById("lblFeedback").value="Location2 reached";
		}

    		else if (movebaseState==1){
		document.getElementById("lblFeedback").value="Mission accepted, going ...";
		}

		else {
		document.getElementById("lblFeedback").value="";
		}
	});*/
	
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
locate1 = document.getElementById("locationbtn1");
locate2 = document.getElementById("locationbtn2");
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
stp.addEventListener("mouseup", stop);


locate1.addEventListener("click", function(){gotoPose1();},false);
locate2.addEventListener("click", function(){gotoPose2();},false);


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
	console.log(speedvalue);
	//document.getElementById("robotspeed").innerHTML=speedvalue;
});
if(speedvalue<=0.1){
	speedmessage="low";
	console.log(speedmessage);
	document.getElementById("robotspeed").innerHTML="low";
}
else if(speedvalue>0.1 && speedvalue<=0.4){
	document.getElementById("robotspeed").innerHTML="med";
}
else if(speedvalue>0.4){
	document.getElementById("robotspeed").innerHTML="high";
}
else{
	document.getElementById("robotspeed").innerHTML="stopped";
}

