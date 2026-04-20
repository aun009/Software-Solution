const fs = require('fs');
const babel = require('@babel/core');
try {
  babel.transformSync(fs.readFileSync('src/pages/ProductDetails.tsx', 'utf8'), {
    presets: ['@babel/preset-react', '@babel/preset-typescript']
  });
  console.log("No error!");
} catch(e) {
  console.error(e.message);
}
