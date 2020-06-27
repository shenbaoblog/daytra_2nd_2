import $ from "jquery";
import Swiper from "swiper";
// import "slick-carousel";
// import "../../node_modules/slick-carousel/slick/slick.css";
// import "../../node_modules/slick-carousel/slick/slick-theme.css";
//モジュールからbabelとtestだけ読み込む
import { babel, test } from "./modules/app";
//モジュールからplusをデフォリトで読み込み、addを読み込み、subをSUBという名前で読み込む
import plus, { add, sub as SUB } from "./modules/math";
//全てのエクスポートをモジュールから読み込む
import * as math from "./modules/math";

var mySwiper = new Swiper(".swiper-container");
// const $ = require("jquery");

// $("button").on("click", () => {
//   window.alert("hello webpack");
// });

// const name = "John";
// if (name === "John") {
//   console.log("hello world");
// }

// babel();
// test();

// console.log(plus(2, 3));
// console.log(add(1, 2));
// console.log(SUB(3, 2));

// console.log(math.add(1, 2));
// console.log(math.sub(3, 2));

// const message = "Hello webpack!!";
// console.log(message);
