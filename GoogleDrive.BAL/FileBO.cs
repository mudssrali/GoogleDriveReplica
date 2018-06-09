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
        public static System.Int32 SaveFileInfo(FileDTO dto)
        {
            return GoogleDrive.DAL.FileDAO.SaveFileInfo(dto);
        }
        public static System.Int32 DeleteFile(int fid)
        {
            return GoogleDrive.DAL.FileDAO.DeleteFile(fid);
        }
        public static System.Int32 RenameFile(string fname, int fid)
        {
            return GoogleDrive.DAL.FileDAO.RenameFile(fname, fid);
        }
    }
}
