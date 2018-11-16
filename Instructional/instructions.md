# WebGL Instructional Guide

## An Overview of WebGL

WebGL is a Javascript API that enables web developers to interact directly with the GPU. Using the WebGL API, developers can create interactive, immersive, and performant 2D and 3D graphics, complete with visual effects such as lighting, texturing, and shadows. WebGL is based on and maintainted by the same group that created OpenGl, an open source graphics library that is used in games, 3D modeling software, and CAD software.

My experimental project showcases these features by creating a textured 3D box that can be interacted with by the user.

[Visit my Experimental Project Demo](https://albrechtnate.github.io/Web3PRO3-WebGL/sandbox.html)

## Examples

Before getting started working with WebGL, check out some of my favorite example demos of the amazing stuff you can do *right in the browser* with WebGL
- [Infinitown](https://demos.littleworkshop.fr/infinitown)
- [Transmit Product Page](https://panic.com/transmit/): In many examples, the WebGL canvas fills the entire screen. This is a great example of WebGL being used as one part of a more traditional information webpage to simply enhance the user experience.
- [Real-time Raytracing](http://madebyevan.com/webgl-path-tracing/): Raytracing is a technique often used in the film CG community because it allows for renderings with very realistic shadows, indirect illumination, depth of field, reflections, refractions and the like.
- [glitch](http://ykob.github.io/sketch-threejs/sketch/glitch.html): WebGL isn’t just about rendering 3D object, it can also be used to simply add real-time effects to photos or videos
- [Google Earth](https://earth.google.com/web/@40.7410605,-73.9896986,64.9268077a,777.25097507d,35y,0h,45t,0r/data=ClYaVBJMCiUweDg5YzI1OWEzZjcxYzFmNjc6MHhkZTJhNjEyNWVkNzA0OTI2Gb_tCRLbXkRAIWj5yzhXf1LAKhFGbGF0aXJvbiBCdWlsZGluZxgCIAEoAigC)
- [Pinball](http://letsplay.ouigo.com/): A 3D pinball game, somewhat like the pinball game we all know and love from the Windows XP days

## How does WebGL Work?

WebGL interfaces with the HTML canvas element to create static images that can be updated on every frame. As opposed to SVG, WebGL has no concept of a DOM or "objects", each frame that is drawn is simply a raster image. While this has some disadvantages (e.g. not automatically infinitely scalable like vector graphics) it enables very detailed and complex graphics to be drawn that would otherwise make the computer slow to a crawl if created with a technology like SVG.

Since WebGL allows you to communicate directly at a low-level with the graphics hardware, the code can seem pretty intense and overwhelming, but once you grasp the major concepts it becomes much easier to understand what is going on. Frameworks (such as [three.js](https://threejs.org)) exist that help abstract away some of this complexity and provide the boilerplate code that all WebGL projects require… but in this instructional guide we’ll just be working with the core technology.

The main components of any WebGl are:
- Two bits of code called shaders. One shader handles vertices (points), called a vertex shader, and a second one called the fragment shader that determines what color to render the pixels of the screen based on the vertice data)
- A bit of code that creates what is called the program. This allows the shaders to actually be used by linking the shaders together (so the vertex shader’s output gets passed to the fragment shader).
- Code that creates the data (e.g. point coordinates)
- Code that sends the data to the GPU

The shaders aren’t actually written in Javascript… they are written in a language called GLSL (OpenGL Shader Language). This is a language that is more low-level than Javascript, syntaically similar to C. The GLSL shader code is then compiled into machine code that runs directly on the GPU. The primary function of the WebGL API then is to allow you to interact with that compiled code via Javascript. For example, you might create several variables in the shader code and then use Javascript to update those variables on the fly.

## Resources for Further Learning
[Browse a list of addtional resources](https://github.com/albrechtnate/Web3PRO3-WebGL/blob/dev/README.md) for futher learning. Included in the lsit are video tutorials, blog posts, docs, and more.

## Follow Along Instructions

Let’s jump in and try to learn on the fly by interacting with some code…

In this guide I will walk you through creating an untextured 3D box lit with a single directional light.