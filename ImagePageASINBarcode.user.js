// ==UserScript==
// @name         Image Page ASIN Barcode
// @namespace    http://aftlite-na.amazon.com/
// @version      1.3
// @description  Add item ASIN barcode on item image pages. Get alternative item iamge from amazon server if the orginal image cannot be displayed.
// @author       whz1995
// @match        https://aftlite-na.amazon.com/inventory/view_catalog_data_for_asin*
// @updateURL    https://gist.github.com/whz1995/b17d1e7c81e3d7d75f8ed1060479d47a/raw/ImagePageASINBarcode.user.js
// @downloadURL  https://gist.github.com/whz1995/b17d1e7c81e3d7d75f8ed1060479d47a/raw/ImagePageASINBarcode.user.js
// @grant        none
// ==/UserScript==

var ASIN_text,ASIN_text2 = "",i,ASIN_tag = document.getElementsByTagName("h2")[0],ASIN_barcode,img;
ASIN_text = document.getElementsByTagName("h2")[0].innerText;
ASIN_text = ASIN_text.split("");
for (i =23; i <=32; i++){
    ASIN_text2 = ASIN_text2+ ASIN_text[i];
}
ASIN_barcode = "<img src=\"http://www.barcode-generator.org/zint/api.php?bc_number=92&bc_data=" + ASIN_text2 + "&bc_size=l\" style=\"padding:10% 3%\">";
img = document.getElementsByTagName("img")[0];
setTimeout(function(){
    //Replace Image Link if the orginal link is not working
    if (img.width == 1){
        img.src = "https://ws-na.amazon-adsystem.com/widgets/q?ASIN=" + ASIN_text2 + "&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL500_";
    }
    //Add Barcode
    ASIN_tag.insertAdjacentHTML("afterend",ASIN_barcode);
}, 250);

