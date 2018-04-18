---
layout: default
---
# Flashlight
This sketch makes use of pixel manipulation. [See live sketch](sketch.md)
![Flashlight](./images/flashlight_p5js.png)

# Tecniques
Techniques: P5JS, noise, average brightness. Landscape recommended on mobile devices.

# Credits
Harbor pictures by [Andre Vicentini](http://www.andrevicentini.eu/). Still from moview "The Shining": most likely a copyright infringement.


# Code
First use `loadImage()` inside `preload()`:
```javascript
   capturePixels = loadImage("../media/" + imgNumber + ".jpg");
```

