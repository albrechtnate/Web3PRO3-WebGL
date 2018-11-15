# WebGL Instructional Guide

WebGL is a Javascript API that enables web developers to interact directly with the GPU. Using the WebGL API, developers can create interactive, immersive, and performant 2D and 3D graphics. WebGL is based on and maintainted by the same group that created OpenGl, an open source graphics library that is used in games, 3D modeling software, and CAD software.

My experimental project showcases these features by creating a textured 3D box that can be interacted with by the user.

[Visit my Experimental Project Demo](https://albrechtnate.github.io/Web3PRO3-WebGL/sandbox.html)

WebGL interfaces with the HTML canvas element to create static images that can be updated on every frame. As opposed to SVG, WebGL has no concept of a DOM or "objects", each frame that is drawn is simply a raster image. While this has some disadvantages (e.g. not automatically infinitely scalable like vector graphics) it enables very detailed and complex graphics to be drawn that would otherwise make the computer slow to a crawl if created with a technology like SVG.

[Add overview of how webgl works - how javascript interacts with the compiled glsl shader code on the gpu]

In this guide I will walk you through creating an untextured 3D box lit with a single directional light.
