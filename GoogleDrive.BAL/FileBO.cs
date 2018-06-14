using GoogleDrive.Entities;
using System.Collections.Generic;

namespace GoogleDrive.BAL
{
    public static class FileBO
    {
        public static FileDTO GetFileInfoByID(int id)
        {
            return GoogleDrive.DAL.FileDAO.GetFileInfoByID(id);
        }
        public static FileDTO GetFileInfoByUN(string uniqueName)
        {
            return GoogleDrive.DAL.FileDAO.GetFileInfoByUN(uniqueName);
        }
        public static List<FileDTO> GetAllFileInfo()
        {
            return GoogleDrive.DAL.FileDAO.GetAllFileInfo();
        }
        public static List<FileDTO> GetAllFileInfo(int fid)
        {
            return GoogleDrive.DAL.FileDAO.GetAllFileInfo(fid);
        }
        public static List<FileDTO> GetAllFileInfo(string searchable, int ownerid)
        {
            return GoogleDrive.DAL.FileDAO.GetAllFileInfo(searchable, ownerid);
        }

        public static System.Int32 SaveFileInfo(FileDTO dto,int ownerid)
        {
            return GoogleDrive.DAL.FileDAO.SaveFileInfo(dto,ownerid);
        }
        public static System.Int32 DeleteFile(int fid)
        {
            return GoogleDrive.DAL.FileDAO.DeleteFile(fid);
        }
        public static System.Int32 DeleteFile(string uniqueName)
        {
            return GoogleDrive.DAL.FileDAO.DeleteFile(uniqueName);
        }
        public static System.Int32 RenameFile(string fname, int fid)
        {
            return GoogleDrive.DAL.FileDAO.RenameFile(fname, fid);
        }
    }
}
