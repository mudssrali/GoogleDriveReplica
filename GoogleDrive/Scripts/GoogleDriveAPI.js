$(document).ready(function () {

    var IS_DOUBLE_TRIGGERED = false;
    var fid = '';       // folder id
    var fname = '';     // folder name
    var filename = '';  // file name
   

    //Hiding operations delete, rename, upload, download
    $('#btnRenameFolder').hide();
    $('#btnDeleteFolder').hide();
    $('#btnUploadFile').hide();
    $('#btnDownloadMetadataFile').hide();
    $('#fileInfoTable').hide();

    //GETTING ALL FOLDER ON DOM READY

        GetAllFolder();

    // FOLDER SINGLE CLICK HANDLER
    $('#container').delegate('button', 'click', function () {
        if (IS_DOUBLE_TRIGGERED == false) {
            $('#btnRenameFolder').show(20);
            $('#btnDeleteFolder').show(20);
            fid = $(this).attr('id');
            fname = $(this).text();
        }
    });
    
    // FOLDER DOUBLE CLICK HANDLER
    $('#container').delegate('button', 'dblclick', function () {

        IS_DOUBLE_TRIGGERED = true;

        $('#btnRenameFolder').hide();
        $('#btnDeleteFolder').hide();

        fid = $(this).attr('id');
        fname = $(this).text();

        $('#btnUploadFile').show();
        $('#btnDownloadMetadataFile').show();

        // Creating visited directory path
        CreatePath(fname,fid);

        // For File Info Table
        CreateFileTable();
        GetAllFiles(fid);

    });

    //Annonymous function for different handlers
    $(function () {
        // HANDLER FOR FOLDER CREATION
        $("#btnCreateFolder").click(function () {
            $("#myform #valueFromMyButton").text($(this).val());
            $("#myform input[type=text]").val(fname);
            $("#valueFromMyModal").val('');
            $("#myform").show(400);
            $("#foldername").select();
        });
        $("#btnCreateOK").click(function (e) {
            e.preventDefault();
            var foldername = $("#myform input[type=text]").val();
            var customURL = '';
            $("#myform").hide(50);
            //Renaming a folder
            if (foldername.length != 0 || foldername.trim().length != 0) {

                if (fid > 0) {
                    //alert(foldername + fid);
                    customURL = "http://localhost:14125/api/Folder/RenameFolder?foldername=" + foldername + "&fid=" + fid;
                    RenameFolder(customURL);

                }
                //Deleting a folder
                else {
                    customURL = "http://localhost:14125/api/Folder/CreateFolder?foldername=" + foldername;
                    CreateFolder(customURL);
                }
            }
            else
            {
                alert("Please enter folder name properly");
            }
            // Resetting folder id and foldername
           // fid = 0;
           // fname = '';
        });
        $("#btnCloseCreateDialog").click(function (e) {
            e.preventDefault();
            $("#myform").hide(100);
        });
        // BUTTON HANDLER FOR RENAMING A FOLDER
        $("#btnRenameFolder").click(function () {
            // alert("rename method");
            $("#myform #popup-title").text('Renaming Folder');
            $('#btnCreateOK').html('Update Folder');
            $("#myform input[type=text]").val(fname);
            $("#myform").show(100);
            $("#foldername").select();
           
        });

        // BUTTON HANDLER FOR DELETING A FOLDER
        $("#btnDeleteFolder").click(function () {
            //alert("deletion method")
            if (confirm("Are you sure to delete '" + fname+ "' ?")) {
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
        $("#btnUploadOK").click(function (e) {
            e.preventDefault();
            //alert("upload file");
            var folderid = fid;
            var customURL = "http://localhost:14125/api/FileData/UploadFile?parentid=" + folderid;
            UploadFile(customURL,fid);
            $("#fileUploadForm").hide(200);
        });
        $("#btnCloseUploadDialog").click(function (e) {
            e.preventDefault();
            $("#fileUploadForm").hide(100);
        });


        // LINK HANDLER FOR DELETING FILE AND DOWNLOADING FILE
        $("#container").delegate('a', 'click', function () {
            var eclass = $(this).attr('class');
            var name = $(this).parent().siblings(":first").text();
            if (eclass == "Download") {
                var uniquename = $(this).attr('uname');
                 //alert(uniquename);
                var customURL = "http://localhost:14125/api/FileData/DownloadFile?uniqueName=" + uniquename;
                DownloadFile(customURL);
            }
            else {
                var uniquename = $(this).attr('uname');
                //alert(uniquename);
                if (confirm("Are you sure to delete file '" + name + "' ?")) {
                    var customURL = "http://localhost:14125/api/FileData/DeleteFile?uniqueName=" + uniquename;
                    DeleteFile(customURL);
                }
            }
        });

        // BUTTON HANDLER FOR DOWNLOADING METADATA AS PDF
        $("#btnDownloadMetadataFile").click(function () {

            //alert(fid);
            var customURL = "http://localhost:14125/api/FileData/GenerateMetadata?folderid=" + fid;
            // Openning url
            window.open(customURL);
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

                    // wrapping image arround button
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
function GetAllFiles(folderid)
{
    var fileID = "";
    var fileName = "";
    var fileInfo = "";
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: "http://localhost:14125/api/FileData/GetAllFiles?parentid=" + folderid,
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
function UploadFile(customURL,fid) {
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
                GetAllFiles(fid);
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
// Creating visting directory path
function CreatePath(foldername,folderid) {

    // Creating angle right symbol
    var angle = $("<i>");
    angle.addClass("fa fa-angle-right");
    angle.appendTo("#breadcrumbs");
    // Creating span
    var span = $("<span>");
    span.text(foldername);
    span.attr('id', "sp" + foldername);
    span.addClass("");
    span.appendTo("#breadcrumbs");
    //Wrapping span arround button
    $("#sp" + foldername).wrap($('<button>', {
        id: folderid,
        style: 'border: none; padding: 0; background: none',
        class: 'flink',
    }));
}