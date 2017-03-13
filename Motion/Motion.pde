
int nFrame = 1;
PImage last = null;

while(true) {

  String sFilename = (new Integer(nFrame)).toString(); 

  while (sFilename.length() < 6) {
    sFilename = "0" + sFilename;
  }

  sFilename = "frame" + sFilename + ".png";
  File theFile = new File(sketchPath() + "/" + sFilename);
  if (theFile.exists() == false) {
    break;
  }
  
  PImage current = loadImage(sFilename);
  current.loadPixels();

  last = current;
  println(sFilename);

  ++nFrame;
}