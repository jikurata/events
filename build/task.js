(function() {
  'use strict';
  const fs = require('fs');
  try {
    fs.copyFileSync('src/EventEmitter.js', 'dist/index.js');
  }
  catch(err) {
    console.error(err);
  }
})();
