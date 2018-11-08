(function() {

// The job of the vertex shader is to take the vertex points in 3D space
// and translate them into 2D screen space.

// Creates a canvas element, sets its size, and adds it to the DOM
var canvas = document.createElement('canvas');
canvas.width = (window.innerWidth*0.8)*2;
canvas.height = (window.innerHeight*0.8)*2;
document.body.appendChild(canvas);

var gl = canvas.getContext('webgl');

// Some browsers, like Edge, require the contexts to have the 'experimental-' prefix
if (!gl) {
	console.log('WebGL not supported, falling back on experimental-webgl');
	gl = canvas.getContext('experimental-webgl');
}

// If the browser does not support WebGL at all
if (!gl) {
	alert('Your browser does not support WebGl');
}

// Clear the canvas with a new background color
gl.clearColor(0.75, 0.85, 0.8, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// Begin Vertex Shader
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
	precision mediump float;

	attribute vec2 vertPosition;
	attribute vec3 vertColor;
	varying vec3 fragColor;

	void main() {
		fragColor = vertColor;
		gl_Position = vec4(vertPosition, 0.0, 1.0);
	}
`);
gl.compileShader(vertexShader);

// Outputs any vertex shader compile errors to the console
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
	return;
}
// End Vertex Shader

// Begin Fragment Shader
var framentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(framentShader, `
	precision mediump float;

	varying vec3 fragColor;
	void main() {
		gl_FragColor = vec4(fragColor, 1.0);
	}
`);
gl.compileShader(framentShader);

// Outputs any fragment shader compile errors to the console
if (!gl.getShaderParameter(framentShader, gl.COMPILE_STATUS)) {
	console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(framentShader));
	return;
}
// End Fragment Shader

// Begin Program
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, framentShader);
gl.linkProgram(program);

// Outputs any program linking errors to the console
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	console.error('ERROR linking program', gl.getProgramInfolog(program));
}

// DEBUG ENV ONLY - Validates the program and outputs any errors to the console
gl.validateProgram(program);
if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
	console.error('ERROR validating program', gl.getProgramInfolog(program));
}
// End Program

// Create Buffer

// List of X, Y coordinates    R, G, B
var triangleVertices = [
	0.0, 0.5,       1.0, 1.0, 0.0,
	-0.5, -0.5,     0.7, 0.0, 1.0,
	0.5, -0.5,      0.1, 1.0, 0.6
];

// Sending the coordinate data from the CPU memory to the GPU memory
var triangleVertexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
gl.vertexAttribPointer(
	positionAttribLocation, // Attribute location
	2, // Number of elements per attribute,
	gl.FLOAT, // Type of elements
	gl.FALSE, // Is the data normalized?
	5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	0 // Offset from the beginning of a single vertex to this attribute
);
gl.enableVertexAttribArray(positionAttribLocation);


var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
gl.vertexAttribPointer(
	colorAttribLocation, // Attribute location
	3, // Number of elements per attribute,
	gl.FLOAT, // Type of elements
	gl.FALSE, // Is the data normalized?
	5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
);
gl.enableVertexAttribArray(colorAttribLocation);

// Draw the triangle to the screen
gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);
}());