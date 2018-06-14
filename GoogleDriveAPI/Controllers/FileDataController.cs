using GoogleDrive.BAL;
using GoogleDrive.Entities;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using Microsoft.WindowsAPICodePack.Shell;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace GoogleDriveAPI.Controllers
{
    public class FileDataController : ApiController
    {
        [HttpPost]
        public int UploadFile(int parentid,int ownerid)
        {
            var dto = new FileDTO();
            int rev = 0;
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
                            dto.ParentFolderID = parentid;
                            dto.Size = (file.ContentLength / 1024);
                            dto.FileType = file.ContentType;
                            dto.UniqueName = Guid.NewGuid().ToString();

                            // Getting physical path of folder where to save uploaded file 
                            var rootPath = HttpContext.Current.Server.MapPath("~/Files/");

                            var fileSavePath = Path.Combine(rootPath, dto.UniqueName + dto.Extension);

                            // Save the uploaded file to 'Files' directory
                            file.SaveAs(fileSavePath);

                            // Save File Meta data in Database
                            rev = FileBO.SaveFileInfo(dto,ownerid);
                        }
                    }
                }
                catch (Exception ex)
                {

                }
                
            }
            return rev;
        }
        [HttpGet]
        public Object DownloadFile(String uniqueName)
        {
            // Physical path of root folder
            var rootPath = HttpContext.Current.Server.MapPath("~/Files");

            // Find file from DB using unique name
            var dto = FileBO.GetFileInfoByUN(uniqueName);
            if (dto != null)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);

                var filefullpath = Path.Combine(rootPath, dto.UniqueName + dto.Extension);

                byte[] file = File.ReadAllBytes(filefullpath);
                MemoryStream ms = new MemoryStream(file);

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
        [HttpGet]
        public List<FileDTO> GetAllFiles(int parentid)
        {
            return GoogleDrive.BAL.FileBO.GetAllFileInfo(parentid);
        }
        [HttpGet]
        public Object GetThumbnail(string uniqueName)
        {

             // Physical path of root folder
            var rootPath = HttpContext.Current.Server.MapPath("~/Files");

            // Find file from DB using unique name
            var dto = FileBO.GetFileInfoByUN(uniqueName);
            var filefullpath = Path.Combine(rootPath, dto.UniqueName + dto.Extension);

            ShellFile shellFile = ShellFile.FromFilePath(filefullpath);
            Bitmap shellThumb = shellFile.Thumbnail.MediumBitmap;

            if (dto != null)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);

                byte[] file = ImageToByte2(shellThumb);
                MemoryStream ms = new MemoryStream(file);

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
        private byte[] ImageToByte2(System.Drawing.Image img)
        {
            using (var stream = new MemoryStream())
            {
                img.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                return stream.ToArray();
            }
        }
        [HttpGet]
        public Object GenerateMetadata(int folderid,int ownerid)
        {

            var ParentFolderDTO = FolderBO.GetFolderInfoByID(folderid);
            var ChildFolderDTO = FolderBO.GetAllFolderInfo(folderid,ownerid);

            var FileDTO = FileBO.GetAllFileInfo(folderid);


            // Generating Guid
            String fileName = Guid.NewGuid().ToString()+".pdf";

            // Physical path of root folder
            var rootPath = HttpContext.Current.Server.MapPath("~/Files");
            var filefullpath = Path.Combine(rootPath, fileName);
            
            // Making pdf file
            var writer = new PdfWriter(filefullpath);
            var pdf = new PdfDocument(writer);
            var document = new Document(pdf);

            document.Add(new Paragraph("Name: " + ParentFolderDTO.Name));
            document.Add(new Paragraph("Type: Folder"));
            document.Add(new Paragraph("Size: NILL"));
            if(ParentFolderDTO.ParentFolderID==0)
            document.Add(new Paragraph("Parent: ROOT"));
            else
            document.Add(new Paragraph("Parent: "+FolderBO.GetParentName(ParentFolderDTO.ParentFolderID)));
            document.Add(new Paragraph(Environment.NewLine));

            //Child Folders info
            if (ChildFolderDTO.Any(item => item.ID != 0))
            {
                document.Add(new Paragraph(" ******* Sub Directories Information ******"));
                document.Add(new Paragraph(Environment.NewLine));
                foreach (var item in ChildFolderDTO)
                {
                    document.Add(new Paragraph("Name: " + item.Name));
                    document.Add(new Paragraph("Type: Folder"));
                    document.Add(new Paragraph("Size: NILL"));
                    document.Add(new Paragraph("Parent: " + ParentFolderDTO.Name));
                    document.Add(new Paragraph(Environment.NewLine));
                }
            }
            if (FileDTO.Any(item => item.ID != 0))
            {
                // Files information
                document.Add(new Paragraph("******* File Information ********"));
                document.Add(new Paragraph(Environment.NewLine));
                foreach (var item in FileDTO)
                {
                    document.Add(new Paragraph("Name: " + item.Name));
                    document.Add(new Paragraph("Type: " + item.FileType));
                    document.Add(new Paragraph("Size: " + (item.Size) + " KB"));
                    document.Add(new Paragraph("Parent: " + ParentFolderDTO.Name));
                    document.Add(new Paragraph(Environment.NewLine));
                }
            }
            document.Close();

           
            if (fileName != null)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);

                byte[] file = File.ReadAllBytes(filefullpath);
                MemoryStream ms = new MemoryStream(file);

                response.Content = new ByteArrayContent(file);
                response.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");

                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/pdf");
                response.Content.Headers.ContentDisposition.FileName = fileName;
                return response;
            }
            else
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return response;
            }
        }
        [HttpGet]
        public Object DeleteFile(string uniqueName)
        {
            return FileBO.DeleteFile(uniqueName);
        }
        [HttpGet]
        public List<FileDTO> GetSearchResult(string searchable, int ownerid)
        {
            return GoogleDrive.BAL.FileBO.GetAllFileInfo(searchable,ownerid);
        }

    }
}
