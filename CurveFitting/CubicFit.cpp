#include <stdio.h>
#include "../dlib/optimization.h"

typedef dlib::matrix<double,0,1> column_vector;

struct Point
{
    double x;
    double y;
};

static Point points[] =
{
    { 254 , 102 },
    { 226 , 63  },
    { 185 , 49  },
    { 146 , 74  },
    { 142 , 119 },
    { 117 , 169 },
    { 86  , 214 },
    { 40  , 200 },
};

Point cubic(double a, double b, double c, double d,
            double e, double f, double g, double h,
            double t)
{
    Point pt;
    pt.x = (a * t * t * t) + (b * t * t) + (c * t) + d;
    pt.y = (e * t * t * t) + (f * t * t) + (g * t) + h;
    return pt;
};

double rateCurve(const column_vector& params)
{
    double distances = 0;

    for (Point target : points)
    {
        double distance = _DMAX;

        for (double t = 0; t <= 1; t += 0.01)
        {
            Point pt = cubic(params(0,0), params(1,0), params(2,0), params(3,0),
                             params(4,0), params(5,0), params(6,0), params(7,0),
                             t);

            double x = pt.x - target.x;
            double y = pt.y - target.y;

            distance = std::min(distance, ((x * x) + (y * y)) );
        }

        distances += distance;
    }

    Point ptStart = cubic(params(0,0), params(1,0), params(2,0), params(3,0),
                          params(4,0), params(5,0), params(6,0), params(7,0),
                          0);

    Point ptEnd   = cubic(params(0,0), params(1,0), params(2,0), params(3,0),
                          params(4,0), params(5,0), params(6,0), params(7,0),
                          1);

    double x = ptEnd.x - ptStart.x;
    double y = ptEnd.y - ptStart.y;

    double distance = (x * x) + (y * y);

    return distances + sqrt(distance);
}

int main(int argc, char* argv[])
{
    column_vector params(8);
    params = 200, 200, 200, 200, 200, 200, 200, 200;

    dlib::find_min_using_approximate_derivatives(
            dlib::cg_search_strategy(),
            dlib::objective_delta_stop_strategy(1e-7).be_verbose(),
            rateCurve,
            params,
            -1);

    char cVariableName = 'a';

    for (double d : params)
    {
        printf("%c = %f;\n", cVariableName, d);
        ++cVariableName;
    }

    return 0;
}

