/*global document, $, jQuery, sendRequest, cordova, addToTable, alert, getProducts, externalDataDirectory */

var products;
var server = "http://cs.ashesi.edu.gh/~csashesi/class2016/sheamus-yebisi/mobile_web/POS/php/";
var scanned_products = "";
var total = 0;

$(function () {
    "use strict";
    $("#scanBarcodeOffline").click(function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                $("#barcodeInputOffline").val(result.text);
            },
            function (error) {
                $("#barcodeInputOffline").val(error);
            }
        );
    });
});

function submitOffline() {
    "use strict";
    var json_trans, URL, response, phoneNumber, transactioToStore;

    phoneNumber = $("#phoneNumber").val();

    if (phoneNumber.length > 0) {
        if (scanned_products.length > 0) {

            json_trans = '{"phoneNumber":"' + phoneNumber + '","total":' + total + ',"productBarcode":[' + scanned_products + ']}';

            localStorage.setItem("trans", json_trans);

            $("#transaction-table tbody").empty();
            total = parseFloat(0);
            $("#total").html(total);
        }
    } else {
        alert("No phone number found.");
    }

}

function addToTableOffline() {
    "use strict";

    var bcode, name, price;

    bcode = $("barcodeInputOffline").val();
    name = $("#nameInputOffline").val();
    price = $("#priceInputOffline").val();
    if (bcode === "" || name === "" || price === "") {
        alert("Please make sure you have filled the form completely.");
    } else {
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
        $("#totalOffline").html(total);

    }
}

function sendRequest(u) {
    "use strict";
    var obj, result;
    obj = $.ajax({url: u, async: false});
    result = $.parseJSON(obj.responseText);
    return result;
}

function testOffline() {
    "use strict";
    $("#barcodeInputOffline").val(1234243);
}

