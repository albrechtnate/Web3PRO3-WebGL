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

In this guide I will walk you through creating an untextured 3D box lit with a single directional light.

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
Now that we have our program, lets tell WebGL to use it. You do that by calling `gl.useProgram(program);`.
We should also set up the loop that will make our canvas be redrawn on every frame. We do this performantly by calling `requestAnimationFrame()`. This function is empty now, but eventually we will do math and make our draw calls here.
```javascript
	var animate = function() {
		requestAnimationFrame(animate);
	}
	animate();
```
