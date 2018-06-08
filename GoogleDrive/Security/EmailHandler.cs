using System;
using System.Configuration;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace GoogleDrive.Security
{
   public class EmailHandler
    {
        /**/
        /** NETWORK VARs
        /**/
        NetworkCredential Login;
        SmtpClient Client;
        MailMessage Message;
       
        /*
         *  Data Caputuring from Web.Config file 
        */ 
        private string Email = ConfigurationManager.AppSettings["mailSender"];
        private string Password = ConfigurationManager.AppSettings["mailPassword"];
        private string Subject = ConfigurationManager.AppSettings["mailSubject"];
        private string ClientSmtp = ConfigurationManager.AppSettings["smtpClient"];
        private string ClientPort = ConfigurationManager.AppSettings["port"];
        private string SecretRecoveryCode = "45821";
        private string UID = "145242";
        /*
         * Properties  
        */

        public string GetSmtpException { get; set; }
        private string GetRecoveryCode { get; set; }

        public string EmailSender(string email)
        {
            GetRecoveryCode = ((Convert.ToInt32(SecretRecoveryCode) + (Convert.ToInt32(UID) % 2)*3 + (Convert.ToInt32(UID) % 3)+1)*4+5).ToString();
            Login = new NetworkCredential(Email.Substring(0, Email.IndexOf('@')), Password);
            Client = new SmtpClient(ClientSmtp);
            Client.Port = Convert.ToInt32(ClientPort);
            Client.EnableSsl = true;
            Client.Credentials = Login;

            Message = new MailMessage { From = new MailAddress(Email, Email.Substring(0, Email.IndexOf('@')), Encoding.UTF8) };
            Message.To.Add(new MailAddress(email));
            Message.Subject = Subject;
            Message.Body = $"Password recovery code is {GetRecoveryCode}<br>OR Click on the following recovery link <a href='/user/validate_web_code?recvid={GetRecoveryCode}'>password-recovery link</a>"; // Generating new recovery code
            Message.BodyEncoding = Encoding.UTF8;
            Message.IsBodyHtml = true;
            Message.Priority = MailPriority.Normal;

            Message.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;
            try
            {
                Client.Send(Message);
            }
            catch (SmtpException ex)
            {
                GetSmtpException = ex.Message;
            }
            return GetRecoveryCode;
        }
    }
}
