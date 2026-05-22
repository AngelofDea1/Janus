const fs = require('fs');
const path = require('path');

// Regex to match emojis and variation selectors
const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]|[\uFE0E-\uFE0F])/g;

function walkDir(dir) {
    let files = fs.readdirSync(dir);
    files.forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.md')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (emojiRegex.test(content)) {
                console.log('Found emojis in:', fullPath);
                // Remove them
                let newContent = content.replace(emojiRegex, '');
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Removed emojis from:', fullPath);
            }
        }
    });
}

const dirs = ['app', 'components', 'docs', 'lib'];
dirs.forEach(dir => {
    if (fs.existsSync(dir)) walkDir(dir);
});
console.log('Emoji scan complete.');
