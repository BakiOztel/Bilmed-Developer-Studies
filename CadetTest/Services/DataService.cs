using CadetTest.Entities;
using CadetTest.Helpers;
using CadetTest.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CadetTest.Services
{
    public interface IDataService
    {
        string GetRandomString(int stringLength);
        void InitConsents();
        List<Consent> GetRangeById(int id, int adet);
        Task<Consent> AddConsent(NewConsentRequest data);
        Task DeleteConsent(int id);
        Task UpdateConsent(Consent data);
    }
    public class DataService : IDataService
    {
        private DataContext _context;
        private readonly AppSettings _appSettings;
        private readonly ILogger<UserService> _logger;
        private Random _random;

        public DataService(DataContext context, IOptions<AppSettings> appSettings, ILogger<UserService> logger)
        {
            _context = context;
            _appSettings = appSettings.Value;
            _logger = logger;

            _random = new Random();
        }

        #region Public Methods



        public List<Consent> GetRangeById(int id, int adet)
        {
            var cevap = _context.Consents.Where(k => k.Id >= id).Take(adet).ToList();
            return cevap;
        }
        #endregion

        // Değerleri gerçek bir databaseden çekmediğimizin farkındayım  
        // fakat ben yine de gerçek bir databaseden çekiyormuş gibi simüle edip async hazırladım

        async public Task<Consent> AddConsent(NewConsentRequest data)
        {
            try
            {
                var newCon = new Consent
                {
                    Recipient = data.Recipient,
                    RecipientType = data.RecipientType,
                    Status = data.Status,
                    Type = data.Type

                };


                await _context.Consents.AddAsync(newCon);
                await _context.SaveChangesAsync();
                return newCon;
            }catch(Exception err)
            {
                throw err;
            }
        }
        async public Task DeleteConsent(int id)
        {
            try
            {
                var data = await _context.Consents.FirstOrDefaultAsync(u => u.Id == id);
                 _context.Consents.Remove(data);
                await _context.SaveChangesAsync();
            }catch (Exception err)
            {
                throw  err;
            }
        }

        async public Task UpdateConsent(Consent data)
        {
            try
            {
                
                var veri = await _context.Consents.FirstOrDefaultAsync(u => u.Id == data.Id);
                veri.Recipient = data.Recipient;
                veri.RecipientType = data.RecipientType;
                veri.Status = data.Status;
                veri.Type = data.Type;
                await _context.SaveChangesAsync();
            }
            catch (Exception err)
            {
                throw err;
            }
        }

        public void InitConsents()
        {
            if (_context.Consents.Any()) return;

            for (int i = 1; i < _appSettings.ConsentCount; i++)
            {
                var consent = new Consent
                {
                    Recipient = $"{GetRandomString(10)}_{i}@ornek.com",
                    RecipientType = "EPOSTA",
                    Status = "ONAY",
                    Type = "EPOSTA"
                };

                _context.Consents.Add(consent);
            }
        }



        #region Private Methods

        public string GetRandomString(int stringLength)
        {
            var sb = new StringBuilder();
            int numGuidsToConcat = (((stringLength - 1) / 32) + 1);
            for (int i = 1; i <= numGuidsToConcat; i++)
            {
                sb.Append(Guid.NewGuid().ToString("N"));
            }

            return sb.ToString(0, stringLength);
        }


        #endregion
    }
}
