(function() {
  'use strict';
  const fs = require('fs');
  const browserify = require('browserify');
  const b = browserify();
  b.add('src/index.js');
  b.bundle((err, buffer) => {
    if ( err ) {
      console.error(err);
      return;
    }
    try {
      fs.writeFileSync('dist/index.js', buffer);
    }
    catch(err) {
      console.error(err);
    }
  });
})();
