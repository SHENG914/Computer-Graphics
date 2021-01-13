"use strict";

var canvas;
var gl;
var i=0;
var theta = 0.0;
var thetaLoc;
var direction = 1;
var speed = 50;
function changeDir(){
	direction *= -1;
}
function stop(){
	i=direction;
	direction*=0;
}
function star(){
	direction=i;
}
function initRotSquare(){
	canvas = document.getElementById( "triangle-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	//Nine Vertices
	var vertices = [
		 0.0,  1.0,
		 0.5,  0.5,
		-0.5,  0.5,
		 0.0,  0.5,
		 1.0,  0.0,
		-1.0,  0.0,
		-0.3, -1.0,
		 0.3, -1.0,
		 0.3,  0.0,
        -0.3,  0.0,
         0.3,  0.0,
        -0.3, -1.0
	];

	// Configure WebGL
	gl.viewport( 0, 0, canvas.width, canvas.height);
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// Load shaders and initialize attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	// Associate external shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	thetaLoc = gl.getUniformLocation(program,"theta");
	document.getElementById( "speedcon" ).onchange = function( event ){
		speed = 300 - event.target.value;
	}
	render();
}

function render(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	theta += direction * 0.1;
	gl.uniform1f( thetaLoc, theta );
	gl.drawArrays( gl.TRIANGLES, 0, 12);
	setTimeout( function(){ requestAnimFrame( render ); }, speed );

}