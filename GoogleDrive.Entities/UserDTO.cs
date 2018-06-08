using System;
using System.ComponentModel.DataAnnotations;

namespace GoogleDrive.Entities
{
    public class UserDTO
    {
        public int UserID { get; set; }
        [Required(ErrorMessage = "User {0} is required")]
        [StringLength(100, MinimumLength = 3,
        ErrorMessage = "Name Should be minimum 3 characters and a maximum of 100 characters")]
        [DataType(DataType.Text)]
        public String Name { get; set; }
        [Required(ErrorMessage = "User {0} is required")]
        [StringLength(100, MinimumLength = 3,
        ErrorMessage = "Login Should be minimum 3 characters and a maximum of 100 characters")]
        [DataType(DataType.Text)]
        public String Login { get; set; }
        [Required(ErrorMessage = "Password {0} is required")]
        [StringLength(100, MinimumLength = 3,
        ErrorMessage = "Password Should be minimum 6 characters and a maximum of 100 characters")]
        [DataType(DataType.Password)]

        public String Password { get; set; }
        [Required]
        public String Email { get; set; }

    }
}

