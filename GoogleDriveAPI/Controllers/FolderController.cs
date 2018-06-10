using GoogleDrive.Entities;
using GoogleDrive.BAL;
using System;
using System.Web.Http;
using System.Collections.Generic;
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
        
    }

}
