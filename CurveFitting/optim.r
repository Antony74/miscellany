
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

bFirstTime = TRUE;

f = function(params)
{
	a = params[1];
	b = params[2];
	c = params[3];
	d = params[4];
	e = params[4];
	f = params[6];
	g = params[7];
	h = params[8];

	tValues = params[9:length(params)];

	comparision = cbind(points, t = tValues);

	distances = 0;

	lapply(1:nrow(comparision), function(nRow)
	{
		targetX = comparision$x[nRow];
		targetY = comparision$y[nRow];
		t = comparision$t[nRow];

		x = (a * t * t * t) + (b * t * t) + (c * t) + d;
		y = (e * t * t * t) + (f * t * t) + (g * t) + h;

		x = x - targetX;
		y = y - targetY;

		distance = (x * x) + (y * y);

		distances <<- distances + distance;
	});

	if (bFirstTime)
	{
		print(distances);
		bFirstTime <<- FALSE;
	}

	return(distances);
}

params = rep(0.5, 8 + nrow(points));
result = nlm(f, params);

