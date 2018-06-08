using GoogleDrive.Entities;
using System;
using System.Data.SqlClient;

namespace GoogleDrive.DAL
{
    public static class UserDAO
    {
        public static UserDTO ValidateUser(String pLogin, String pPassword)
        {
            var query = $"Select * from Users Where Login='{pLogin}' and Password='{pPassword}'";

            using (DBHelper helper = new DBHelper())
            {
                var reader = helper.ExecuteReader(query);

                UserDTO dto = null;

                if (reader.Read())
                {
                    dto = FillDTO(reader);
                }

                return dto;
            }
        }

        public static UserDTO GetUserById(int pid)
        {

            var query = String.Format("Select * from Users Where UserId={0}", pid);

            using (DBHelper helper = new DBHelper())
            {
                var reader = helper.ExecuteReader(query);

                UserDTO dto = null;

                if (reader.Read())
                {
                    dto = FillDTO(reader);
                }

                return dto;
            }
        }
        private static UserDTO FillDTO(SqlDataReader reader)
        {
            var dto = new UserDTO();
            dto.UserID = reader.GetInt32(0);
            dto.Name = reader.GetString(1);
            dto.Login = reader.GetString(2);
            dto.Password = reader.GetString(3);
            dto.Email = reader.GetString(4);
            return dto;
        }
        public static int IsExistEmail(string email)
        {
            string sqlQuery = String.Format("Select UserID FROM Users WHERE email='{0}'", email);
            using (var helper = new DBHelper())
            {
                return Convert.ToInt32(helper.ExecuteScalar(sqlQuery));
            }
        }
    }
}
