const fs = require('fs');
const path = require('path');
const pug = require('pug');

class PugWebpackPlugin {
  constructor(config) {
    this.config = config;
  }
  apply(compiler) {
    const stream = fs.readFileSync(this.config.template);
    const render = pug.compile(stream, this.config.options);
    const html = render(this.config.locals);
    if (!fs.existsSync(this.config.path)) {
      fs.mkdirSync(this.config.path);
    }
    fs.writeFile(
      path.resolve(this.config.path + '/' + this.config.options.filename),
      html,
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  }
}

module.exports = PugWebpackPlugin;
