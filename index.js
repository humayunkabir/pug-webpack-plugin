const fs = require('fs');
const path = require('path');
const pug = require('pug');
const through = require('through2');
class PugWebpackPlugin {
  constructor(config) {
    this.config = config;
  }
  apply(compiler) {
    const opts = Object.assign({}, this.config.options);

    // return through.obj(this.compilePug);

    const stream = fs.readFileSync(this.config.template);
    const render = pug.compile(stream, this.config.options);
    const html = render(this.config.locals);
    if (!fs.existsSync(this.config.path)) {
      fs.mkdirSync(this.config.path);
    }
    this.write(html)
  }

  write(html) {
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

  compilePug(file, enc, cb) {
    const data = Object.assign({}, opts.data, file.data || {});

    opts.filename = file.path;
    file.path = ext(file.path, opts.client ? '.js' : '.html');


    if (file.isStream()) {
      return cb(new Error('Streaming not supported'));
    }

    if (file.isBuffer()) {
      try {
        let compiled;
        const contents = String(file.contents);
        if (opts.verbose === true) {
          console.log('compiling file', file.path);
        }
        if (opts.client) {
          compiled = pug.compileClient(contents, opts);
        } else {
          compiled = pug.compile(contents, opts)(data);
        }
        console.log(compiled);
        this.write(compiled);
        file.contents = new Buffer(compiled);
      } catch (e) {
        return cb(new Error(e));
      }
    }
    cb(null, file);
  }
}

module.exports = PugWebpackPlugin;
