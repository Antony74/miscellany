<?php

// How to shrink an epub (Windows)
// 0. All software mentioned can be installed with Chocolately (kindlestrip can be installed with pip which can be installed with Chocolately)
// 1. (SKIP: REQUIRES GUI) Sigil has two "Delete unused" options on its "Tools" menu
// 2. Unzip with 7-Zip
// 3. 

foreach(glob('D:\git\vegan\OEBPS\Images\*.jpg') as $sFilename)
{
	passthru('jpegoptim --max=50 ' . $sFilename);
}

// 4. pngquant --ext .png --force --quality 40-50 *.png
// 5. Zip with 7-zip
// 6. (SKIP: MARGINAL) Leanify

// How to convert to .mobi (e.g. for a Kindle device), then strip out the original file
// 7. KindleGen
// 8. kindlestrip input.mobi output.mobi

?>
