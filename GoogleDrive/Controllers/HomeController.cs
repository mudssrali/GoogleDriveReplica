using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using GoogleDrive.BAL;
using GoogleDrive.Security;

namespace GoogleDrive.Controllers
{               
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult User()
        {
            if (SessionManager.IsValidUser)
            {
                    return View();
            }
            else
            {
                return Redirect("~/user/login");
            }
        }
        [HttpGet]
        public ActionResult GetImage()
        {

            string targetFolder = System.Web.HttpContext.Current.Server.MapPath("~/Content/Image/folder-icon.png");
            byte[] img = System.IO.File.ReadAllBytes(targetFolder);
            return File(img, "image/png");
        }
        [HttpGet]
        public ActionResult FolderContent(int folderID)
        {
            var dto = FolderBO.GetFolderInfoByID(folderID);
            ViewBag.FolderID = dto.ID;
            ViewBag.FolderName = dto.Name;
            return View();
        }
    }
}