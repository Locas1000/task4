using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Task4.Server.Data;

namespace Task4.Server.Middleware // Ensure namespace matches your project
{
    public class UserStatusMiddleware
    {
        private readonly RequestDelegate _next;

        public UserStatusMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IServiceScopeFactory scopeFactory)
        {
            // 1. Get the Authorization header (e.g., "Bearer dummy-token-12345...")
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

            // 2. Check if it is one of OUR tokens
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer dummy-token-"))
            {
                // 3. Extract the User ID from the string
                var userIdString = authHeader.Replace("Bearer dummy-token-", "");

                if (Guid.TryParse(userIdString, out var userId))
                {
                    using (var scope = scopeFactory.CreateScope())
                    {
                        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        var user = await dbContext.Users.FindAsync(userId);

                        // 4. CRITICAL CHECK: Kick them out if blocked or deleted
                        if (user == null || user.Status == "Blocked")
                        {
                            context.Response.StatusCode = 401; // Unauthorized
                            context.Response.ContentType = "application/json";
                            await context.Response.WriteAsync("{\"message\": \"User is blocked or deleted.\"}");
                            return; // 🛑 STOP THE REQUEST HERE
                        }
                    }
                }
            }

            // 5. If no token or user is active, let them pass
            await _next(context);
        }
    }
}