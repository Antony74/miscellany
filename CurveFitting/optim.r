
points = data.frame(numeric(0), numeric(0));

addPoint = function(x, y)
{
	points <<- rbind(points, c(x, y));
};

addPoint( 254 , 102 );
addPoint( 226 , 63 );
addPoint( 185 , 49 );
addPoint( 146 , 74 );
addPoint( 142 , 119 );
addPoint( 117 , 169 );
addPoint( 86 , 214 );
addPoint( 40 , 200 );names(points) = c("x", "y");

f = function(params)
{
	a = params[1];
	b = params[2];
	cc = params[3];
	d = params[4];
	e = params[5];
	f = params[6];
	g = params[7];
	h = params[8];

	tValues = params[9:length(params)];

	cubic = function(t)
	{
		x = (a * t * t * t) + (b * t * t) + (cc * t) + d;
		y = (e * t * t * t) + (f * t * t) + (g  * t) + h;
		return(c(x, y));
	};

	comparision = cbind(points, t = tValues);

	distances = 0;

	lapply(1:nrow(comparision), function(nRow)
	{
		targetX = comparision$x[nRow];
		targetY = comparision$y[nRow];
		t = comparision$t[nRow];

		xy = cubic(t);

		x = xy[1] - targetX;
		y = xy[2] - targetY;

		distance = (x * x) + (y * y);

		distances <<- distances + distance;
	});

	start = cubic(0);
	end   = cubic(1);

	x = end[1] - start[1];
	y = end[2] - start[2];

	distance = (x * x) + (y * y);

	return(distances + (sqrt(distance)^1.5));
}

params = rep(0.5, 8 + nrow(points));
result = optim(params, f,
			   method = "L-BFGS-B",
			   lower = c(rep(-Inf,8), rep(0, nrow(points))),
			   upper = c(rep(+Inf,8), rep(1, nrow(points))));

cat(paste("a = ", result$par[1]), ';\n', sep="");
cat(paste("b = ", result$par[2]), ';\n', sep="");
cat(paste("c = ", result$par[3]), ';\n', sep="");
cat(paste("d = ", result$par[4]), ';\n', sep="");
cat(paste("e = ", result$par[5]), ';\n', sep="");
cat(paste("f = ", result$par[6]), ';\n', sep="");
cat(paste("g = ", result$par[7]), ';\n', sep="");
cat(paste("h = ", result$par[8]), ';\n', sep="");

