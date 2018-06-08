
namespace GoogleDrive.Entities
{
    public class FolderDTO
    {
        public System.Int32 ID { get; set; }
        public System.String Name { get; set; }
        public System.Int32 ParentFolderID { get; set; }
        public System.Int32 Size { get; set; }
        public System.DateTime CreatedOn { get; set; }
        public System.Boolean IsActive { get; set; }
    }
}
