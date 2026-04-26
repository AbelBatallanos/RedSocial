from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication


@database_sync_to_async
def _get_user_from_token(token):
    jwt_auth = JWTAuthentication()
    validated_token = jwt_auth.get_validated_token(token)
    return jwt_auth.get_user(validated_token)


class JWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        scope["user"] = AnonymousUser()
        token = self._extract_token(scope)
        if token:
            try:
                scope["user"] = await _get_user_from_token(token)
            except Exception:
                scope["user"] = AnonymousUser()
        return await self.app(scope, receive, send)

    def _extract_token(self, scope):
        query_params = parse_qs(scope.get("query_string", b"").decode())
        if "token" in query_params and query_params["token"]:
            return query_params["token"][0]

        for header_name, header_value in scope.get("headers", []):
            if header_name == b"authorization":
                auth_value = header_value.decode()
                if auth_value.lower().startswith("bearer "):
                    return auth_value.split(" ", 1)[1].strip()
        return None


def JWTAuthMiddlewareStack(app):
    return JWTAuthMiddleware(app)
