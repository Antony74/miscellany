# install.packages("fitdistrplus")
library(fitdistrplus)

# install.packages("sn")
library(sn)
dat = c(37, 39, 40, 41, 42, 44, 60)
fit = fitdist(dat, "sn", start=list(xi=0, omega=1, alpha=0, tau=0))
myList = as.list(fit$estimate)

x = seq(30, 70, by=0.1)

pdf = dsn(x, xi=myList$xi, omega=myList$omega, alpha=myList$alpha, tau=myList$tau)
plot(x, pdf)
points(dat, rep(0.06,length(dat)), col="red")
