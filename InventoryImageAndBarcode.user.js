// ==UserScript==
// @name         Inventory Image and Barcode
// @namespace    http://aftlite-na.amazon.com/
// @version      1.2
// @description  Add items images and items barcodes at inventory pages.
// @description  Click Raw to install the script
// @author       wuhongz@
// @match        https://aftlite-na.amazon.com/inventory/view_inventory_at*
// @match        http://aftlite-na.amazon.com/inventory/view_inventory_at*
// @updateURL    https://gist.github.com/whz1995/3c04b7795317b7f5cbdab21b01ea0c49/raw/InventoryImageAndBarcode.user.js
// @downloadURL  https://gist.github.com/whz1995/3c04b7795317b7f5cbdab21b01ea0c49/raw/InventoryImageAndBarcode.user.js
// @grant        none
// ==/UserScript==

//Add bin Barcode
var bin_text, bin_tag, bin_barcode;
bin_text = document.getElementsByTagName("h2")[0].innerText.split(" ");
bin_tag = document.getElementsByTagName("h2")[0];
bin_barcode = "<img src=\"http://www.barcode-generator.org/zint/api.php?bc_number=92&bc_data=" + bin_text[3] + "&bc_size=m\" style=\"padding:0% 1%\">";
bin_tag.insertAdjacentHTML("beforeend",bin_barcode);

//Add Item Barcode and Image
var tr_count = document.getElementsByTagName("tbody")[1].rows.length, first_row, ASIN,item_image, fifth_row, item_barcode,i;
for(i = 0; i < tr_count; i++){
    if (document.getElementsByTagName("tbody")[1].rows[i].cells[0].getElementsByTagName("a").length != 0){
        first_row = document.getElementsByTagName("tbody")[1].rows[i];
        ASIN = first_row.cells[0].getElementsByTagName("a")[0].innerHTML;
        item_image = "<td rowspan=\"6\"><img style=\"margin:0 auto;display:block;\" class=\"Item_Image\" id=\""+ ASIN +"\" src=\"https://m.media-amazon.com/images/P/" + ASIN + ".jpg\" height=\"200\">"
        fifth_row = document.getElementsByTagName("tbody")[1].rows[i+4];
        item_barcode = "<td><img src=\"http://www.barcode-generator.org/zint/api.php?bc_number=92&bc_data=" + ASIN + "&bc_size=m\" style=\"padding:0% 10%\">";
        first_row.insertAdjacentHTML("afterbegin",item_image);
        fifth_row.insertAdjacentHTML("beforeend",item_barcode);
    }
}

//Load Alternative Image From Different Link If The First Link Does Not Work
setTimeout(function(){
    var img = document.getElementsByClassName("Item_Image"), a;
    for(a = 0; a<img.length; a++){
        if (img[a].naturalWidth == 1){
            img[a].src = "https://ws-na.amazon-adsystem.com/widgets/q?ASIN=" + img[a].id + "&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL500_";
        }
    }
}, 250);

//Fix Image Ratio
setTimeout(function(){
    var img = document.getElementsByClassName("Item_Image"),a;
    for(a = 0; a<img.length; a++){
        if (img[a].width > 200){
            var b = 200 / img[a].naturalWidth * img[a].naturalHeight;
            img[a].height = b;
            img[a].width = "200";
        }
    }
}, 250);
