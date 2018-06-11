using GoogleDrive.Entities;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace GoogleDrive.DAL
{
    public static class FileDAO
    {
        public static FileDTO GetFileInfoByID(int id)
        {
            var query = $"SELECT * FROM dbo.Files WHERE ID='{id}'";
            using (var helper = new DBHelper())
            {
                var reader = helper.ExecuteReader(query);
                FileDTO dto = null;
                if (reader.Read())
                {
                    dto = FillDTO(reader);
                }
                return dto;
            }
        }
        public static FileDTO GetFileInfoByUN(string uniqueName)
        {
            var query = $"SELECT * FROM dbo.Files WHERE UniqueName='{uniqueName}'";
            using (var helper = new DBHelper())
            {
                var reader = helper.ExecuteReader(query);
                FileDTO dto = null;
                if (reader.Read())
                {
                    dto = FillDTO(reader);
                }
                return dto;
            }
        }

        public static List<FileDTO> GetAllFileInfo()
        {
            var query = "SELECT * FROM dbo.Files WHERE IsActive=1";
            using (var helper = new DBHelper())
            {
                var reader = helper.ExecuteReader(query);

                List<FileDTO> list = new List<FileDTO>();
                while (reader.Read())
                {
                    FileDTO dto = new FileDTO();
                    dto = FillDTO(reader);
                    list.Add(dto);
                }
                return list;
            }
        }
        public static List<FileDTO> GetAllFileInfo(int fid)
        {
            var query = $"SELECT * FROM dbo.Files WHERE IsActive=1 AND parentFolderID='{fid}'";
            using (var helper = new DBHelper())
            {
                var reader = helper.ExecuteReader(query);

                List<FileDTO> list = new List<FileDTO>();
                while (reader.Read())
                {
                    FileDTO dto = new FileDTO();
                    dto = FillDTO(reader);
                    list.Add(dto);
                }
                return list;
            }
        }
        private static FileDTO FillDTO(SqlDataReader reader)
        {
            var dto = new FileDTO();
            dto.ID = reader.GetInt32(0);
            dto.Name = reader.GetString(1);
            dto.UniqueName = reader.GetString(2);
            dto.ParentFolderID = reader.GetInt32(3);
            dto.Extension = reader.GetString(4);
            dto.Size = reader.GetInt32(5);
            dto.UploadOn = reader.GetDateTime(6);
            dto.FileType = reader.GetString(7);
            dto.IsActive = reader.GetBoolean(8);
            return dto;
        }
        public static Int32 SaveFileInfo(FileDTO dto)
        {
            var query = $"INSERT dbo.Files(Name,UniqueName, ParentFolderID,FileExt,FileSizeInKB,UploadOn,FileType,IsActive) " +
                $"OUTPUT INSERTED.ID VALUES('{dto.Name}','{dto.UniqueName}','{dto.ParentFolderID}','{dto.Extension}'," +
                $"'{dto.Size}','{dto.UploadOn}','{dto.FileType}','{dto.IsActive}')";
            using (var helper = new DBHelper())
            {
                return (int)helper.ExecuteScalar(query);
            }
        }
        public static Int32 DeleteFile(int fid)
        {
            var query = $"UPDATE dbo.Files SET isActive=0 WHERE ID='{fid}'";
            using (var helper = new DBHelper())
            {
                return helper.ExecuteQuery(query);
            }
        }
        public static Int32 DeleteFile(string uniqueName)
        {
            var query = $"UPDATE dbo.Files SET isActive=0 WHERE UniqueName='{uniqueName}'";
            using (var helper = new DBHelper())
            {
                return helper.ExecuteQuery(query);
            }
        }
        public static Int32 RenameFile(string fname, int fid)
        {
            var query = $"UPDATE dbo.Files SET Name='{fname}' WHERE ID='{fid}'";
            using (var helper = new DBHelper())
            {
                return helper.ExecuteQuery(query);
            }
        }
        public static Int32 HasContentInFile(int fid)
        {
            var query = $"UPDATE dbo.Files SET isActive=false WHERE ID='{fid}'";
            using (var helper = new DBHelper())
            {
                return (int)helper.ExecuteScalar(query);
            }
        }
    }
}
