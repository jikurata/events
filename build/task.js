(function() {
  'use strict';
  const fs = require('fs');
  const dist = 'dist';
  const src = 'src';
  // Clear dist directory
  fs.readdirSync(dist).forEach(path => {
    fs.unlinkSync(`${dist}\\${path}`);
  });

  // Build src into dist
  fs.readdirSync(src).forEach(path => {
    fs.copyFileSync(`${src}\\${path}`, `${dist}\\${path}`);
  });
})();
