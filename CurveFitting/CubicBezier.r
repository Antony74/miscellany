
bezier = function(p1, c1, c2, p2, t)
{
	s = (1 - t);

	v = 0;
	v = v + (1 * p1 * s * s * s);
	v = v + (3 * c1 * s * s * t);
	v = v + (3 * c2 * s * t * t);
	v = v + (1 * p2 * t * t * t);

	return(v);        
};

