using CadetTest.Entities;
using CadetTest.Models;
using CadetTest.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CadetTest.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ConsentsController : ControllerBase
    {
        private ILogger<ConsentsController> _logger;
        private AppSettings _appSettings;
        private IDataService _dataService;
        private readonly JsonSerializerSettings _jsonSettings;

        public ConsentsController(ILogger<ConsentsController> logger, IOptions<AppSettings> appSettings, IDataService dataService)
        {
            _logger = logger;
            _appSettings = appSettings.Value;
            _dataService = dataService;
            _jsonSettings = new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
        }

        [HttpPost]
        public IActionResult Post(ConsentRequest request)
        {
            var cevap = _dataService.GetRangeById(request.StartId, request.Count);
            return Ok(cevap);
        }

        [HttpPost("CreateContents")]
        public async Task<IActionResult> Create(NewConsentRequest request)
        {
            try
            {
                var cevap = await _dataService.AddConsent(request);
                return Ok(cevap);
            }
            catch (Exception err)
            {
                return StatusCode(404, err);
            }
        }

        [HttpPatch]
        public async Task<IActionResult> Update(Consent request)
        {
            try
            {
                await _dataService.UpdateConsent(request);
                return Ok();
            }catch(Exception err)
            {
                return StatusCode(404, err);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                await _dataService.DeleteConsent(id);
                return Ok();
            }catch(Exception err)
            {
                return StatusCode(404, err);
            }
        }
    }
}
