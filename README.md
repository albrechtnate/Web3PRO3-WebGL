# WebGL Instructional Guide

## An Overview of WebGL

WebGL is a Javascript API that enables web developers to interact directly with the GPU. Using the WebGL API, developers can create interactive, immersive, and performant 2D and 3D graphics, complete with visual effects such as lighting, texturing, and shadows. WebGL is based on and maintainted by the same group that created OpenGL, an open source graphics library that is used in games, 3D modeling software, and CAD software.

My experimental project showcases these features by creating a textured 3D box that can be interacted with by the user.

[Visit my Experimental Project Demo](https://albrechtnate.github.io/Web3PRO3-WebGL/sandbox.html)

## Examples

Before getting started working with WebGL, check out some of my favorite example demos of the amazing stuff you can do *right in the browser* with WebGL
- [Infinitown](https://demos.littleworkshop.fr/infinitown)
- [Transmit Product Page](https://panic.com/transmit/): In many examples, the WebGL canvas fills the entire screen. This is a great example of WebGL being used as one part of a more traditional information webpage to simply enhance the user experience. The box truck becomes an interactive 3D element, but it might take a few seconds to kick in.
- [Real-time Raytracing](http://madebyevan.com/webgl-path-tracing/): Raytracing is a technique often used in the film CG community because it allows for renderings with very realistic shadows, indirect illumination, depth of field, reflections, refractions and the like.
- [glitch](http://ykob.github.io/sketch-threejs/sketch/glitch.html): WebGL isn’t just about rendering 3D object, it can also be used to simply add real-time effects to photos or videos
- [Google Earth](https://earth.google.com/web/@40.7410605,-73.9896986,64.9268077a,777.25097507d,35y,0h,45t,0r/data=ClYaVBJMCiUweDg5YzI1OWEzZjcxYzFmNjc6MHhkZTJhNjEyNWVkNzA0OTI2Gb_tCRLbXkRAIWj5yzhXf1LAKhFGbGF0aXJvbiBCdWlsZGluZxgCIAEoAigC)
- [Pinball](http://letsplay.ouigo.com/): A 3D pinball game, somewhat like the pinball game we all know and love from the Windows XP days

## How does WebGL Work?

WebGL interfaces with the HTML canvas element to create static images that can be updated on every frame. As opposed to SVG, WebGL has no concept of a DOM or “objects”, each frame that is drawn is simply a raster image. While this has some disadvantages (e.g. not automatically infinitely scalable like vector graphics) it enables very detailed and complex graphics to be drawn that would otherwise make the computer slow to a crawl if created with a technology like SVG.

Since WebGL allows you to communicate directly at a low-level with the graphics hardware, the code can seem pretty intense and overwhelming, but once you grasp the major concepts it becomes much easier to understand what is going on. Frameworks (such as [three.js](https://threejs.org)) exist that help abstract away some of this complexity and provide the boilerplate code that all WebGL projects require… but in this instructional guide we’ll just be working with the core technology.

The main components of any WebGL script are:
- Two bits of code called shaders. One shader handles vertices (points), called a vertex shader, and a second one called the fragment shader that determines what color to render the pixels of the screen based on the vertex data)
- A bit of code that creates what is called the program. This allows the shaders to actually be used by linking the shaders together (so the vertex shader’s output gets passed to the fragment shader).
- Code that creates the data (e.g. point coordinates)
- Code that sends the data to the GPU

The shaders aren’t actually written in Javascript… they are written in a language called GLSL (OpenGL Shader Language). This is a language that is more low-level than Javascript, syntactically similar to C. The GLSL shader code is then compiled into machine code that runs directly on the GPU. The primary function of the WebGL API then is to allow you to interact with that compiled code via Javascript. For example, you might create several variables in the shader code and then use Javascript to update those variables on the fly.

## Resources for Further Learning
Here are several video tutorials, websites, blog posts, and docs that will help you get started with WebGL if you are interested in learning more.
- https://developer.mozilla.org/en-US/docs/Learn/WebGL
- https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
- https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API
- https://webglfundamentals.org/
- https://www.tutorialspoint.com/webgl/
- https://www.pluralsight.com/blog/software-development/webgl-basics
- https://dev.opera.com/articles/introduction-to-webgl-part-1/
- http://learnwebgl.brown37.net/
- http://my2iu.blogspot.com/2011/11/webgl-pre-tutorial-part-2-drawing-2d.html
- http://www.webglacademy.com/
- https://aerotwist.com/tutorials/an-introduction-to-shaders-part-1/
- https://www.youtube.com/watch?v=kB0ZVUrI4Aw
- https://www.youtube.com/watch?v=XNbtwyWh9HA
- http://webglsamples.org/
- https://get.webgl.org/get-a-webgl-implementation/
- https://en.wikipedia.org/wiki/WebGL

## Follow Along Instructions

Let’s jump in and learn by interacting with some code.

In this guide I will walk you through creating a rotating white 3D box.

### Creating your Files and WebGL Prep

Start by creating a barebones HTML file and blank Javascript file. Link the Javascript file from the HTML. You can copy my HTML file which includes some optional styling.

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>WebGL Sandbox</title>
	<style>
		body {
			margin:0;
			height: 100vh;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: rgb(25,25,25);
		}
		canvas {
			width: 80%;
			height: 80vh;
		}
	</style>
</head>
<body>
	<script src="script.js"></script>
</body>
</html>
```

All drawing operations are done on a HTML canvas element, so we have to create that. Create this using Javascript, set the dimensions, and add it to the page. For my size, I’m creating the canvas element to be twice as large as it will actually be displayed (80% of the viewport), and then shrinking it using CSS so it appears nice and sharp on retina displays.

```javascript
var canvas = document.createElement('canvas');
canvas.width = (window.innerWidth*0.8)*2; // I multiply the canvas size by 2 and scale it down with CSS to effectively create a @2x graphic for my retina display
canvas.height = (window.innerHeight*0.8)*2;
document.body.appendChild(canvas);
```

### Initialize WebGL

Now that we have our files and our canvas element we are finally ready to start using the WebGL API. Lets’s initialize it.

```javascript
var gl = canvas.getContext('webgl');
```

All modern browsers support WebGL but some older ones do not, and others (like Edge) require you to use a different context name: “experimental-webgl”. Let’s add the fallback code now.

```javascript
if (!gl) {
	console.log('WebGL not supported, falling back on experimental-webgl');
	gl = canvas.getContext('experimental-webgl');
}

if (!gl) {
	alert('Your browser does not support WebGl');
}
```

### Shader Boilerplate Code

Let’s create the boilerplate code for our shaders now. We’ll circle back around to add in the actual GLSL code in a bit.

### Vertex Shader
All shaders are created by calling the `.createShader()` method on our WebGL canvas context and specifying in the type.
```javascript
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
```
Now we need to create the main part of the shader, the shader source. This is where the GLSL code will go. We will keep the actual source blank for now.
```javascript
gl.shaderSource(vertexShader, `
	// GLSL Code will go here
`);
```
Finally we need to call the `.compileShader()` method that actually converts are GLSL code into binary data that will run on the GPU. We should also catch any compiling errors and log them to the console for easier debugging.
```javascript
gl.compileShader(vertexShader);

if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
	return;
}
```

### Fragment Shader

The fragment shader is created in the exact same manner as the vertex shader. We’ll give it different variable names and pass in the fragment shader type when creating it.
```javascript
var framentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(framentShader, `
	// GLSL Code will go here
`);
gl.compileShader(framentShader);

if (!gl.getShaderParameter(framentShader, gl.COMPILE_STATUS)) {
	console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(framentShader));
	return;
}
```

## Creating the program and linking the shaders

Now that we have our shaders we need to link them together into a program so we can actually use them. You do that like this:
```javascript
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, framentShader);
gl.linkProgram(program);
```

Let’s also add some code here to throw errors if there were issues linking the shaders or validating the program. The check to validate the program can be harmful to performance, so it should only be run in you testing enviorment.
```javascript
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	console.error('ERROR linking program', gl.getProgramInfolog(program));
}

// DEBUG ENV ONLY - Validates the program and outputs any errors to the console
gl.validateProgram(program);
if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
	console.error('ERROR validating program', gl.getProgramInfolog(program));
}
```

## Using the program and creating the rendering loop
Now that we have our program, let’s tell WebGL to use it. You do that by calling:
```javascript
gl.useProgram(program);`.
```
We should also set up the loop that will make our canvas be redrawn on every frame. We do this performantly by calling `requestAnimationFrame()`. This function is empty now, but eventually we will do math and make our draw calls here.
```javascript
	var animate = function() {
		requestAnimationFrame(animate);
	}
	animate();
```

## Adding our vertice data
We have most of our boilerplate code in place now, so let’s actually create our cube now. The WebGL coordinate system has goes from -1 to 1 on each axis (Top = 1, Bottom = -1, Left= -1, Right = 1, Forwards = 1, Backwards = -1). We’ll use this system to define the corner vertices of our cube. To do this we have to create a matrice of vertice points—essentially an array that has "columns" and "rows". The concept of a matrix and its use can get very mathematical very quickly and is beyond the scope of this tutorial, but if you’re interested in learning more read the [Matrix Wikipedia page](https://en.wikipedia.org/wiki/Matrix_(mathematics)) for more information.

Feel free to copy and paste the following array of points. Each point of each plane of the box is defined on a new line/row. This means that we are defining the same corner point three times for each plane. We could probably optimize this, but I’ll save that challenge for you :)

The columns of our matrix are: X Coordinate, Y Coordinate, Z Coordinate, U Coordinate, V Coordinate
There are multiple ways to color the box, but in this case we will use those U and V points to do so. No need to understand the details of how this works now, but checkout the [UV Mapping Wikipedia page](https://en.wikipedia.org/wiki/UV_mapping) if interested.
Place this code right after you create and validate the program. (Before using the program)
```javascript
// List of X, Y, Z coordinates (model vertices) and U, V (used for texturing) for each corner point
var boxVertices = [
	// Top
	-1.00,  1.00, -1.00,	 0.00,  0.00,
	-1.00,  1.00,  1.00,	 0.00,  1.00,
	 1.00,  1.00,  1.00,	 1.00,  1.00,
	 1.00,  1.00, -1.00,	 1.00,  0.00,

	// Left
	-1.00,  1.00,  1.00,	 0.00,  0.00,
	-1.00, -1.00,  1.00,	 1.00,  0.00,
	-1.00, -1.00, -1.00,	 1.00,  1.00,
	-1.00,  1.00, -1.00,	 0.00,  1.00,

	// Right
	 1.00,  1.00,  1.00,	 1.00,  1.00,
	 1.00, -1.00,  1.00,	 0.00,  1.00,
	 1.00, -1.00, -1.00,	 0.00,  0.00,
	 1.00,  1.00, -1.00,	 1.00,  0.00,

	 // Front
	 1.00,  1.00,  1.00,	 1.00,  1.00,
	 1.00, -1.00,  1.00,	 1.00,  0.00,
	-1.00, -1.00,  1.00,	 0.00,  0.00,
	-1.00,  1.00,  1.00,	 0.00,  1.00,

	// Back
	 1.00,  1.00, -1.00,	 0.00,  0.00,
	 1.00, -1.00, -1.00,	 0.00,  1.00,
	-1.00, -1.00, -1.00,	 1.00,  1.00,
	-1.00,  1.00, -1.00,	 1.00,  0.00,

	// Bottom
	-1.00, -1.00, -1.00,	 1.00,  1.00,
	-1.00, -1.00,  1.00,	 1.00,  0.00,
	 1.00, -1.00,  1.00,	 0.00,  0.00,
	 1.00, -1.00, -1.00,	 0.00,  1.00,
];
```

Now that we have all our vertice points we have to “connect the dots” and form our planes.

Computers prefer to draw triangles rather than squares because 3 points are simpler than 4. With a triangle, all the points will always align into a single plane (called planar) whereas in squares/rectangles that is not a gurantee (called non-planar). As a result, we will “connect the dots” to form several of triangles. A square is split diagonally into two triangles, so when we render the scene the cube will look like its is made up of square planes even though it is really made up of 12 triangles.

We create the triangles by creating an indice array, somewhat similar to our matrix, each row of our indice defines a triangle. The numbers in the indice array refer to the rows in the vertice matrix.

Place this right after the vertice matrix.

```javascript
// Creates triangles by referring to the aforementioned vertices
var boxIndices = [
	// Top
	0, 1, 2,
	0, 2, 3,

	// Left
	5, 4, 6,
	6, 4, 7,

	// Right
	8, 9, 10,
	8, 10, 11,

	// Front
	13, 12, 14,
	15, 14, 12,

	// Back
	16, 17, 18,
	16, 18, 19,

	// Bottom
	21, 20, 22,
	22, 20, 23
];
```

## Creating our Shaders
Great! We now have the data that makes up our points. Now we need to tell our shaders what to do with that data.
Inside our vertex shader place this GLSL code:
```GLSL
precision mediump float;  // We tell the program how precisely we want to handle decimal numbers

attribute vec3 vertPosition;  // We’re going to input the XYZ vertice coordinates we defined for each point. Here we define a name for that data. Because there are 3 numbers (XYZ), we define it as a vec3, or three-dimensional vector.
attribute vec2 vertTexCoord;  // We do the same thing for the UV coordinates. An attribute is essentially a variable that is updated for each vertex.

varying vec2 fragTextCoord;  // A “varying” defines data we want to send to the fragment shader. Here we are defining a variable for our texture coordinate and defining its type as a 2 dimensional vector.

uniform mat4 mWorld; // Uniforms are like global variables that stay the same for the entire draw call.
uniform mat4 mView;  // We define these variables as a 4x4 matrix
uniform mat4 mProj;  // These matrices will allow us to do perspective, and move the “camera” and the “world”

void main() { // This is the required function in a shader
	fragTextCoord = vertTexCoord; // Just passing the texture coordinates on to the fragment shader

	gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}
```

Inside our fragment shader place this GLSL code:
```GLSL
precision mediump float;

varying vec2 fragTextCoord; // The input from the vertex shader

uniform sampler2D sampler;  // The sampler allows us to take samples from our 2D texture and apply them to a 3D object

void main() {
	vec4 texel = texture2D(sampler, fragTextCoord);

	gl_FragColor = vec4(texel);
}
```

## Sending Data from the CPU to the GPU Shaders

We have our compiled shaders and we have our data, now we need to send the data that is currently in RAM running on the CPU to the GPU. To do so we create buffers from our data arrays.

The following code should go after our data (the indices array):
First we create a buffer by calling `gl.createBuffer();`, then we tell WebGL that we want to bind some data to the buffer by calling `gl.bindBuffer()` and passing in the type and buffer object we created. Finally we actually bind the array of vertice data to the buffer by calling `gl.bufferData()` and passing in again the type, the array of data (formatted as a Float32Array) and tell WebGL we aren't going to update the data—that it is static.

Altogether this looks like:
```javascript
var boxVertexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
```

Do the same for the indices data:
```javascript
var boxIndexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);
```

Now that we have our buffers we need to link them to the variables in the GLSL code and tell the script how to handle the data. We do that by binding the buffer again. WebGL is a state machine, which means that the last buffer we’ve bound is the “active one” that we are performing other operations on (e.g. `bufferData()`).

```javascript
gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
```

Now we have to link the variable in the GLSL (called an attribute) to a javscript variable.
```javascript
var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
```

Finally we have to create an attribute pointer (determine which "columns" in our matrix should be sent to this attribute and describe the type of data being sent).
```javascript
gl.vertexAttribPointer(
	positionAttribLocation, // Attribute location
	3, // Number of elements per attribute (Which columns are we sending)
	gl.FLOAT, // Type of elements
	gl.FALSE, // Is the data normalized?
	5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex (How many total “columns”)
	0 // Offset from the beginning of a single vertex to this attribute
);
```

Then we enable the vertex attribute array: `gl.enableVertexAttribArray(positionAttribLocation);`

Do the same thing for the UV texture coordinates. Note that the size of an individual vertex stays the same, but the number of elements per attribute and offset differ.

```javascript
var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
gl.vertexAttribPointer(
	texCoordAttribLocation, // Attribute location
	2, // Number of elements per attribute,
	gl.FLOAT, // Type of elements
	gl.FALSE, // Is the data normalized?
	5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
);
gl.enableVertexAttribArray(texCoordAttribLocation);
```

## Creating our World, View, and Projection Matrices

When we created our shaders we created attributes called mWorld, mView, and mProj. Now we need to link those attributes to Javascript variables and create those matrices. All of this code should go right after `gl.useProgram(program);`

### Link the GLSL Attributes to Javascript Variables
```javascript
var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
```

### Creating the matrices

We’re going to use a third party library to create and perform the math operations on our matrices. Actually knowng what mathematical formulas are used to perform operations on matrices and how they do so isn’t neccessary. Just know that this is a low-level, fairly basic “helper script” to do a lot of the math for us.

Go ahead and [download the script (gl-matrix.js)](http://glmatrix.net/) and link to it before our own script in the HTML.

Now we call a number of methods on the mat4 object to do operations for us… such as creating empty 4x4 matrices.
```javascript
var worldMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();
```

Transform those empty matrices by calling more gl-matrix methods. You can look up the gl-matrix documentation for details on what these methods are doing.
```javascript
mat4.identity(worldMatrix);
mat4.lookAt(viewMatrix, [0, 0, 6], [0, 0, 0], [0, 1, 0]);
mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);
```

The projection and view matrices aren’t ever going to change during are demo, so let’s send the data to the GPU now.
```javascript
gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
```

## Getting something Onscreen

We finally have enough code to draw something to our screen!

Inside the `animate()` function and before calling `requestAnimationFrame()`, let’s send the world matrix data to the GPU: `gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);`

Now we can finally make out draw call: `gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);`

You should see a black square on the screen now! If not, check your console for errors, fix them, and try again.

A black square is cool and all… but it’s also kind of boring, so let’s make it rotate.

## Rotating the Cube

Right before the `animate()` function, let’s create some new matrices.
```javascript
var xRotationMatrix = mat4.create();
var yRotationMatrix = mat4.create();
var identityMatrix = mat4.create();
mat4.identity(identityMatrix);
```

Now immediately inside the `animate()` function at the top let’s get a rotation angle.
```javascript
angle = performance.now() / 1000 / 6 * 2 * Math.PI;
```
This line gets the number of milliseconds since the page loaded and then performs math on that number to create a angle in degrees. On every frame this angle value will change because `performance.now()` will return a larger number.

Below this, write these lines:
```javascript
mat4.rotateY(yRotationMatrix, identityMatrix, angle);
mat4.rotateX(xRotationMatrix, identityMatrix, angle / 4);
mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
```

This is where the gl-matrix.js script really shines and saves us from having to do a bunch of complicated math.

The cube should be rotating now!

## Painting the cube white

Finally, let’s make the cube white so it stands out from it’s background better.

Right before `gl.useProgram(program);`, create a new empty texture: `var boxTexture = gl.createTexture();`
The bind the texture—tell WebGL which texture we would like to manipulate. `gl.bindTexture(gl.TEXTURE_2D, boxTexture);`
Finally, let’s create a new texture that is just a single color. If you would like to change the color, you can modify the RGB values (0-255) in the Uint8Array.
```javascript
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]));
```

## Final touches
Congratulations! You have a spinning, flat white cube now! One final thing to add… it’s hard to notice now because all sides of the box are the exact same color, but WebGL isn’t respecting the fact that some planes are in front of/behind others. In other words… the back of your box could be in front of the front of your box! Additionally, we’re making the GPU do more work than necessary because it doesn’t need to calculate the points that will be hidden. Thankfully the fix for this is super simple. Right before your vertex shader add the following lines:
```javascript
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.frontFace(gl.CCW);
gl.cullFace(gl.BACK);
```

You’re all done now! I hope you learned something and had fun doing so. If you’d like to learn more, check out the other scripts in my repo, work through the resources listed above, or dissect some of those WebGL examples I listed.

Here is the full code for reference:
```javascript
(function() {

// 6 - Rotate a Lit and Textured Cube with Slanted Top

// Creates a canvas element, sets its size, and adds it to the DOM
var canvas = document.createElement('canvas');
canvas.width = (window.innerWidth*0.8)*2; // I multiply the canvas size by 2 and scale it down with CSS to effectively create a @2x graphic for my retina display
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

// // Flags that make the GPU:
// // 1. Render only the formost pixels (DEPTH TEST)
// // 2. Skip calculations for pixels that won’t be seen (CULL)
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.frontFace(gl.CCW);
gl.cullFace(gl.BACK);



// Begin Vertex Shader
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
	precision mediump float;

	attribute vec3 vertPosition;
	attribute vec2 vertTexCoord;

	varying vec2 fragTextCoord;

	uniform mat4 mWorld;
	uniform mat4 mView;
	uniform mat4 mProj;

	void main() {
		fragTextCoord = vertTexCoord;

		gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
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

	varying vec2 fragTextCoord;

	uniform sampler2D sampler;
	

	void main() {
		vec4 texel = texture2D(sampler, fragTextCoord);

		gl_FragColor = texel;
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



// Establish Variables for creating and rendering the model

// List of X, Y, Z coordinates (model vertices) and U, V (used for texturing) for each corner point
var boxVertices = [
	// Top
	-1.00,  1.00, -1.00,	 0.00,  0.00,
	-1.00,  1.00,  1.00,	 0.00,  1.00,
	 1.00,  1.00,  1.00,	 1.00,  1.00,
	 1.00,  1.00, -1.00,	 1.00,  0.00,

	// Left
	-1.00,  1.00,  1.00,	 0.00,  0.00,
	-1.00, -1.00,  1.00,	 1.00,  0.00,
	-1.00, -1.00, -1.00,	 1.00,  1.00,
	-1.00,  1.00, -1.00,	 0.00,  1.00,

	// Right
	 1.00,  1.00,  1.00,	 1.00,  1.00,
	 1.00, -1.00,  1.00,	 0.00,  1.00,
	 1.00, -1.00, -1.00,	 0.00,  0.00,
	 1.00,  1.00, -1.00,	 1.00,  0.00,

	 // Front
	 1.00,  1.00,  1.00,	 1.00,  1.00,
	 1.00, -1.00,  1.00,	 1.00,  0.00,
	-1.00, -1.00,  1.00,	 0.00,  0.00,
	-1.00,  1.00,  1.00,	 0.00,  1.00,

	// Back
	 1.00,  1.00, -1.00,	 0.00,  0.00,
	 1.00, -1.00, -1.00,	 0.00,  1.00,
	-1.00, -1.00, -1.00,	 1.00,  1.00,
	-1.00,  1.00, -1.00,	 1.00,  0.00,

	// Bottom
	-1.00, -1.00, -1.00,	 1.00,  1.00,
	-1.00, -1.00,  1.00,	 1.00,  0.00,
	 1.00, -1.00,  1.00,	 0.00,  0.00,
	 1.00, -1.00, -1.00,	 0.00,  1.00,
];

// Creates triangles by referring to the aforementioned vertices
var boxIndices = [
	// Top
	0, 1, 2,
	0, 2, 3,

	// Left
	5, 4, 6,
	6, 4, 7,

	// Right
	8, 9, 10,
	8, 10, 11,

	// Front
	13, 12, 14,
	15, 14, 12,

	// Back
	16, 17, 18,
	16, 18, 19,

	// Bottom
	21, 20, 22,
	22, 20, 23
];



// Send data from CPU memory to GPU memory
var boxVertexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

var boxIndexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
gl.vertexAttribPointer(
	positionAttribLocation, // Attribute location
	3, // Number of elements per attribute,
	gl.FLOAT, // Type of elements
	gl.FALSE, // Is the data normalized?
	5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	0 // Offset from the beginning of a single vertex to this attribute
);
gl.enableVertexAttribArray(positionAttribLocation);

var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
gl.vertexAttribPointer(
	texCoordAttribLocation, // Attribute location
	2, // Number of elements per attribute,
	gl.FLOAT, // Type of elements
	gl.FALSE, // Is the data normalized?
	5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
);
gl.enableVertexAttribArray(texCoordAttribLocation);

// // Get texture and send to GPU
var boxTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, boxTexture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE,
              new Uint8Array([255, 255, 255]));



// Create the matrixes that handle how the 3D objects are rendered into 3D space
gl.useProgram(program);
var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

var worldMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();

mat4.identity(worldMatrix);
mat4.lookAt(viewMatrix, [0, 0, 6], [0, 0, 0], [0, 1, 0]);
mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);

gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);



// Inititalizing variables for Main Render Loop
var xRotationMatrix = mat4.create();
var yRotationMatrix = mat4.create();
var identityMatrix = mat4.create();
mat4.identity(identityMatrix);



// Main Render Loop
var animate = function() {

	angle = performance.now() / 1000 / 6 * 2 * Math.PI;

	// Applies the transformations
	mat4.rotateY(yRotationMatrix, identityMatrix, angle);
	mat4.rotateX(xRotationMatrix, identityMatrix, angle / 4);
	mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);

	// Sends the updated matrix to the GPU
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

	// Actually performs the draw operation
	gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

	requestAnimationFrame(animate);
}
animate();
}());
```
