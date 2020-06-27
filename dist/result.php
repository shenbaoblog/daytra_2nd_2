<?php ini_set('display_errors', 1); ?>
<?php
// if(isset($_POST['inquiryType'])){
//     $inquiryType = htmlspecialchars($_POST['inquiryType']);
// }else{
//     $inquiryType = '種別が選択されていません';
// }

$inquiryType = isset($_POST['inquiryType']) ? htmlspecialchars($_POST['inquiryType']) : '種別が選択されていません';
$name = isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '名前を入力してください';
$kana = isset($_POST['kana']) ? htmlspecialchars($_POST['kana']) : 'フリガナを入力してください';
$mail = isset($_POST['mail']) ? htmlspecialchars($_POST['mail']) : 'メールアドレスを入力してください';
if(isset($_POST['gender']) && $_POST['gender'] == 'male'){
    $gender = '男';
} elseif (isset($_POST['gender']) && $_POST['gender'] == 'female') {
    $gender = '女';
} else {
    $gender = '性別がないよ';
}
$message = isset($_POST['message']) ? htmlspecialchars($_POST['message']) : 'メッセージを入力してください';
?>


<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="format-detection" content="telephone=no" />
    <title>デフォルトSiteName</title>
    <meta name="description" content="インデックスDescription" />
    <meta name="keyword" content="インデックスkeyword" />
    <link rel="stylesheet" href="./css/style.css" />
    <!-- JS -->
    <!-- <script src="./js/bundle.js"></script> -->
    <!-- jQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <!-- wow -->
    <!-- <script src="./js/wow.js"></script> -->
    <!-- swiper -->
    <script src="https://unpkg.com/swiper/js/swiper.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper/css/swiper.min.css" />
    <!-- font awesome -->
    <script src="https://kit.fontawesome.com/bc0abd7757.js" crossorigin="anonymous"></script>
</head>

<body>

    <section style="padding: 100px;">
        <h1>お問い合わせ内容</h1>
        <p>お問い合わせ種別：<?php echo $inquiryType; ?></p>
        <p>名前：<?php echo $name; ?></p>
        <p>フリガナ：<?php echo $kana; ?></p>
        <p>メールアドレス：<?php echo $mail ?></p>
        <p>性別：<?php echo $gender; ?></p>
        <p>メッセージ：</p>
        <p><?php echo nl2br($message); ?></p>
    </section>


    <footer class="footer">
        <div class="footer__inner">
            <div class="footer__info">
                <div class="footer__sns">
                    <a href=""><i class="fab fa-twitter faIcon"></i></a>
                    <a href=""><i class="fab fa-facebook-square faIcon faFacebookIcon"></i></a>
                </div>
                <ul>
                    <li><a href="">サイトマップ</a></li>
                    <li><a href="">個人情報保護方針</a></li>
                    <li><a href="">プライバシーポリシー</a></li>
                </ul>
            </div>

            <div class="footer__logo">
                <p>HANIWAMAN Corp.</p>
                <small>© Haniwaman Landing page Sample.</small>
            </div>
        </div>
    </footer>

    <div class="toTop">
        <a href="#"><img src="./img/totop.svg" alt="トップへ" /></a>
    </div>

    <!-- swipper初期化 -->
    <script>
    var mySwiper = new Swiper(".swiper-container", {
        loop: true,
        slidesPerView: "auto",
        loopedSlides: 10,
        pagination: {
            el: ".swiper-pagination",
            type: "bullets",
            clickable: true
        }
    });
    </script>

    <!-- wow初期化 -->
    <!-- <script>
        new WOW().init();
    </script> -->

    <!-- ハンバーガーメニュー -->
    <script>
    function toggleNav() {
        var body = document.body;
        var hamburger = document.getElementById("js-hamburger");
        var blackBg = document.getElementById("js-black-bg");

        hamburger.addEventListener("click", function() {
            body.classList.toggle("nav-open");
        });
        blackBg.addEventListener("click", function() {
            body.classList.remove("nav-open");
        });
    }
    toggleNav();
    </script>

    <!-- スムーススクロール -->
    <script>
    $(function() {
        // #で始まるアンカーをクリックした場合に処理
        $('a[href^="#"]').click(function() {
            // スクロールの速度
            var speed = 300;
            // アンカーの値取得
            var href = $(this).attr("href");
            // 移動先を取得
            var target = $(href == "#" || href == "" ? "html" : href);
            // 移動先を数値で取得
            var position = target.offset().top;
            // スムーススクロール
            $("html, body").animate({
                scrollTop: position
            }, speed, "swing");
            return false;
        });
    });
    </script>

    <!-- フローティングボタン -->
    <script>
    jQuery(window).on("scroll", function($) {
        if (jQuery(this).scrollTop() > 100) {
            jQuery(".toTop").fadeIn(200);
        } else {
            jQuery(".toTop").fadeOut(200);
        }
    });
    // jQuery('.floating').click(function () {
    //     jQuery('body,html').animate({
    //         scrollTop: 0
    //     }, 500);
    //     return false;
    // });
    </script>

    <!-- スクロールでカレントを取得（オールマイティ） -->
    <script>
    $(function() {
        //1,ウインドウ上部からどれぐらいの位置で変化させるか,position:fixd;のナビバーならその高さ、なければ0でOK
        var margin = 50,
            sectionTop = new Array(),
            current = -1;

        //2,各sectionの縦位置を取得,クラスで管理してもOK
        $(".navPlaceMark").each(function(i) {
            sectionTop[i] = $(this).offset().top;
        });

        changeNavCurrent(0);

        $(window).scroll(function() {
            scrollY = $(window).scrollTop();

            for (var i = sectionTop.length - 1; i >= 0; i--) {
                if (scrollY > sectionTop[i] - margin) {
                    changeNavCurrent(i);
                    break;
                }
            }
        });

        //ナビの処理
        function changeNavCurrent(curNum) {
            if (curNum != current) {
                current = curNum;
                curNum2 = curNum + 1;

                //3,currentをつける場所の指定（.step li）を任意の場所にする
                $(".header__globalNav__lists li").removeClass("navCurrent");
                $(
                    ".header__globalNav__lists li:nth-child(" + curNum2 + ")"
                ).addClass("navCurrent");
            }
        }
    });
    </script>

    <!-- アコーディオン -->
    <script>
    $(function() {
        $(".qa__answer").hide();
        $(".qa__question").each(function() {
            $(this).on("click", function() {
                $(this).toggleClass("on");
                $("+.qa__answer", this).slideToggle();
                return false;
            });
        });
    });
    </script>

    <!-- モーダル -->
    <!-- <script>
        $(function () {
            // 「#login-show」要素に対するclickイベントを作成してください
            $('.openModal').click(function () {
                $(".modal").fadeIn();
            });
        });
        // 「.close-modal」要素にclickイベントを設定してください
        $('.closeModal').click(function () {
            $('.modal').fadeOut();
        });
        //スクロールポジション固定
        $(function () {
            var scrollPosition;
            $(".openModal").on("click", function () {
                scrollPosition = $(window).scrollTop();
                $('body').addClass('fixed').css({ 'top': -scrollPosition });
            });
            $(".closeModal").on("click", function () {
                $('body').removeClass('fixed').css({ 'top': 0 });
                window.scrollTo(0, scrollPosition);
            });
        });
    </script> -->
</body>

</html>