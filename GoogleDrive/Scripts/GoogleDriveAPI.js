$(document).ready(function () {

    var IsDoubleClickTriggered = false;
    var IsChildFolderActive = false;

    var FolderGlobalID = 0;       
    var ParentFolderGlobalID = 0;
    var FolderGlobalName = '';    
    var FileGlobalName = '';  
    var UserGlobalID = $('#userID').val();

    //Hiding operations delete, rename, upload, download
    $('#btnRenameFolder').hide();
    $('#btnDeleteFolder').hide();
    $('#btnUploadFile').hide();
    $('#btnDownloadMetadataFile').hide();
    $('#fileInfoTable').hide();

    // handling bootstrap tooltip
    $('[data-toggle="tooltip"]').tooltip();
    $('#breadcrumbs').delegate('button', 'mouseover', function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    $('#container, #containerchild').delegate('button', 'mouseover', function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    //GETTING ALL FOLDER BY OWNER ID ON DOM READY

    GetAllFolder(UserGlobalID);

    // FOLDER SINGLE CLICK HANDLER
    $('#container, #containerchild').delegate('button', 'click', function () {
        if (IsDoubleClickTriggered == false) {
            $('#btnRenameFolder').show(20);
            $('#btnDeleteFolder').show(20);
            ParentFolderGlobalID = FolderGlobalID;
            FolderGlobalID = $(this).attr('id');
            FolderGlobalName = $(this).text();
        }
        else if (IsDoubleClickTriggered == true) {
            $('#btnUploadFile').hide();
            $('#btnDownloadMetadataFile').hide();
            $('#btnRenameFolder').show(20);
            $('#btnDeleteFolder').show(20);
            FolderGlobalID = $(this).attr('id');
            FolderGlobalName = $(this).text();
        }
    });

    // FOLDER DOUBLE CLICK HANDLER  
    $('#container, #containerchild').delegate('button', 'dblclick', function () {

        IsDoubleClickTriggered = true;

        $('#btnRenameFolder').hide();
        $('#btnDeleteFolder').hide();
        ParentFolderGlobalID = FolderGlobalID;
        FolderGlobalID = $(this).attr('id');
        FolderGlobalName = $(this).text();

        $('#btnUploadFile').show();
        $('#btnDownloadMetadataFile').show();

        // Creating visited directory path
        CreatePath(FolderGlobalName, FolderGlobalID);
        // Loading Child folders
        IsChildFolderActive = GetAllChildFolder(FolderGlobalID, UserGlobalID);

        // For File Info Table
        CreateFileTable();
        GetAllFiles(FolderGlobalID);

    });

    //Annonymous function for different handlers
    $(function () {
        // HANDLER FOR FOLDER CREATION
        $("#btnCreateFolder").click(function () {
            $("#createFolderForm #valueFromMyButton").text($(this).val());
            $("#createFolderForm input[type=text]").val("Untitled Folder");
            $("#btnCreateOK").addClass('create-folder');
            $("#btnCreateOK").html('Create Folder');
            $("#createFolderForm").show(400);
            $("#foldername").select();
        });
        $("#btnCreateOK").click(function (e) {

            e.preventDefault();
            var foldername = $("#createFolderForm input[type=text]").val();
            var customURL = '';
            var pfid = ParentFolderGlobalID;
            var ownerid = UserGlobalID;
            $("#createFolderForm").hide(50);

            if (foldername.length != 0 || foldername.trim().length != 0) {
                //Creating parent folder
                if ($(this).hasClass('create-folder') && FolderGlobalID == 0) {
                    
                    customURL = "http://localhost:14125/api/Folder/CreateFolder?foldername=" + foldername + "&ownerid=" + ownerid;
                    CreateFolder(customURL, ownerid);
                    
                    $(this).removeClass('create-folder');
                }
                //Creating child folder
                else if ($(this).hasClass('create-folder') && FolderGlobalID > 0) {
                    
                    customURL = "http://localhost:14125/api/Folder/CreateFolder?foldername=" + foldername + "&parentid=" + pfid + "&ownerid=" + ownerid;
                    CreateChildFolder(customURL,pfid,ownerid);
                    
                    $(this).removeClass('create-folder');
                }
                //Renaming a folder
                else if ($(this).hasClass('rename-folder') && FolderGlobalID > 0) {
                    customURL = "http://localhost:14125/api/Folder/RenameFolder?foldername=" + foldername + "&fid=" + FolderGlobalID;

                    RenameFolder(customURL, IsChildFolderActive, pfid, ownerid);
                    ParentFolderGlobalID = 0;
                    FolderGlobalID = 0;

                    $(this).removeClass('rename-folder');
                }
            }
            else {
                alert("Enter folder name properly!");
            }

        });
        $("#btnCloseCreateDialog").click(function (e) {
            e.preventDefault();
            $("#createFolderForm").hide(100);
        });
        // BUTTON HANDLER FOR RENAMING A FOLDER
        $("#btnRenameFolder").click(function () {
        
            $("#createFolderForm #popup-title").text('Renaming Folder');
            $('#btnCreateOK').html('Update Folder');
            $('#btnCreateOK').addClass('rename-folder');
            $("#createFolderForm input[type=text]").val(FolderGlobalName);
            $("#createFolderForm").show(100);
            $("#foldername").select();

        });

        // BUTTON HANDLER FOR DELETING A FOLDER
        $("#btnDeleteFolder").click(function () {
            var ownerid = UserGlobalID;
            if (confirm("Are you sure to delete '" + FolderGlobalName + "' ?")) {
                var customURL = "http://localhost:14125/api/Folder/RemoveFolder?fid=" + FolderGlobalID;
                DeleteFolder(customURL, IsChildFolderActive, ParentFolderGlobalID, ownerid);
				ParentFolderGlobalID = 0;
            }
            else {
                $('#btnRenameFolder').hide();
                $('#btnDeleteFolder').hide();
                FolderGlobalID = 0;
                ParentFolderGlobalID = 0;
            }
        });

        // BUTTON HANDLER FOR FILE UPLOADING
        $("#btnUploadFile").click(function () {
            $("#fileUploadForm #titleUploadPopup").text('Upload File');
            $("#fileUploadForm input[type=file]").val('');
            $("#fileUploadForm").show(400);
        });
        $("#btnUploadOK").click(function (e) {
            e.preventDefault();

            var folderid = FolderGlobalID;
            var ownerid = UserGlobalID;
            var customURL = "http://localhost:14125/api/FileData/UploadFile?parentid=" + folderid + "&ownerid=" + ownerid;
            UploadFile(customURL, folderid);
            $("#fileUploadForm").hide(200);
        });
        $("#btnCloseUploadDialog").click(function (e) {
            e.preventDefault();
            $("#fileUploadForm").hide(100);
        });
        // LINK HANDLER FOR DELETING FILE AND DOWNLOADING FILE
        $("#container").delegate('a', 'click', function () {

            var eclass = $(this).attr('class');                    // checking which class

            var name = $(this).parent().siblings(":first").text(); // actual name of a file
            var uniquename = $(this).attr('uname');                // unique name of a file
            var fileid = $(this).closest('tr').attr('id');         // file id
            var folderid = FolderGlobalID;                         

            if (eclass == "Download") {
                var customURL = "http://localhost:14125/api/FileData/DownloadFile?uniqueName=" + uniquename;
                DownloadFile(customURL);
            }
            else {
                if (confirm("Are you sure to delete file '" + name + "' ?")) {
                    var customURL = "http://localhost:14125/api/FileData/DeleteFile?uniqueName=" + uniquename;
                    DeleteFile(customURL, folderid);
					
                }
            }
        });
        // BUTTON HANDLER FOR DOWNLOADING METADATA AS PDF
        $("#btnDownloadMetadataFile").click(function () {
            var customURL = "http://localhost:14125/api/FileData/GenerateMetadata?folderid=" + FolderGlobalID + "&ownerid=" + UserGlobalID;
            window.open(customURL);
        });
        // DIRECTORY PATH HANDLER
        $("#breadcrumbs").delegate('button', 'click', function (e) {
            e.preventDefault();
            var folderid = $(this).attr('id');
            var foldername = $(this).text();

            IsChildFolderActive = GetAllChildFolder(folderid, UserGlobalID);
            CreateFileTable();
            GetAllFiles(folderid);

            ParentFolderGlobalID = folderid;

            $(this).nextAll('button, i').remove();
        });
        // Moving back to parent directory
        $("#breadcrumbs").delegate('a', 'click', function (e) {
            ParentFolderGlobalID = 0;
            FolderGlobalID = 0;
        });
        // SEARCHING FILE
        $("#btnSearchFile").click(function (e) {
            var ownerid = UserGlobalID;
            e.preventDefault();          
            var search = $("#searchable").val();
            $('#breadcrumbs').empty();
       
            var link = $("<a>");
            link.attr('href', 'user');
            link.text('Home');
            link.attr('title', 'Back to home');
            link.attr('style', 'margin-left: 0.6em');
            link.attr('data-toggle', 'tooltip');
            link.appendTo('#breadcrumbs');
            
            $('#btnRenameFolder').hide();
            $('#btnDeleteFolder').hide();
            $('#btnUploadFile').hide();
            $('#btnDownloadMetadataFile').hide();
            $('#containerchild').hide();

            CreateFileTable(); 
            SearchFile(search,ownerid);
        });
    });
});
// Displying all folders
function GetAllFolder(ownerid) {
    var folderID = "";
    var folderName = "";
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: "http://localhost:14125/api/Folder/GetAllFolder?ownerid=" + ownerid,
        contentType: false,
        processData: false,
        success: function (JSONObject) {
            for (var key in JSONObject) {
                if (JSONObject.hasOwnProperty(key)) {
                    folderID = JSONObject[key]['ID'];
                    folderName = JSONObject[key]['Name'];

                    // Creating Image element
                    var img = $("<img id='ficon" + folderID + "' style='border: none; padding: 0; background: none'> "); //Equivalent: $(document.createElement('img'))
                    img.attr('src', 'GetImage');
                    img.attr('width', 64);
                    img.attr('height', 64);
                    img.attr('uname', folderName);
                    img.attr('title', 'Open ' + folderName);
                    img.attr('data-toggle', 'tooltip');
                    // appending to div with id #container
                    img.appendTo('#container');

                    // wrapping image arround button
                    $("#ficon" + folderID).wrap($("<button>", {
                        id: folderID,
                        style: 'border: none; padding: 0; background: none',
                        class: 'flink',
                    }));

                    var sp = $("<span>");
                    sp.text(" ");
                    sp.appendTo("#container");

                    var namedlink = $('<button>');
                    namedlink.text(JSONObject[key]['Name']);
                    namedlink.attr('id', folderID);
                    namedlink.attr('class', 'flink');
                    namedlink.attr('title', 'Open ' + folderName);
                    namedlink.attr('data-toggle', 'tooltip');

                    namedlink.attr('style', 'border: none; padding: 0; background: none')
                    namedlink.appendTo('#container');
                }
            }
        }
    });
}
// Displaying child folders
function GetAllChildFolder(parentid,ownerid) {
    var flag = false;
    var folderID = parentid;
    var folderName = "";
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: "http://localhost:14125/api/Folder/GetAllFolder?parentid=" + parentid+"&ownerid="+ownerid,
        contentType: false,
        processData: false,
        success: function (JSONObject) {
            $('#containerchild').empty();
            for (var key in JSONObject) {
                if (JSONObject.hasOwnProperty(key)) {
                    flag = true;
                    folderID = JSONObject[key]['ID'];
                    folderName = JSONObject[key]['Name'];

                    // Creating Image element
                    var img = $("<img id='ficon" + folderID + "' style='border: none; padding: 0; background: none'> "); //Equivalent: $(document.createElement('img'))
                    img.attr('src', 'GetImage');
                    img.attr('width', 64);
                    img.attr('height', 64);
                    img.attr('title', 'Open ' + folderName);
                    img.attr('data-toggle', 'tooltip');

                    img.appendTo('#containerchild');

                    // wrapping image arround button
                    $("#ficon" + folderID).wrap($('<button>', {
                        id: folderID,
                        value: folderName,
                        style: 'border: none; padding: 0; background: none',
                    }));

                    var sp = $("<span>");
                    sp.text(" ");
                    sp.appendTo("#containerchild");

                    // Creating folder named link
                    var namedlink = $('<button>');
                    namedlink.text(JSONObject[key]['Name']);
                    namedlink.attr('id', folderID);
                    namedlink.attr('class', 'flink');
                    namedlink.attr('title', 'Open ' + folderName);
                    namedlink.attr('data-toggle', 'tooltip');
                    namedlink.attr('style', 'border: none; padding: 0; background: none')
                    namedlink.appendTo('#containerchild');
                }
            }
        }
    });
    return true;
}
// Displaying all files
function GetAllFiles(folderid) {
    var fileID = "";
    var FileGlobalName = "";
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
                    fileInfo += "<td>" + JSONObject[key]["Size"] + " KB" + "</td>";
                    fileInfo += "<td><a data-toggle='tooltip' title='Click to download' href='#' uname='" + JSONObject[key]["UniqueName"] + "' class='Download'>Download</a></td>";
                    fileInfo += "<td><a data-toggle='tooltip' title='Click to delete' href='#' uname='" + JSONObject[key]["UniqueName"] + "' class='Delete'>Delete</a></td>";
                    fileInfo += "<td><img src='http://localhost:14125/api/FileData/GetThumbnail?uniqueName=" + JSONObject[key]["UniqueName"] + "' style='width:8; height:6'></img></td>";
                    fileInfo += "</tr>";
                }
            }
            // Replace table’s tbody html with fileInfo
            $("#fileInfoTable tbody").html(fileInfo);
        }
    });
}
// Creating a new folder 
function CreateFolder(customURL, ownerid) {
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: customURL,
        contentType: false,
        processData: false,
        success: function (response) {
            alert("New folder created");
            $("#container").empty();
            GetAllFolder(ownerid);
        }
    });
}
// Creating new child folder
function CreateChildFolder(customURL, folderid,ownerid) {
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: customURL,
        contentType: false,
        processData: false,
        success: function (response) {
            alert("New folder created");
            $("#containerchild").empty();
            GetAllChildFolder(folderid,ownerid);
        }
    });
}
// Deleting a folder using folder id
function DeleteFolder(customURL, flag, parentid,ownerid) {
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: customURL,
        contentType: false,
        processData: false,
        success: function (response) {
            alert("Folder Deleted");
            if (flag == false) {
                $("#container").empty();
                $('#btnRenameFolder').hide();
                $('#btnDeleteFolder').hide();
                GetAllFolder(ownerid);
            }
            else if (flag == true) {
                $("#containerchild").empty();
                $('#btnRenameFolder').hide();
                $('#btnDeleteFolder').hide();

                $('#btnUploadFile').show();
                $('#btnDownloadMetadataFile').show();

                GetAllChildFolder(parentid, ownerid);
            }
        }
    });
}
// Renaming a folder using URL from #btnCreateOK
function RenameFolder(customURL, flag, parentid,ownerid) {
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: customURL,
        contentType: false,
        processData: false,
        success: function (response) {
            FolderGlobalName = '';
            alert("Folder Name Updated");
            if (flag == false) {
                $("#container").empty();
                $('#btnRenameFolder').hide();
                $('#btnDeleteFolder').hide();
                GetAllFolder(ownerid);
            }
            else if (flag == true) {
                $("#containerchild").empty();
                $('#btnRenameFolder').hide();
                $('#btnDeleteFolder').hide();

                $('#btnUploadFile').show();
                $('#btnDownloadMetadataFile').show();

                GetAllChildFolder(parentid, ownerid);

            }
        }
    });
}
// Uploading file
function UploadFile(customURL, folderid) {
    var data = new FormData();
    var file = $('#fileUploadForm input[type=file]')[0].files[0];
    data.append('file', file);
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
            GetAllFiles(folderid);
        }
    });
}
// Downloading file
function DownloadFile(customURL) {
    window.open(customURL);
}
// Deleteing file
function DeleteFile(customURL, folderid) {
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: customURL,
        contentType: false,
        processData: false,
        success: function (response) {
            alert("File Deleted");
            CreateFileTable();
            GetAllFiles(folderid);
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
        .append('<th>Name</th><th>Type</th><th>Size</th><th>Download</th><th>Delete</th><th>Preview</th>');
    $table.append('<tbody />').children('tbody');
    $table.appendTo("#container");
}
// Creating visting directory path
function CreatePath(foldername, folderid) {
    var angle = $("<i>");
    angle.addClass("fa fa-angle-right");
    angle.appendTo("#breadcrumbs");
    
    var button = $("<button>");
    button.text(foldername);
    button.attr('id', folderid);
    button.attr('data-toggle', 'tooltip');
    button.attr('title', 'Open ' + foldername);
    button.addClass("path");
    button.attr('style', 'border: none; padding: 0; background: none');
    button.appendTo("#breadcrumbs");
}
// Search files using name
function SearchFile(searchable,ownerid) {
    var fileInfo = '';
        $.ajax({
        dataType: 'json',
            type: "GET",
            url: "http://localhost:14125/api/FileData/GetSearchResult?searchable=" + searchable + "&ownerid=" + ownerid,
        contentType: false,
        processData: false,
            success: function (JSONObject) {
            for (var key in JSONObject) {
                if (JSONObject.hasOwnProperty(key)) {
                    fileInfo += "<tr id=" + JSONObject[key]["ID"] + ">";
                    fileInfo += "<td>" + JSONObject[key]["Name"] + "</td>";
                    fileInfo += "<td>" + JSONObject[key]["FileType"] + "</td>";
                    fileInfo += "<td>" + JSONObject[key]["Size"] + " KB" + "</td>";
                    fileInfo += "<td><a href='#' uname='" + JSONObject[key]["UniqueName"] + "' class='Download'>Download</a></td>";
                    fileInfo += "<td><img src='http://localhost:14125/api/FileData/GetThumbnail?uniqueName=" + JSONObject[key]["UniqueName"] + "' style='width:8; height:6'></img></td>";
                    fileInfo += "<td><a href='#' uname='" + JSONObject[key]["UniqueName"] + "' class='Delete'>Delete</a></td>";
                    fileInfo += "</tr>";
                }
            }
            // Replace table’s tbody html with fileInfo
                $("#fileInfoTable tbody").html(fileInfo);
        }
    });    
}