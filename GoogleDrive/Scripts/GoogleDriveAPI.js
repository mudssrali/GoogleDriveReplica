$(document).ready(function () {

    var IS_DOUBLE_TRIGGERED = false;
    var fid = '';       // folder id
    var fname = '';     // folder name
    var filename = '';  // file name
   

    //Hiding operations delete, rename, upload, download
    $('#btnRenameFolder').hide();
    $('#btnDeleteFolder').hide();
    $('#btnUploadFile').hide();
    $('#btnDownloadMetaFile').hide();
    $('#fileInfoTable').hide();

    //Getting all folder on dom ready
    GetAllFolder();

    // Displaying option on single click
    $('#container').delegate('button', 'click', function () {
        if (IS_DOUBLE_TRIGGERED == false) {
            $('#btnRenameFolder').show(150);
            $('#btnDeleteFolder').show(150);
            fid = $(this).attr('id');
            fname = $(this).text();
        }
    });
    
    // Openning folder with double click
    $('#container').delegate('button', 'dblclick', function () {
        IS_DOUBLE_TRIGGERED = true;
        $('#btnRenameFolder').hide();
        $('#btnDeleteFolder').hide();
        fid = $(this).attr('id');
        fname = $(this).text();
        $('#btnUploadFile').show();
        $('#btnDownloadMetaFile').show();
        // For File Info Table
        CreateFileTable();
        GetAllFiles();

    });

    //Annonymous function for different handlers
    $(function () {
        // Creating folder
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
            if (confirm("Are you sure to delete?")) {
                var customURL = "http://localhost:14125/api/Folder/RemoveFolder?fid=" + fid;
                DeleteFolder(customURL);
            }
            else {
                $('#btnRenameFolder').hide();
                $('#btnDeleteFolder').hide();
                fid = 0; // setting NULL Folder id to ZERO
            }
        });

        // BUTTON HANDLER FOR FILE UPLOADING
        $("#btnUploadFile").click(function(){
            $("#fileUploadForm #titleUploadPopup").text('Upload File');
            $("#fileUploadForm input[type=file]").val('');
            $("#fileUploadForm").show(400);
        });
        $("#btnUploadOK").click(function () {
            //alert("upload file");
            var customURL = "http://localhost:14125/api/FileData/UploadFile";
            UploadFile(customURL);
            $("#fileUploadForm").hide(200);
        });

        // BUTTON HANDLER FOR DOWNLOADING FILE
        $("#container").delegate('a', 'click', function () {
            var eclass = $(this).attr('class');

            if (eclass == "Download") {
                var uniquename = $(this).attr('uname');
                //alert(uniquename);
                var customURL = "http://localhost:14125/api/FileData/DownloadFile?uniqueName=" + uniquename;
                DownloadFile(customURL);
            }
            else {
                var uniquename = $(this).attr('uname');
                //alert(uniquename);
                if (confirm("Are you sure to delete file?")) {
                    var customURL = "http://localhost:14125/api/FileData/DeleteFile?uniqueName=" + uniquename;
                    DeleteFile(customURL);
                }
            }
        });

    });   
});
// Displying all folders
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
// Displaying all files
function GetAllFiles()
{
    var fileID = "";
    var fileName = "";
    var fileInfo = "";
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: "http://localhost:14125/api/FileData/GetAllFiles",
        contentType: false,
        processData: false,
        success: function (JSONObject) {
            for (var key in JSONObject) {
                if (JSONObject.hasOwnProperty(key)) {
                    fileInfo += "<tr id=" + JSONObject[key]["ID"] + ">";
                    fileInfo += "<td>" + JSONObject[key]["Name"] + "</td>";
                    fileInfo += "<td>" + JSONObject[key]["FileType"] + "</td>";
                    fileInfo += "<td>" + JSONObject[key]["Size"]+" KB" + "</td>";
                    fileInfo += "<td><a href='#' uname='" + JSONObject[key]["UniqueName"] + "' class='Download'>Download</a></td>";
                   // fileInfo +=
                    //    "<td><a href='#' uname='" + JSONObject[key]["UniqueName"] + "' class='Delete'></a></td>";
                    fileInfo += "<td><img src='http://localhost:14125/api/FileData/GetThumbnail?uniqueName="+JSONObject[key]["UniqueName"]+"' style='width:8; height:6'></img></td>";
                    fileInfo += "<td><a href='#' uname='" + JSONObject[key]["UniqueName"] + "' class='Delete'>Delete</a></td>";
                    fileInfo += "</tr>";

                }
            }
            // Replace table’s tbody html with fileInfo
            $("#fileInfoTable tbody").html(fileInfo);       
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
function DeleteFolder(customURL)
{
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
// Uploading file
function UploadFile(customURL) {
    var data = new FormData();
    //var pfolderid = fid;
    var file = $('#fileUploadForm input[type=file]')[0].files[0];
    data.append('file', file);
    //data.append('pdif', pfolderid);
        $.ajax({
            url: customURL,
            processData: false,
            contentType: false,
            data: data,
            type: 'POST',
            success: function (result) {
                alert('File Uploaded');
             //   console.log(result);
                $('#container').removeClass('cols');
                $('#fileInfoTable').remove();
                CreateFileTable();
                GetAllFiles();
            }
        });
}
// Downloading file
function DownloadFile(customURL) {
    window.open(customURL);
}
// Downloading file
function DeleteFile(customURL) {
    // window.open(customURL);
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: customURL,
        contentType: false,
        processData: false,
        success: function (response) {
            alert("File Deleted");

            CreateFileTable();
            GetAllFiles();
        }
    });
}
// Creating dynamic table
function CreateFileTable() {
    $('#container').removeClass('cols');
    $("#container").empty();
    var $table = $('<table class="table table-borderd table-responsive" id="fileInfoTable">');
    $table.append('<thead>').children('thead')
        .append('<tr />').children('tr')
        .append('<th>Name</th><th>Type</th><th>Size</th><th>Download</th><th>Preview</th><th>Delete</th>');
    $table.append('<tbody />').children('tbody');
    $table.appendTo("#container");
}