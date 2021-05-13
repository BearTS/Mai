// This file needs to be loaded for canvas-based commands to work.
const { readdirSync  } = require('fs');
const { registerFont } = require('canvas');
const {     join     } = require('path');
const filterfonttypes  = x => ['ttf', 'otf'].includes(x.split('.').pop());

// Fonts
// Hiragino Kaku            -> Special Support for Japanese Characters
// Code 2003                -> Stylized Wide Support for almost all unicode
// Unifont                  -> Bitmap Version of unsupported unicode
// Unicode BMP Fallback SIL -> Font style fallback showing unicode inside box
//
// WARNING: FONTS USED IN THIS BOT IS PROTECTED BY COPYRIGHT~

for (const fontFileName of readdirSync(join(__dirname, 'assets/fonts')).filter(filterfonttypes)){
  const [ family, weight ] = fontFileName.split(/\.(t|o)tf/)[0].split(' ');
  registerFont(join(__dirname, 'assets/fonts', fontFileName), { family: family.split('-').join(' '), weight: weight?.toLowerCase() });
};
