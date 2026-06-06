from app.schemas.auth import TokenResponse, AuthResponse, LoginRequest, RegisterRequest

print("TokenResponse fields:")
for name, field in TokenResponse.model_fields.items():
    print(f"  {name}: {field.annotation}")

print("\nLoginRequest fields:")
for name, field in LoginRequest.model_fields.items():
    print(f"  {name}: {field.annotation}")

print("\nRegisterRequest fields:")
for name, field in RegisterRequest.model_fields.items():
    print(f"  {name}: {field.annotation}")
