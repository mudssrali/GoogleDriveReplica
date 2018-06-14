using GoogleDrive.Entities;
using System.Collections.Generic;

namespace GoogleDrive.BAL
{
    public static class FolderBO
    {
        public static FolderDTO GetFolderInfoByID(int id)
        {
            return GoogleDrive.DAL.FolderDAO.GetFolderInfoByID(id);
        }
        public static List<FolderDTO> GetAllFolderInfo(int ownerid)
        {
            return GoogleDrive.DAL.FolderDAO.GetAllFolderInfo(ownerid);
        }
        public static List<FolderDTO> GetAllFolderInfo(int parentid, int ownerid)
        {
            return GoogleDrive.DAL.FolderDAO.GetAllFolderInfo(parentid, ownerid);
        }
        public static System.Int32 SaveFolderInfo(FolderDTO dto)
        {
            return GoogleDrive.DAL.FolderDAO.SaveFolderInfo(dto);
        }
        public static System.String GetParentName(int fid)
        {
            return GoogleDrive.DAL.FolderDAO.GetParentName(fid);
        }

        public static System.Int32 DeleteFolder(int fid)
        {
            return GoogleDrive.DAL.FolderDAO.DeleteFolder(fid);
        }
        public static System.Int32 RenameFolder(string fname,int fid)
        {
            return GoogleDrive.DAL.FolderDAO.RenameFolder(fname,fid);
        }
    }
}
