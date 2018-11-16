// Code written while following tutorial at:
// https://www.youtube.com/watch?v=XNbtwyWh9HA

// Creates a canvas element, sets its size, and adds it to the DOM
var canvas = document.createElement('canvas');
canvas.width = window.innerWidth*0.8;
canvas.height = window.innerHeight*0.8;
document.body.appendChild(canvas);

// Whenever working with canvas you are required to set what "mode" it should operate it
// Possible options are '2d', 'webgl', 'webgl2', and 'bitmaprenderer'.
// Each context/mode uses a different API and exposes differnt levels of functionality
var gl = canvas.getContext('webgl');

// Sets the background to black
// First you have to set what the color is (rgba)
gl.clearColor(0, 0, 0, 1);
// Then you can call the method to actually fill the background with that color
gl.clear(gl.COLOR_BUFFER_BIT);

// To draw things in WebGL you need a shader program. A shader program dictates where to put things and what color.
// Shaders are not written in Javascript, they are written in GLSL (OpenGL Shading Language)
// This shader helps us position things in the right places
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, [
	'attribute vec2 position;',
	'void main() {',
		'gl_Position = vec4(position, 0.0, 1.0);',
	'}'
].join('\n'));
// Compiles the GLSL shader into binary data
gl.compileShader(vertexShader);

// Shader to determine the color
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, [
	'precision highp float;',
	'uniform vec4 color;',
	'void main() {',
		'gl_FragColor = color;',
	'}'
].join('\n'));
gl.compileShader(fragmentShader);

// A program combines two compiled WebGLShaders (a vertex shader and a fragment shader) into something we can actually use when drawing
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// The vertices (x and y coordinates) of the shape we want to create
// -1, -1 is bottom left. 1, 1 is top right.
var vertices = new Float32Array([
	-0.5,-0.5,
	0.5,-0.5,
	0.0,0.5
]);

// You need to turn the vertices array into a buffer so it can be used by WebGL
var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Use the progream that we created above to do the drawing
gl.useProgram(program);

// “Find” the color attribute defined in the GLSL code of the program and set it
program.color = gl.getUniformLocation(program, 'color');
gl.uniform4fv(program.color, [0, 1, 0, 1.0]);

// “Find” the position attribute defined in the GLSL code of the program, tell WebGl that its a Vertex array
program.position = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(program.position);
// Set the pointer: The program, 2 because the vertices are pairs of 2 (2D), they are floats, normalize, stride, offset
gl.vertexAttribPointer(program.position, 2, gl.FLOAT, false, 0, 0);

// Finally execute the draw opertation
gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);