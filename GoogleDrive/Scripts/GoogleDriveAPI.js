$(document).ready(function () {
    GetAllFolder();
    $('.folder-link').on('click',function (e) {
        alert("single click");
        return false;
    });
    $(function () {
        $("#btnCreateFolder").click(function () {
            $("#myform #valueFromMyButton").text($(this).val());
            $("#myform input[type=text]").val('Untitled Folder');
            $("#valueFromMyModal").val('');
            $("#myform").show(400);
            $("#foldername").select();
        });
        $("#btnCreateOK").click(function () {
            var foldername = $("#myform input[type=text]").val();
            $("#myform").hide(50);
            // FOR FOLDER CREATION
            $.ajax({
                dataType: 'json',
                type: "GET",
                url: "http://localhost:14125/api/Folder/SetFolderName?foldername=" + foldername,
                contentType: false,
                processData: false,
                success: function (response) {
                    alert("Folder Created");
                    $("#container").empty();
                    GetAllFolder();
                }
            });
// FOR IMAGE GETTING
            $.ajax({
                url: 'GetImage',
                contentType: 'application/json; charset=utf-8',
                datatype: 'json',
                type: "GET",
                success: function (Data, Status, jqXHR) {
                    if (Data == "") {
                        alert("Empty");
                        return;
                    }  
                }
            });
            
        }); 
    });   
});
function singleClickFunc() { return false;}
function GetAllFolder()
{
    var folderID="";
    var folderName="";
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: "http://localhost:14125/api/Folder/GetAllFolder",
        contentType: false,
        processData: false,
        success: function (JSONObject)
        {
            for (var key in JSONObject) {
                if (JSONObject.hasOwnProperty(key)) {
                    folderID = JSONObject[key]['ID'];

                    // Creating Image element
                    var img = $("<img id='ficon" + JSONObject[key]['ID'] + "'> "); //Equivalent: $(document.createElement('img'))
                    img.attr('src', 'GetImage');
                    img.attr('class', "folder-link");
                    img.attr('width', 64);
                    img.attr('height', 64);
                    img.attr('onclick', "singleClickFunc()");
                    img.appendTo('#container');
                    $("#ficon" + folderID).wrap($('<a>', {
                        href: 'foldercontent?folderID=' + folderID,
                        class: 'folder-link',
                        onclick: "singleClickFunc()",
                    }));

                    // Creating folder named link
                    var para = $("<a href='foldercontent?folderID="+folderID+"' class='folder-link' onclick='singleClickFunc()'>");
                    para.text(JSONObject[key]['Name']);
                    para.appendTo('#container');
                   
                }
            }
        }
    });
}
function DeleteFolder(fid)
{
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: "http://localhost:14125/api/Folder/RemoveFolder?folderid=" + fid,
        contentType: false,
        processData: false,
        success: function (response) {
            alert("Folder Deleted");
            $("#container").empty();
            GetAllFolder();
        }
    });
}
function RenameFolder(fname,fid) {
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: "http://localhost:14125/api/Folder/RemoveFolder?foldername"+fname+"&folderid=" + fid,
        contentType: false,
        processData: false,
        success: function (response) {
            alert("Folder Name Updated");
            $("#container").empty();
            GetAllFolder();
        }
    });
}