del *.png
del myAni.mpeg
ffmpeg -y -i 01.h264 -f image2 -vf "select=gt(scene\,.021)" -vsync vfr thumb%%06d.png
ffmpeg -y -r 20 -i thumb%%06d.png myAni.mpeg
