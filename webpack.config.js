// import { upperCase } from 'lodash-es';
// output.pathに指定するパスがOSによって異なることを
// 防ぐためにpathモジュールを読み込んでおく
const path = require("path");
// clean-webpack-plugin を読み込んでおく
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  // モードの設定（モードを指定しないとwebpack実行時に警告が出る）
  //development, production, none
  // mode: "production",
  // mode: "development",

  // エントリーポイントの設定
  entry: "./src/js/main.js",
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: "bundle.js",
    // 出力先のパス（絶対パスを指定しないとエラーが出るので注意）←エラーでない？？？
    path: path.resolve(__dirname, "./dist/js")
  },
  module: {
    rules: [
      {
        // ローダー処理の対象ファイル
        test: /\.js$/,
        // ローダー処理の対象となるディレクトリ
        include: path.resolve(__dirname, "./src/js"),
        use: [
          {
            // 利用するローダー
            loader: "babel-loader",
            // ローダーのオプション
            options: {
              presets: [["@babel/preset-env", { modules: false }]]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.gif|png|jpg|eot|woff|ttf|svg$/,
        use: ["url-loader"]
      }
    ]
  },
  // プラグインの設定
  plugins: [
    // clean-webpack-plugin を利用する
    // 今回、output.path に public/js を指定しているため,
    // public/js ディレクトリ内のファイルが削除されてからビルドが実行される
    new CleanWebpackPlugin()
  ],
  // ソースマップの設定
  devtool: "cheap-module-eval-source-map"
};
