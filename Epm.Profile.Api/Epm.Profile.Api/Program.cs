using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Keycloak realm URL (used for UserInfo and JWT validation)
const string keycloakAuthority = "http://localhost:8080/realms/epm-realm";

// Add services to the container.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = keycloakAuthority;
        options.RequireHttpsMetadata = false; // dev only
        options.TokenValidationParameters = new TokenValidationParameters
        {
            NameClaimType = "preferred_username",
            ValidateAudience = false, // Keycloak access tokens often have variable/missing aud
            ValidateIssuer = true,
            ValidIssuer = keycloakAuthority,
        };
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = ctx =>
            {
                Console.WriteLine("[JWT] Auth failed: " + ctx.Exception.Message);
                return Task.CompletedTask;
            },
            OnChallenge = ctx =>
            {
                Console.WriteLine("[JWT] Challenge (no/invalid token): " + (ctx.AuthenticateFailure?.Message ?? "No token or invalid"));
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddHttpClient("Keycloak", client =>
{
    client.BaseAddress = new Uri(keycloakAuthority);
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("https://localhost:7100")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
