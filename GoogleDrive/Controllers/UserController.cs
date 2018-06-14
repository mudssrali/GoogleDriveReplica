using GoogleDrive.BAL;
using GoogleDrive.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GoogleDrive.Controllers
{
    public class UserController : Controller
    {
        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(String login, String password)
        {
            if (login.Trim(' ').Length != 0 && password.Length != 0)
            {
                var obj = UserBO.ValidateUser(login, password);
                if (obj != null)
                {
                    Session["user"] = obj;
                    Session["userid"] = obj.UserID;
                    return Redirect("~/home/user");
                }
            }
            ViewBag.MSG = "Invalid login or password";
            ViewBag.Login = login;

            return View();

        }
        [HttpGet]
        public ActionResult Logout()
        {
            SessionManager.ClearSession();
            return RedirectToAction("login");
        }
    }
}