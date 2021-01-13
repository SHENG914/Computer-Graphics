"use strict";

const { vec4 } = glMatrix;

var canvas;
var gl;

var index;
var edges;

var triangleIndex = 0;
var Tmove = [];
var squareIndex = 0;
var Smove = [];
var cubeIndex = 0;
var Cmove = [];
var circleIndex = 0;

var Rmove = [];
var rRmove = [];
var circleVertex = [];
var circleColors = [];

var theta = 0.0;
var volume = 0.0;

var distanceLoc;
var volumeLoc;
var thetaLoc;

var points = [
   -0.5, -0.5, 0.0,
	0.0, 0.5, 0.0,
	0.5, -0.5, 0.0,	
//三角形
    0.0, 0.2, 0.0, 
   -0.2, 0.0, 0.0,
    0.2, 0.0, 0.0,
    0.0, -0.2, 0.0,
//正方形
];
var colors = [
    0.0, 0.0, 1.0, 0.5, 
	0.0, 0.0, 1.0, 0.5,
	0.0, 0.0, 1.0, 0.5,
//三角形
    0.0, 1.0, 0.0, 0.5,
    0.0, 1.0, 0.0, 0.5,
    0.0, 1.0, 0.0, 0.5,
    0.0, 1.0, 0.0, 0.5
//正方形
];


window.onload = function initWindow(){
	var graph = document.getElementById("graph");
	for(var i=0;i<graph.length;i++){
		if(graph[i].selected){
			console.log(i);
			index = i;
			break;
		}
	}
	
	edges = document.getElementById("edges").value * 3;
    canvas = document.getElementById("lab4-canvas");
    
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
	    alert("WebGL isn't available");
	}
	
	makeCube();
	
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.0, 0.0, 0.2, 0.2);
	
	gl.enable(gl.DEPTH_TEST);
	
	var program = initShaders(gl, "rtvshader", "rtfshader");
    gl.useProgram(program);
    
	thetaLoc = gl.getUniformLocation(program, "theta");
	volumeLoc = gl.getUniformLocation(program, "volume");
	distanceLoc = gl.getUniformLocation(program, "distance");
	reBuffer();
	function reBuffer(){
        var cBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors.concat(circleColors)), gl.STATIC_DRAW);
        
        var vColor = gl.getAttribLocation(program, "vColor");
		gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);	
        
        var vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.concat(circleVertex)), gl.STATIC_DRAW);
		
		var vPosition = gl.getAttribLocation(program, "vPosition");
		gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);	
			
	}
	
	document.getElementById("graph").onchange = function(event){
		var id = parseInt(event.target.value);
		switch(id){
		  case 0:
			index = 0;
			break;
		  case 1:
			index = 1;
			break;
		  case 2:
			index = 2;
			break;  
		  case 3:
			index = 3;
			break;
		}
	};
	
    canvas.addEventListener("mousedown", function(event){
	    var rect = canvas.getBoundingClientRect();
	    var cx = event.clientX - rect.left;
	    var cy = event.clientY - rect.top;
	    var NCx = 2 * cx / canvas.width - 1;
	    var NCy = 2 * (canvas.height - cy) / canvas.height - 1;
	    if(index == 0){
		    triangleCreate(NCx, NCy);	
	    }else if(index == 1){
		    squareCreate(NCx, NCy);
	    }else if(index == 2){
		    cubeCreate(NCx, NCy);
	    }else if(index == 3){
		    Rmove.push([NCx, NCy]);
	    	rRmove.push([NCx, NCy]);
		    circleCreate();
    	}
    });
	
    document.getElementById("clear").onclick = function(){
        triangleIndex = 0;
         Tmove = [];
        squareIndex = 0;
        Smove = [];
        cubeIndex = 0;
        Cmove = [];
        circleIndex = 0;
        Rmove = [];
	    rRmove = [];
    };
	
    document.getElementById("edges").onchange = function(){
	    edges = document.getElementById("edges").value * 3;
	    circleIndex--;
	    circleCreate();
    }
	
    render();

    function triangleCreate(x, y){
	    Tmove.push([x, y]);
	    triangleIndex++;
    }
	
    function squareCreate(x, y){
	    Smove.push([x, y]);
	    squareIndex++;
    }

    function cubeCreate(x, y){
	    Cmove.push([x, y]);
	    cubeIndex++;
    }
	
    function circleCreate(){
	    circleIndex++;
	    circleVertex = [];
	    circleColors = [];
	    var alpha = 2 * Math.PI / edges;
	    circleVertex.push(0.0, 0.0, 0.0);
	    circleColors.push(0.0, 0.5, 1.0, 0.5);
	    for(var i=0;i<=edges;i++){
	    	circleVertex.push(0.2 * Math.cos(Math.PI-alpha*i), 0.2 * Math.sin(Math.PI-alpha*i), 0.0);
	    	circleColors.push(0.0, 0.5, 1.0, 0.5);
    	}
    	reBuffer();
    }
}
function makeCube(){
	var vertices = [
		glMatrix.vec4.fromValues(-0.2, -0.2, 0.2, 1.0),
        glMatrix.vec4.fromValues(-0.2, 0.2, 0.2, 1.0),
        glMatrix.vec4.fromValues(0.2, 0.2, 0.2, 1.0),
        glMatrix.vec4.fromValues(0.2, -0.2, 0.2, 1.0),
        glMatrix.vec4.fromValues(-0.2, -0.2, -0.2, 1.0),
        glMatrix.vec4.fromValues(-0.2, 0.2, -0.2, 1.0),
        glMatrix.vec4.fromValues(0.2, 0.2, -0.2, 1.0),
        glMatrix.vec4.fromValues(0.2, -0.2, -0.2, 1.0),
	];
	
	var vertexColors = [
		glMatrix.vec4.fromValues(0.5, 0.0, 0.5, 1.0),
        glMatrix.vec4.fromValues(1.0, 0.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 1.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(0.0, 0.0, 1.0, 0.5),
        glMatrix.vec4.fromValues(0.0, 1.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 0.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 0.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 0.0, 1.0, 1.0)
	];
	
	var faces = [
		1, 0, 3,
		1, 3, 2, //正
		2, 3, 7, 
		2, 7, 6, //右
		3, 0, 4, 
		3, 4, 7, //底
		6, 5, 1, 
		6, 1, 2, //顶
		4, 5, 6, 
		4, 6, 7, //背
		5, 4, 0, 
		5, 0, 1  //左
	];

	for (var i = 0; i < faces.length; i++) {
		points.push(vertices[faces[i]][0], vertices[faces[i]][1], vertices[faces[i]][2]);
		colors.push(vertexColors[Math.floor(i / 6)][0], vertexColors[Math.floor(i / 6)][1], vertexColors[Math.floor(i / 6)][2], vertexColors[Math.floor(i / 6)][3]);
	}	
}

function triangleRender(){
	volume -= 0.01;
	if(volume < -0.5) volume= 0.0;
	gl.uniform2fv(volumeLoc, [volume, volume]);
	gl.uniform2fv(thetaLoc, [0.0, 0.0]);
	for(var i=0;i<triangleIndex;i++){
		gl.uniform2fv(distanceLoc, Tmove[i]);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}	
}

function squareRender(){
	theta += 0.1;
	if(theta>2 * Math.PI)
		theta -= (2 * Math.PI);
	gl.uniform2fv(thetaLoc, [0.0, theta]);
	gl.uniform2fv(volumeLoc, [0.0, 0.0]);
	for(var i=0;i<squareIndex;i++){
		gl.uniform2fv(distanceLoc, Smove[i]);
		gl.drawArrays(gl.TRIANGLE_STRIP, 3, 4);
	}
}

function cubeRender(){
	theta += 0.02;
	gl.uniform2fv(thetaLoc, [theta, theta]);
	gl.uniform2fv(volumeLoc, [0.0, 0.0]);
	for(var i=0;i<cubeIndex;i++){
		gl.uniform2fv(distanceLoc, Cmove[i]);
		gl.drawArrays(gl.TRIANGLES, 7, 36);
	}
}

function circleRender(){
	gl.uniform2fv(thetaLoc, [0.0, 0.0]);
	gl.uniform2fv(volumeLoc, [0.0, 0.0]);
	for(var i=0;i<circleIndex;i++){
		rRmove[i][0] += Math.random()/10 - 0.05;
		rRmove[i][1] += Math.random()/10 - 0.05;		
		if(rRmove[i][0] > 1 || rRmove[i][0] < -1 || rRmove[i][1] > 1 || rRmove[i][1] < -1){
			rRmove[i][0] -= rRmove[i][0]/5;
			rRmove[i][1] -= rRmove[i][1]/5;
		}
		gl.uniform2fv(distanceLoc, rRmove[i]);
		gl.drawArrays(gl.TRIANGLE_FAN, 43, edges+2);
	}
}

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	triangleRender();
	squareRender();
	cubeRender();
	circleRender();
	requestAnimFrame(render);
}


