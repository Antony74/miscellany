var buildtool = require('./buildtool.js');

function createFakeBuildFunction(secondsPause)
{
    return function(doneBuilding)
    {
        setTimeout(doneBuilding, secondsPause * 1000);
    };
}

var buildProjects = 
{
    'baselib':
    {
        depends: [],
        build: createFakeBuildFunction(1),
    },
    'widget1':
    {
        depends: ['baselib'],
        build: createFakeBuildFunction(1),
    },
    'widget2':
    {
        depends: ['baselib','widget1'],
        build: createFakeBuildFunction(1),
    },
    'widget3':
    {
        depends: ['baselib'],
        build: createFakeBuildFunction(1),
    },
    'UI':
    {
        depends: ['widget1','widget2','widget3'],
        build: createFakeBuildFunction(3),
    }
};

buildtool.build(buildProjects);

