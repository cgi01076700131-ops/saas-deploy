
let css = '';
for (let i = 0; i <= 100; i++) {
  css += `.w-${i}p { width: ${i}%; }\n`;
}
console.log(css);
