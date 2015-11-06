/*global $, document, jQuery, sendRequest, cordova, addToTable, alert, getProducts, sync, window */

var test_json = '{"status":0, "products":{"9782342":{"PRODUCT_ID":"4","PRODUCT_NAME":"ideal milk","PRODUCT_BARCODE":"9782342","PRODUCT_PRICE":"2"},"6433949":{"PRODUCT_ID":"5","PRODUCT_NAME":"kalyppo","PRODUCT_BARCODE":"6433949","PRODUCT_PRICE":"1.4"}}}';

var products;
var server = "http://cs.ashesi.edu.gh/~csashesi/class2016/sheamus-yebisi/mobile_web/POS/php/";
var scanned_products = "";
var total = 0;


$(document).ready(function () {
    "use strict";

    getProducts();

    sync();
});

$(function () {
    "use strict";
    $("#scanBarcode").click(function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                addToTable(result.text);
            },
            function (error) {
                $("#result").val(error);
            }
        );
    });
});


function submit() {
    "use strict";
    var json_trans, URL, response, phoneNumber;

    phoneNumber = $("#phoneNumber").val();

    if (phoneNumber.length > 0) {
        if (scanned_products.length > 0) {

            json_trans = '{"phoneNumber":"' + phoneNumber + '","total":' + total + ',"productBarcode":[' + scanned_products + ']}';

            URL = 'http://cs.ashesi.edu.gh/~csashesi/class2016/sheamus-yebisi/mobile_web/POS/php/teller_function.php?cmd=1&trans=' + json_trans;

            response = sendRequest(URL);

            alert(response.message);
            $("#transaction-table tbody").empty();
            total = parseFloat(0);
            $("#total").html(total);
        }
    } else {
        alert("No phone number found.");
    }

}

function addToTable(barcode) {
    "use strict";

    var bcode, name, price;

    bcode = products[barcode].PRODUCT_BARCODE;
    name = products[barcode].PRODUCT_NAME;
    price = products[barcode].PRODUCT_PRICE;
    $("#transaction-table tbody").append(
        "<tr>" +
        "<td>" + name + "</td>" +
        "<td>" + bcode + "</td>" +
        "<td>" + price + "</td>" +
        "</tr>"
    );

    if (scanned_products.length > 0) {
        scanned_products = scanned_products + ', ';
    }

    scanned_products = scanned_products + bcode;

    total = parseFloat(total) + parseFloat(price);
    $("#total").html(total);



}

function sendRequest(u) {
    "use strict";
    var obj, result;
    obj = $.ajax({
        url: u,
        async: false
    });
    result = $.parseJSON(obj.responseText);
    return result;
}

function getProducts() {
    "use strict";
    var obj, result;
    obj = $.ajax({
        url: 'http://cs.ashesi.edu.gh/~csashesi/class2016/sheamus-yebisi/mobile_web/POS/php/teller_function.php?cmd=0',
        async: false
    });
    if (obj.status !== 200) {
        alert('not connected');
    } else {
        alert('connected');
        result = $.parseJSON(obj.responseText);
        products = result.products;
    }
}

function sync() {
    "use strict";
    var transaction, URL;

    if (localStorage.length > 0) {

        transaction = localStorage.getItem('trans');

        URL = 'http://cs.ashesi.edu.gh/~csashesi/class2016/sheamus-yebisi/mobile_web/POS/php/teller_function.php?cmd=1&trans=' + transaction;
        sendRequest(URL);

        localStorage.clear();
    }
}

