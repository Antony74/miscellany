del *.png
ffmpeg -i 01.h264 -vf fps=1 frame%%06d.png
