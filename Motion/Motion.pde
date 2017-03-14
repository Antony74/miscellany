
import java.io.FileWriter;

FileWriter csvFile;

void setup() {
  noLoop();

  try {
    csvFile = new FileWriter(sketchPath() + "/log.csv");
  } catch (IOException e) {
  }

  writeln("Filename,Time,Score");

  int nFrame = 1;
  PImage last = null;
  
  while(true) {
  
    // Figure out time
    int nTime = nFrame - 1;
    int nSeconds = nTime % 60;
    int nMinutes = (nTime / 60) % 60;
    int nHours = nTime / 3600;
    String sSeconds = pad((new Integer(nSeconds)).toString(), 2);
    String sMinutes = pad((new Integer(nMinutes)).toString(), 2);
    String sHours   = pad((new Integer(nHours  )).toString(), 2);
    String sTime = sHours + ":" + sMinutes + ":" + sSeconds;
  
    // Figure out filename
    String sFilename = (new Integer(nFrame)).toString(); 
    sFilename = pad(sFilename, 6);    
    sFilename = "frame" + sFilename + ".png";
  
    // Figure out if file exists
    File theFile = new File(sketchPath() + "/" + sFilename);
    if (theFile.exists() == false) {
      break;
    }
  
    // Open file
    PImage current = loadImage(sFilename);
    current.loadPixels();
  
    // Compare to previous file
    if (last != null) {
      if (current.pixels.length != last.pixels.length) {
        println("Pixel counts don't match");
        break;
      }
      
      double sum = 0;
      for (int n = 0; n < current.pixels.length; ++n) {
        double diff = current.pixels[n] - last.pixels[n];
        sum += diff * diff;
      }
      
      String sMsg = sFilename + "," + sTime + "," + log((float)sum);
      writeln(sMsg);
    }
    
    last = current;
  
    ++nFrame;
  }

  try {
    csvFile.close();
  } catch (IOException e) {
  }
}

String pad(String s, int nLength) {

  while (s.length() < nLength) {
    s = "0" + s;
  }
  
  return s;
}

void writeln(String s) {
  println(s);

  try {
    csvFile.write(s + "\r\n");
  } catch (IOException e) {
  }
}