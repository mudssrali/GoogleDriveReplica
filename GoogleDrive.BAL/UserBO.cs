using GoogleDrive.Entities;
using System;

namespace GoogleDrive.BAL
{
    public static class UserBO
    {

        public static UserDTO ValidateUser(String pLogin, String pPassword)
        {
            return DAL.UserDAO.ValidateUser(pLogin, pPassword);
        }
        public static UserDTO GetUserById(int pid)
        {
            return DAL.UserDAO.GetUserById(pid);
        }
        public static int IsExistEmail(string email)
        {
            return DAL.UserDAO.IsExistEmail(email);
        }
    }
}
