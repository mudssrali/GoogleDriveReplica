$(document).ready(function () {

    var fid = '';
    var fname = '';
    //Hiding operations delete, rename,
    $('#btnRenameFolder').hide();
    $('#btnDeleteFolder').hide();
    //Getting all folder on dom ready
    GetAllFolder();

    // Displaying option on single click

    $('#container').delegate('button', 'click', function () {
        $('#btnRenameFolder').show();
        $('#btnDeleteFolder').show();
        fid = $(this).attr('id');
        fname = $(this).text();
    });

    // Renaming
    $('#container').delegate('button', 'dblclick', function () {
        alert($(this).attr('id'));
    });

    //Annonymous function for different handlers
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
        $("#btnRenameFolder").click(function () {
            alert("rename method");
        });
        $("#btnDeleteFolder").click(function () {

            DeleteFolder(fid);

        });
    });   
});
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
                    var img = $("<img id='ficon" + JSONObject[key]['ID'] + "' style='border: none; padding: 0; background: none'> "); //Equivalent: $(document.createElement('img'))
                    img.attr('src', 'GetImage');
                    img.attr('width', 64);
                    img.attr('height', 64);
                    
                    img.appendTo('#container');

                    // wrapping link arround image
                    $("#ficon" + folderID).wrap($('<button>',{
                        id: folderID,
                        style: 'border: none; padding: 0; background: none',
                        class: 'flink',
                    }));

                   // Creating folder named link
                   // var namedlink = $('<a>');
                   // namedlink.text(JSONObject[key]['Name']);
                   // namedlink.attr('href', 'foldercontent?folderID=' + folderID);
                   // namedlink.attr('class', "flink");
                   // namedlink.appendTo('#container');

                    // Creating folder named link
                    var namedlink = $('<button>');
                    namedlink.text(JSONObject[key]['Name']);
                    namedlink.attr('style', 'border:none');
                    namedlink.attr('id', folderID);
                    namedlink.attr('class', 'flink');
                    namedlink.attr('style', 'border: none; padding: 0; background: none')
                    namedlink.appendTo('#container');            
                }
            }
        }
    });
}
// Deleting a folder using folder id
function DeleteFolder(folderid)
{
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: "http://localhost:14125/api/Folder/RemoveFolder?folderid=" + folderid,
        contentType: false,
        processData: false,
        success: function (response) {
            alert("Folder Deleted");
            $('#btnRenameFolder').hide();
            $('#btnDeleteFolder').hide();
            $("#container").empty();
            GetAllFolder();
        }
    });
}
// Renaming a folder using folder id
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