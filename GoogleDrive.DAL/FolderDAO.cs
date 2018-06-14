using GoogleDrive.Entities;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace GoogleDrive.DAL
{
    public static class FolderDAO
    {
        public static FolderDTO GetFolderInfoByID(int id)
        {
            var query = $"SELECT * FROM dbo.Folder WHERE ID='{id}'";
            using (var helper = new DBHelper())
            {
                var reader = helper.ExecuteReader(query);
                FolderDTO dto = null;
                if (reader.Read())
                {
                    dto = FillDTO(reader);
                }
                return dto;
            }
        }
        public static List<FolderDTO> GetAllFolderInfo(int ownerid)
        {
            var query = $"SELECT * FROM dbo.Folder WHERE IsActive=1 AND parentFolderID=0 AND OwnerID='{ownerid}'";
            using (var helper = new DBHelper())
            {
                var reader = helper.ExecuteReader(query);

                List<FolderDTO> list = new List<FolderDTO>();
                while(reader.Read())
                {
                    FolderDTO dto = new FolderDTO();
                    dto = FillDTO(reader);
                    list.Add(dto);
                }
                return list;
            }
        }
        public static List<FolderDTO> GetAllFolderInfo(int pid, int ownerid)
        {
            var query = $"SELECT * FROM dbo.Folder WHERE IsActive=1 AND parentFolderID='{pid}'";
            using (var helper = new DBHelper())
            {
                var reader = helper.ExecuteReader(query);

                List<FolderDTO> list = new List<FolderDTO>();
                while (reader.Read())
                {
                    FolderDTO dto = new FolderDTO();
                    dto = FillDTO(reader);
                    list.Add(dto);
                }
                return list;
            }
        }
        private static FolderDTO FillDTO(SqlDataReader reader)
        {
            var dto = new FolderDTO();
            dto.ID = reader.GetInt32(0);
            dto.Name = reader.GetString(1);
            dto.ParentFolderID = reader.GetInt32(2);
            dto.CreatedOn = reader.GetDateTime(3);
            dto.IsActive = reader.GetBoolean(4);
            return dto;
        }
        public static Int32 SaveFolderInfo(FolderDTO dto)
        {
            var query = $"INSERT dbo.Folder(Name, ParentFolderID,CreatedOn,IsActive,OwnerID) " +
                $"OUTPUT INSERTED.ID VALUES('{dto.Name}','{dto.ParentFolderID}','{dto.CreatedOn}','{dto.IsActive}', '{dto.OwnerID}')";
            using (var helper = new DBHelper())
            {
                return (int)helper.ExecuteScalar(query);
            }
        }
        public static Int32 DeleteFolder(int fid)
        {
            var query = $"UPDATE dbo.Folder SET isActive=0 WHERE ID='{fid}'";
            using (var helper = new DBHelper())
            {
                return helper.ExecuteQuery(query);
            }
        }
        public static Int32 RenameFolder(string fname, int fid)
        {
            var query = $"UPDATE dbo.Folder SET Name='{fname}' WHERE ID='{fid}'";
            using (var helper = new DBHelper())
            {
                return helper.ExecuteQuery(query);
            }
        }
        public static Int32 HasContentInFolder(int fid)
        {
            var query = $"UPDATE dbo.Folder SET isActive=false WHERE ID='{fid}'";
            using (var helper = new DBHelper())
            {
                return (int)helper.ExecuteScalar(query);
            }
        }
        public static String GetParentName(int fid)
        {
            var query = $"SELECT * FROM dbo.Folder WHERE ID='{fid}'";
            using (var helper = new DBHelper())
            {
                var reader = helper.ExecuteReader(query);
                FolderDTO dto = null;
                if (reader.Read())
                {
                    dto = FillDTO(reader);
                }
                return dto.Name;
            }
        }

    }
}
