using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Epm.Profile.Api.Controllers
{
    [ApiController]
    [Route("api/profile")]
    public class ProfileController : ControllerBase
    {
        private const string KeycloakUserInfoPath = "/protocol/openid-connect/userinfo";
        private readonly IHttpClientFactory _httpClientFactory;

        public ProfileController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        /// <summary>
        /// Gets the current user's profile from Keycloak (UserInfo endpoint) and returns it to the UI.
        /// </summary>
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
        {
            var authHeader = Request.Headers.Authorization.FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                return Unauthorized();
            }

            var accessToken = authHeader["Bearer ".Length..].Trim();
            var client = _httpClientFactory.CreateClient("Keycloak");
            var request = new HttpRequestMessage(HttpMethod.Get, KeycloakUserInfoPath);
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

            var response = await client.SendAsync(request, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Failed to get profile from Keycloak");
            }

            var profileJson = await response.Content.ReadAsStringAsync(cancellationToken);
            return Content(profileJson, "application/json");
        }
    }
}
