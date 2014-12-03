
var example = require('example');

example.createMenu([{'caption': 'My menu item',
                     'function': function() {console.log('menu clicked!');}
                    }]);

example.simulateClick(0);
