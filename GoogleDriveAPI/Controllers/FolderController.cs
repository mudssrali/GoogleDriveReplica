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
        public FolderDTO SetFolderName(string foldername)
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
            return dto;
        }
        public FolderDTO CreateFolder(string foldername, int parentid)
        {
            var dto = new FolderDTO();
            dto.Name = foldername;
            dto.ParentFolderID = parentid;
            dto.CreatedOn = DateTime.Now;
            dto.IsActive = true;
            int ID = FolderBO.SaveFolderInfo(dto);
            if (ID > 0)
            {
                dto.ID = ID;
            }
            return dto;
        }
        [HttpGet]
        public List<FolderDTO> GetAllFolder()
        {
            return FolderBO.GetAllFolderInfo();
        }
        [HttpGet]
        public String RemoveFolder(int folderid)
        {
            int rev = FolderBO.DeleteFolder(folderid);
            if (rev > 0)
            {
                return "Deleted";
            }
            return "Error";
        }
        [HttpGet]
        public String RenameFolder(string foldername,int folderid)
        {
            int rev = FolderBO.RenameFolder(foldername,folderid);
            if (rev > 0)
            {
                return "Updated";
            }
            return "Error";
        }


    }
}
