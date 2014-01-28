var buildtool = require('./TinyBuildTool.js');

function createFakeBuildFunction(name, secondsPause)
{
    return function(doneBuilding)
    {
        console.log(name + " started");

        setTimeout(function()
        {
            console.log(name + " finished");
            doneBuilding();
        }, secondsPause * 1000);
    };
}

var buildProjects = 
{
    'baselib':
    {
        depends: [],
        build: createFakeBuildFunction('baselib', 1),
    },
    'widget1':
    {
        depends: ['baselib'],
        build: createFakeBuildFunction('widget1', 1),
    },
    'widget2':
    {
        depends: ['baselib','widget1'],
        build: createFakeBuildFunction('widget2', 1),
    },
    'widget3':
    {
        depends: ['baselib'],
        build: createFakeBuildFunction('widget3', 1),
    },
    'UI':
    {
        depends: ['widget1','widget2','widget3'],
        build: createFakeBuildFunction('UI', 3),
    }
};

buildtool.build(buildProjects);

