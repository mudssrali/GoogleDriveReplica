$(document).ready(function () {

    var fid = '';       // folder id
    var fname = '';     // folder name
    var filename = '';  // file name

    //Hiding operations delete, rename, upload, download
    $('#btnRenameFolder').hide();
    $('#btnDeleteFolder').hide();
    $('#btnUploadFile').hide();
    $('#btnDownloadFile').hide();

    //Getting all folder on dom ready
    GetAllFolder();

    // Displaying option on single click
    $('#container').delegate('button', 'click', function () {
        $('#btnRenameFolder').show();
        $('#btnDeleteFolder').show();
        fid = $(this).attr('id');
        fname = $(this).text();
    });
    
    // Openning folder with double click
    $('#container').delegate('button', 'dblclick', function () {
        $('#btnRenameFolder').hide();
        $('#btnDeleteFolder').hide();
        fid = $(this).attr('id');
        fname = $(this).text();
        $('#container').empty();
        $('#btnUploadFile').show();
        $('#btnDownloadFile').show();
        

    });

    //Annonymous function for different handlers
    $(function () {
        $("#btnCreateFolder").click(function () {
            $("#myform #valueFromMyButton").text($(this).val());
            $("#myform input[type=text]").val(fname);
            $("#valueFromMyModal").val('');
            $("#myform").show(400);
            $("#foldername").select();
        });
        $("#btnCreateOK").click(function () {
            var foldername = $("#myform input[type=text]").val();
            $("#myform").hide(50);
            var customURL = '';
            if (fid > 0) {
                customURL = "http://localhost:14125/api/Folder/RenameFolder?foldername=" + foldername + "&fid=" + fid;
                RenameFolder(customURL);
            }
            else {
                customURL = "http://localhost:14125/api/Folder/CreateFolder?foldername=" + foldername;
                CreateFolder(customURL);
            }
        });

        // BUTTON HANDLER FOR RENAMING A FOLDER
        $("#btnRenameFolder").click(function () {
            // alert("rename method");
            $("#myform #popup-title").text('Renaming Folder');
            $("#myform input[type=text]").val(fname);
            $("#valueFromMyModal").val('');
            $("#myform").show(400);
            $('#btnCreateOK').val('Update Folder');
            $("#foldername").select();
        });

        // BUTTON HANDLER FOR DELETING A FOLDER
        $("#btnDeleteFolder").click(function () {
            //alert("deletion method")
            DeleteFolder(fid);
            fid = 0; // setting NULL Folder id to ZERO
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

// Creating a new folder 
function CreateFolder(customURL) {
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: customURL,
        contentType: false,
        processData: false,
        success: function (response) {
            alert("New folder created");
            $("#container").empty();
            GetAllFolder();
        }
    });
}
// Deleting a folder using folder id
function DeleteFolder(folderid)
{
    var customURL = "http://localhost:14125/api/Folder/RemoveFolder?fid=" + folderid;

    $.ajax({
        dataType: 'json',
        type: "GET",
        url: customURL,
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
// Renaming a folder using URL from #btnCreateOK
function RenameFolder(customURL) {
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: customURL,
        contentType: false,
        processData: false,
        success: function (response) {
            fid = 0;
            fname = '';
            alert("Folder Name Updated");
            $("#container").empty();
            $('#btnRenameFolder').hide();
            $('#btnDeleteFolder').hide();
            GetAllFolder();
        }
    });
}