set start_time=0
set duration=60
set palette="c:\temp\palette.png"
set filters="fps=15,scale=-1:-1:flags=lanczos"
ffmpeg -v warning -ss %start_time% -t %duration% -i %1 -vf "%filters%,palettegen" -y %palette%
ffmpeg -v warning -ss %start_time% -t %duration% -i %1 -i %palette% -lavfi "%filters% [x]; [x][1:v] paletteuse" -y %2
