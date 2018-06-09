using GoogleDrive.Entities;
using GoogleDrive.BAL;
using System;
using System.Web.Http;
using System.Collections.Generic;
using System.Net.Http;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Net;
using System.IO;

namespace GoogleDriveAPI.Controllers
{

    public class FolderController : ApiController
    {
        [HttpGet]
        public String GetFolderName()
        {
            return "Pakistan";
        }
        [HttpGet]
        public String CreateFolder(string foldername)
        {
            var dto = new FolderDTO();
            dto.Name = foldername;
            dto.ParentFolderID = 0;
            dto.CreatedOn = DateTime.Now;
            dto.IsActive = true;
            int ID = FolderBO.SaveFolderInfo(dto);
            if (ID > 0)
            {
                dto.ID = ID;
            }
            return "newfolder";
        }
        public String CreateFolder(string foldername, int pfid)
        {
            var dto = new FolderDTO();
            dto.Name = foldername;
            dto.ParentFolderID = pfid;
            dto.CreatedOn = DateTime.Now;
            dto.IsActive = true;
            int ID = FolderBO.SaveFolderInfo(dto);
            if (ID > 0)
            {
                dto.ID = ID;
            }
            return "New folder created";
        }
        [HttpGet]
        public List<FolderDTO> GetAllFolder()
        {
            return FolderBO.GetAllFolderInfo();
        }
        [HttpGet]
        public String RemoveFolder(int fid)
        {
            int rev = FolderBO.DeleteFolder(fid);
            if (rev > 0)
            {
                return "Deleted";
            }
            return "Error";
        }
        [HttpGet]
        public String RenameFolder(string foldername, int fid)
        {
            int rev = FolderBO.RenameFolder(foldername, fid);
            if (rev > 0)
            {
                return "Folder name updated";
            }
            return "Error for updating folder name";
        }
        [HttpPost]
        public void UploadFile()
        {
            var dto = new FileDTO();
            /*
            string rootPath = HttpContext.Current.Server.MapPath("~/Files");

            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);

            // extract file name and file contents
            var fileNameParam = provider.Contents[0].Headers.ContentDisposition.Parameters
                .FirstOrDefault(p => p.Name.ToLower() == "filename");
            string fileName = (fileNameParam == null) ? "" : fileNameParam.Value.Trim('"');
            byte[] file = await provider.Contents[0].ReadAsByteArrayAsync();

            // Here you can use EF with an entity with a byte[] property, or
            // an stored procedure with a varbinary parameter to insert the
            // data into the DB

            dto.Name = fileName.Substring(0, fileName.IndexOf('.'));
            dto.Extension = fileName.Substring(fileName.IndexOf('.')+1);
            dto.Size = (file.Length / 1024);
            dto.UploadOn = DateTime.Now;
            dto.IsActive = true;

            //var result = string.Format("Received '{0}' with length: {1}", fileName, file.Length/1024);
            return dto;
            */
            if (HttpContext.Current.Request.Files.Count > 0)
            {
                try
                {
                    foreach (var fileName in HttpContext.Current.Request.Files.AllKeys)
                    {
                        HttpPostedFile file = HttpContext.Current.Request.Files[fileName];
                        if (file != null)
                        {
                            dto.Name = file.FileName;
                            dto.Extension = Path.GetExtension(file.FileName);
                            dto.IsActive = true;
                            dto.UploadOn = DateTime.Now;
                            dto.Size = (file.ContentLength / 1024);
                            dto.FileType = file.ContentType;
                            dto.FileUniqueName = Guid.NewGuid().ToString();

                            // Getting physical path of folder where to save uploaded file 
                            var rootPath = HttpContext.Current.Server.MapPath("~/Files");

                            var fileSavePath = System.IO.Path.Combine(rootPath, dto.FileUniqueName + dto.Extension);

                            // Save the uploaded file to 'Files' directory
                            file.SaveAs(fileSavePath);

                            // Save File Meta data in Database

                        }
                    }
                }
                catch (Exception ex)
                {

                }
            }
        }
        [HttpGet]
        public Object DownloadFile(String uniqueName)
        {
            // Physical path of root folder
            var rootPath = HttpContext.Current.Server.MapPath("~/Files");

            // Find file from DB using unique name
            var dto = new FileDTO();
            if (dto != null)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);

                var filefullpath = System.IO.Path.Combine(rootPath, dto.FileUniqueName + dto.Extension);

                byte[] file = System.IO.File.ReadAllBytes(filefullpath);
                System.IO.MemoryStream ms = new MemoryStream(file);

                response.Content = new ByteArrayContent(file);
                response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");

                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(dto.FileType);
                response.Content.Headers.ContentDisposition.FileName = dto.Name;
                return response;
            }
            else
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return response;
            }
        }

    }

}
