---
layout: default
title: Sunflower (Phyllotaxis with Processing)
permalink: "/PSunflower/index.html"
---
# Phyllotaxis
This animation is based on [Daniel Shiffman tutorial on phyllotaxis](https://www.youtube.com/watch?v=KWoJgHFYWxY&feature=youtu.be). 

I modified the original code to mask a background image, and to change the parameters for the so-called _divergence angle_ (according to mouse X position), and the size of the initial "seed".

# Examples

| C | Divergence angle | Example |
|:----:|:-------:|:--------:|
|8.92|-14.24|![example](./images/example1.jpg?s=500)|
|5.67|-41.42|![example 2](./images/example2.jpg?s=500)|
|8.93|162.70|![example 3](./images/example3.jpg?s=500)|




# The Shining
Here I used again the still from the movie The Shining as the background, and created several images, varying the parameter `c` from 4 to 12, and finally uploading the images to [Giphy](https://giphy.com/).

![gif](./images/giphy.gif)


# How to run
Open `PSunflower.pde` in Processing. To play with other images, add them to the `data` folder and change the code with `loadImage()`:
```java
  img = loadImage("model_1.png");
```
Use keyboard arrows to adjust the two main parameters of this composition:  
<kbd>LEFT</kbd>, <kbd>RIGHT</kbd>: Decreases/increases the size of the initial seeds  
<kbd>DOWN</kbd>,<kbd>UP</kbd>: Decreases/increases the divergence angle (angle_0) 
