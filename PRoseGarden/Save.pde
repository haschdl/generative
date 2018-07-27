/*
 * Function for saving the generated image into a file when you press "S" or "B" key. 
 * Files will be saved to /out folder, with name: [Sketch name]_[Timestamp].jpg
 * 
 * It works in two ways:
 *    1. S key (BASIC) 
 *       If you press the S key ("Save"), it will save the contents of the screen. 
 *       The image is saved in the same resolution as your sketch size. In other words, 
 *       the image will have the same size as  "height" by "width" pixels.
 *        
 *    2. B key (ADVANCED)
 If you press the B key (for "Buffer"), it will save the contents of an offscreen 
 *       buffer (a PGraphics object). The image will have the size of the buffer, which
 *       you defined during `buffer = createGraphics(bufferWidth,bufferHeight).` 
 *       
 *       For B command, the code looks for a PGraphics variable called "buffer" (which
 *       is the "standard" I use); if it cannot find "buffer", it looks for the first variable
 *       of type PGraphics, regardless of name.  This overengineered way is meant not to break
 *       the sketch if there is no "buffer" variable - likely there are simpler ways to achieve 
 *       the same.
 * 
 * Version: 27.07.2018
 */

import java.text.SimpleDateFormat;  
import java.util.Date;  
import java.util.*;
import java.lang.reflect.Field;


PGraphics bufferToSave;

void keyPressed() {
  String sketchName = this.getClass().getName();
  SimpleDateFormat formatter = new SimpleDateFormat("YYYYMMDD_HHmmss");  
  Date date = new Date();

  String fileName = String.format("/out/%s_%s", sketchName, formatter.format(date));

  if (key == 'S' || key == 's') {
    fileName += ".jpg";
    saveTo(null, fileName);
  } else if (key== 'B' || key == 'b') {
    bufferToSave = getBuffer();
    fileName += ".tiff";
    saveTo(bufferToSave, fileName);
  }
}

void saveTo(PGraphics source, String fileName) {
  if (source != null) {
    buffer.save(fileName);
    println(String.format("Contents of buffer saved to %s", fileName));
  } else {
    ((PApplet)this).save(fileName);
    println(String.format("Contents of screen saved to %s", fileName));
  }
}


/**
 *
 * Returns the first instance of PGraphics found in the sketch, in no particular order.
 *
 */
PGraphics getBuffer() {
  //looking for a variable called "buffer"
  try {
    Field bufferField = this.getClass().getField("buffers");
    if (bufferField != null)
      return (PGraphics)bufferField.get(this);
  }
  catch(NoSuchFieldException ex) {
  }

  catch ( IllegalAccessException ex ) {
    System.out.println(ex);
  }

  //if "buffer" not found, then look for first instance of PGraphics
  Field[] fields = this.getClass().getDeclaredFields();

  //print field names paired with their values
  for ( Field field : fields  ) {      
    try {
      if (field.getType().getName().contains("PGraphics")) {        
        return (PGraphics)field.get(this);
      }
    }
    catch ( IllegalAccessException ex ) {
      System.out.println(ex);
    }
  }
  return null;
}
