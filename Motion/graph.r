
data = read.csv("c:/git/miscellany/motion/log.csv");
plot(strptime(data$Time,format="%H:%M:%S"), data$Score, type="l", xlab="Time", ylab="Motion", main="Graph title");

