GULP inline-base64
==================

**Fork of https://github.com/G33kLabs/gulp-inline-base64**

Changes:

- usage: `inlineimg` instead of `url`
- api: removed `maxSize` option because we always inline
- api: removed `force` argument from `url(<URL>, {force})` because we always inline
- version: bumped to `0.2.*` (breaking change)

----

This helper will inject images and fonts into your css files.

Warning ! This technique is really efficient with small files (<14 Kb) cause it avoids DNS requests and makes the page loading faster. But for larger files it will be a mistake to use it !

Install it
----------

```
yarn add https://github.com/AleksandarDev/gulp-inline-base64 --dev
```

Use it
------

```
background-image: inlineimg('images/base64/logo-bottom.png');
```

In sass config:

```
var sass = require('gulp-sass'),
	inline_base64 = require('gulp-inline-base64'),
	autoprefixer = require('gulp-autoprefixer');

...

// SASS
gulp.task('sass', function() {
    return gulp.src([
        path_src + '/css/**/*.scss',
        '!' + path_src + '/css/**/_*.scss'
    ])
    .pipe(sass({
        includePaths: [
            path_src + '/css/',
            'bower_components/',
        ],
        imagePath: path_src
    }))
    .pipe(inline_base64({
        baseDir: path_src,
        maxSize: 14 * 1024,
        debug: true
    }))
    .pipe(autoprefixer("last 2 version", "> 1%", {
        cascade: true
    }))
    .pipe(gulp.dest(path_tmp + '/css'))
});
```

Options
-------
 - ``baseDir`` : the root path for assets
 - ``useRelativePath`` : overrides baseDir; root path is relative to the input file's directory
 - ``debug`` : show debug messages
