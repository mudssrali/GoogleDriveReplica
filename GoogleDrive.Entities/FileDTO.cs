namespace GoogleDrive.Entities
{
    public class FileDTO
    {
        public System.Int32 ID { get; set; }
        public System.String Name { get; set; }
        public System.Int32 ParentFolderID { get; set; }
        public System.String Extension { get; set; }
        public System.Int32 Size { get; set; }
        public System.DateTime UploadOn { get; set; }
        public System.Boolean IsActive { get; set;}
        public System.String FileType { get; set; }
        public System.String UniqueName { get; set; }

    }
}
