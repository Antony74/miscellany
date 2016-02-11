<?php

// How to shrink an epub (Windows)
// 0. All software mentioned can be installed with Chocolately
// 1. Sigil has two "Delete unused" options on its "Tools" menu
// 2. Unzip with 7-Zip
// 3. 

foreach(glob('D:\git\vegan\OEBPS\Images\*.jpg') as $sFilename)
{
	passthru('jpegoptim --max=50 ' . $sFilename);
}

// 4. pngquant --ext .png --force --quality 40-50 *.png
// 5. Zip with 7-zip
// 6. Leanify

?>
