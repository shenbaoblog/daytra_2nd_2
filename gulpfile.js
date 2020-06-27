"use strict";
//gulpプラグインの読み込み
const gulp = require("gulp");

//-------------------------------------------------------------------
//sass
//-------------------------------------------------------------------
//sassをコンパイルするプラグインの読み込み
const sass = require("gulp-sass");
// var watch = require("gulp-watch");
//タスク終了時やタスクエラー発生時にデスクトップに通知を表示
const notify = require("gulp-notify");
//ビルドエラーが発生してもタスクを終了させない
const plumber = require("gulp-plumber");
//変更のあったファイルのみを処理する
const cached = require("gulp-cached");
//パーシャルファイルを保存（watch）したときに該当の親SCSSファイルをビルドする
const progeny = require("gulp-progeny");
//@importをフォルダ単位でまとめて読み込む
const sassGlob = require("gulp-sass-glob");
//予め決めていたコーディングルール通りにsassが書かれているかチェックする静的解析ツール
const sassLint = require("gulp-sass-lint");
//css加工用プラグインの読み込み
const postcss = require("gulp-postcss");
//ベンダープレフィックス自動取り付け
const autoprefixer = require("autoprefixer");
//gridのベンダープレフィックス取り付けをONにする（デフォルトはOFF）
const autoprefixerOption = {
  grid: true,
};
//flexboxのブラウザ間の細かい挙動誤差修正（IE10/11対応）
const flexBugsFixes = require("postcss-flexbugs-fixes");
//postcss関数に渡される用（配列に変換している）
const postcssOption = [
  //flexboxのブラウザ間の細かい挙動誤差修正（IE10/11対応）をオブジェクトに渡している
  flexBugsFixes,
  //gridベンダープレフィックスON設定をオブジェクトに渡している
  autoprefixer(autoprefixerOption),
];
//CSSのプロパティの並び順をソートして整理してくれる
const cssdeclsort = require("css-declaration-sorter");
//sassでメディアクエリをネストして書いても、CSSに出力する際にまとめてくれる
const mqpacker = require("css-mqpacker");
//ソースマップを出力
// const sourcemaps = require("gulp-sourcemaps");
const options = {
  // コンパイル後のCSSを展開
  //expanded(展開)
  //nested（ネストがインデントされる）
  //compact（規則集合毎が1行になる）
  //compressed（全CSSコードが1行になる）
  outputStyle: "expanded",
};

//sass
gulp.task("sass", () => {
  return (
    gulp
      .src("./src/css/**/*.scss", { sourcemaps: true })
      // .pipe(sourcemaps.init())
      .pipe(cached("sass"))
      // .pipe(progeny())
      .pipe(
        plumber({
          //デスクトップにエラー通知（うまくいかない）
          errorHandler: notify.onError("Error: <%= error.message %>"),
        })
      )
      .pipe(sassGlob()) //importの読み込みを簡潔にする
      //ルール通りに記述されているかチェック
      // .pipe(
      //   sassLint({
      //     // airbnbのルール
      //     configFile: ".scss-lint.yml",
      //   })
      // )
      // .pipe(sassLint.format())
      // .pipe(sassLint.failOnError())
      .pipe(sass(options))
      // Sassのコンパイルエラーを表示（うまくいなない）
      // (これがないと自動的に止まってしまう)
      .on(
        "error",
        notify.onError(function(err) {
          return err.message;
        })
      )
      .pipe(postcss(postcssOption)) //ベンダープレフィックス自動付与のpostcssOptionの設定を取り込む
      .pipe(postcss([cssdeclsort({ order: "smacss" })])) //CSSのプロパティの並び順をソートしてくれる（smacssが定義するレイアウトが最も重要な順）
      .pipe(postcss([mqpacker()])) //sassでメディアクエリをネストして書いても、CSSに出力する際にまとめてくれる
      //sourcemapの書き出し
      .pipe(gulp.dest("./dist/css", { sourcemaps: "./maps" }))
      //コンパイル完了通知（うまくいかない）
      .pipe(
        notify({
          title: "Sass Build",
          message: "Sass build complete",
        })
      )
  );
});

//sassが更新されたか監視
gulp.task("sass-watch", () => {
  return gulp.watch("./src/css/**/*.scss", gulp.series("sass"));
});

//-------------------------------------------------------------------
//ejs
//-------------------------------------------------------------------
const ejs = require("gulp-ejs");
const rename = require("gulp-rename"); //.ejsの拡張子を変更
const replace = require("gulp-replace");
const prettierPlugin = require("gulp-prettier-plugin");
const htmlmin = require("gulp-htmlmin");

const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./src/config.json"));

// htmlminの設定
const htmlminOption = {
  collapseWhitespace: true,
};

gulp.task("ejs", (done) => {
  gulp
    .src(["./src/**/*.ejs", "!" + "./src/**/_*.ejs"])
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(ejs({ config: config }, {}, { ext: ".html" })) //ejsを纏める
    .pipe(rename({ extname: ".html" })) //拡張子をhtmlに
    // .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, "$1")) //冒頭の空白削除
    //htmlを整形
    .pipe(
      prettierPlugin(
        {
          //①Prettierのオプションを指定する
          prettier: {
            singleQuote: true,
          },
        },
        { filter: true }
      )
    )
    // .pipe(htmlmin(htmlminOption)) //htmlの圧縮)
    .pipe(gulp.dest("./dist")); //出力先
  done();
});

//ejsが更新されたか監視
gulp.task("ejs-watch", () => {
  return gulp.watch("./src/**/*.ejs", gulp.task("ejs"));
});

//-------------------------------------------------------------------
//xmlサイトマップ生成
//-------------------------------------------------------------------
const sitemap = require("gulp-sitemap");
const save = require("gulp-save");

gulp.task("sitemap", function() {
  return gulp
    .src("dist/**/*.html", {
      read: false,
    })
    .pipe(
      sitemap({
        siteUrl: "http://www.amazon.com",
      })
    )
    .pipe(gulp.dest("./dist"));
});

//xmlサイトマップ生成2
gulp.task("xml", function() {
  return gulp
    .src("dist/**/*.html", {
      read: false,
    })
    .pipe(save("before-sitemap"))
    .pipe(
      sitemap({
        siteUrl: "http://www.amazon.com",
      })
    ) // Returns sitemap.xml
    .pipe(gulp.dest("./dist"))
    .pipe(
      save.restore("before-sitemap") //restore all files to the state when we cached them
      // -> continue stream with original html files
    );
});

//-------------------------------------------------------------------
//webpack
//-------------------------------------------------------------------
const webpackStream = require("webpack-stream");
const webpack = require("webpack");

// webpackの設定ファイルの読み込み
const webpackConfig = require("./webpack.config");

// タスクの定義。 ()=> の部分はfunction() でも可
gulp.task("webpack", () => {
  // ☆ webpackStreamの第2引数にwebpackを渡す☆
  return webpackStream(webpackConfig, webpack).pipe(gulp.dest("./dist/js"));
});

//webpackが更新されたか監視
gulp.task("webpack-watch", () => {
  return gulp.watch("./src/js/**/*.js", gulp.task("webpack"));
});

//-------------------------------------------------------------------
//画像圧縮（png,jpg,gif,svg）
//-------------------------------------------------------------------
const imagemin = require("gulp-imagemin");
const imageminPngquant = require("imagemin-pngquant");
const imageminMozjpeg = require("imagemin-mozjpeg");
const changed = require("gulp-changed");

const imageminOption = [
  imageminPngquant({
    quality: [0.7, 0.85],
    speed: 1,
  }),
  imageminMozjpeg({
    quality: 80, // 画質 こちらも0から100まで指定できるが、pngquantと違って65-80のように幅を持って指定はできない。1つの数字のみ。
    progressive: true, // baselineとprogressiveがある。baselineよりprogressiveのほうがエンコードは遅いが圧縮率は高い。
  }),
  imagemin.gifsicle({
    interlaced: false,
    optimizationLevel: 1,
    colors: 256,
  }),
  imagemin.jpegtran(),
  imagemin.optipng(),
  imagemin.svgo(),
];

gulp.task("img-min", () => {
  return (
    gulp
      .src("./src/img/**/*")
      .pipe(changed("./dist/img")) // ./src/imgフォルダの中身と、出力先の./dist/imgフォルダの中身を比較して異なるものだけ処理(新しく追加されたファイル等)
      .pipe(imagemin(imageminOption))
      .pipe(gulp.dest("./dist/img")) // imgファイルに保存(出力)
      //画像圧縮完了通知（うまくいかない）
      .pipe(
        notify({
          title: "Img Compression",
          message: "Images Compression finished",
        })
      )
  );
});

//imgが更新されたか監視
gulp.task("img-watch", () => {
  return gulp.watch("./src/img/**/*", gulp.series("img-min"));
});

//-------------------------------------------------------------------
//distとsrcで連携削除&追加（挫折中）
//-------------------------------------------------------------------
const del = require("del");

const path = require("path");

const wait = require("gulp-wait");
const vinylPaths = require("vinyl-paths");

//-------------------------------------------------------------------
//distとsrcで連携削除&追加（ダミー動作はする）→画像を一旦全削除して、再圧縮
//-------------------------------------------------------------------
gulp.task("clean", () => {
  return del(["./dist/img/**/*"]);
});

gulp.task("sync-img-watch", () => {
  gulp.watch("./src/img/**/*", gulp.series("clean", "img-min"));
});

//-------------------------------------------------------------------
//ブラウザ更新チェック
//-------------------------------------------------------------------
//ローカルサーバーを立ち上げて自動でブラウザをリロード
const browserSync = require("browser-sync").create();
const browserSyncOption = {
  port: 3000,
  server: {
    baseDir: "./dist/",
    index: "index.html",
  },
  reloadOnRestart: true,
};

//ローカルサーバーを立ち上げ、ブラウザで初期読み込み
gulp.task("local-server", (done) => {
  browserSync.init(browserSyncOption);
  done();
});

//ブラウザ自動更新
gulp.task("bs-reload", (done) => {
  const browserReload = (done) => {
    browserSync.reload();
    done();
  };
  gulp.watch("./dist/**/*", browserReload);
});

//ブラウザ初期読み込み&自動更新
gulp.task("bs-watch", gulp.series("local-server", "bs-reload"));
// gulp.task("bs-reload", function() {
//   browserSync.reload();
// });

//-------------------------------------------------------------------
//watchをデフォルトに設定&sassコンパイル、ブラウザ自動更新を行う
//-------------------------------------------------------------------
gulp.task(
  "default",
  gulp.parallel(
    "sass-watch",
    "ejs-watch",
    "webpack-watch",
    "img-watch",
    "bs-watch"
  )
);

//-------------------------------------------------------------------
//ftpアップロードを自動化
//-------------------------------------------------------------------
const ftp = require("vinyl-ftp");
const fancyLog = require("fancy-log");

gulp.task("ftp", () => {
  const ftpConfig = {
    host: "enterinfo.xsrv.jp", //FTPSサーバー
    user: "enterinfo", //FTP・WebDAVアカウント
    password: "cbxxlqiy", //FTP・WebDAVパスワード
    log: fancyLog,
  };

  const connect = ftp.create(ftpConfig);
  const ftpUploadFiles = "./dist/**/*";

  //バッファ機能をオフにする設定
  const ftpUploadConfig = {
    buffer: false,
  };

  const remoteDistDir = "/enterinfo.xsrv.jp/public_html/bbb";

  return (
    gulp
      .src(ftpUploadFiles, ftpUploadConfig)
      // .pipe(connect.newer(remoteDistDir)) // リモートサーバーとファイルを比較し、更新日時よりファイルが新しいファイルのみを残したふとリームに変換
      .pipe(connect.dest(remoteDistDir))
  );
});

//-------------------------------------------------------------------
//ftpアップロードを自動化2
//-------------------------------------------------------------------
const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();

//　接続情報を設定
const ftpOptions = {
  host: "enterinfo.xsrv.jp", //FTPSサーバー
  user: "enterinfo", //FTP・WebDAVアカウント
  password: "cbxxlqiy", //FTP・WebDAVパスワード
  localRoot: "./dist/", //アップロードするファイルがあるフォルダを指定
  // remoteRoot: "/home/test/www/ftp_deploy_test/", //サーバーのアップロード先を指定
  remoteRoot: "/enterinfo.xsrv.jp/public_html/bbb", //サーバーのアップロード先を指定
  include: ["*"], //アップロードするファイルを指定できます。
  exclude: [], //アップロードしないファイルを指定できます。
  deleteRemote: false,
  log: fancyLog,
};

//タスクを登録
gulp.task("ftp2", (done) => {
  ftpDeploy.deploy(ftpOptions, (error) => {
    if (error) {
      console.log("Error", error);
    }
  });
  done();
});
