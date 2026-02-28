"""
MiniDoc - OAuth Service
Handle OAuth flows for app integrations.
"""
import os
import json
import secrets
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import httpx
from urllib.parse import urlencode


class OAuthService:
    """Service for OAuth authentication flows."""
    
    # Provider configurations
    PROVIDERS = {
        "google": {
            "auth_url": "https://accounts.google.com/o/oauth2/v2/auth",
            "token_url": "https://oauth2.googleapis.com/token",
            "revoke_url": "https://oauth2.googleapis.com/revoke",
            "scopes": [
                "https://www.googleapis.com/auth/gmail.readonly",
                "https://www.googleapis.com/auth/gmail.send",
                "https://www.googleapis.com/auth/gmail.compose",
                "https://www.googleapis.com/auth/drive.readonly",
                "https://www.googleapis.com/auth/drive.file",
                "https://www.googleapis.com/auth/calendar",
                "https://www.googleapis.com/auth/calendar.events",
                "https://www.googleapis.com/auth/userinfo.email",
                "https://www.googleapis.com/auth/userinfo.profile"
            ]
        },
        "microsoft": {
            "auth_url": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
            "token_url": "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            "scopes": [
                "openid",
                "profile",
                "email",
                "offline_access",
                "https://graph.microsoft.com/Mail.Read",
                "https://graph.microsoft.com/Mail.Send",
                "https://graph.microsoft.com/Files.Read",
                "https://graph.microsoft.com/Files.ReadWrite",
                "https://graph.microsoft.com/Calendars.ReadWrite"
            ]
        }
    }
    
    def __init__(self):
        self.google_client_id = os.getenv("GOOGLE_CLIENT_ID", "")
        self.google_client_secret = os.getenv("GOOGLE_CLIENT_SECRET", "")
        self.google_redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "")
        
        self.microsoft_client_id = os.getenv("MICROSOFT_CLIENT_ID", "")
        self.microsoft_client_secret = os.getenv("MICROSOFT_CLIENT_SECRET", "")
        self.microsoft_redirect_uri = os.getenv("MICROSOFT_REDIRECT_URI", "")
        
        self.supabase_url = os.getenv("SUPABASE_URL", "")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_KEY", os.getenv("SUPABASE_ANON_KEY", ""))
    
    def _get_headers(self) -> dict:
        """Get headers for Supabase API requests."""
        return {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json",
        }
    
    def generate_auth_url(
        self, 
        provider: str, 
        user_id: str,
        state: str = None
    ) -> Dict[str, str]:
        """
        Generate OAuth authorization URL for a provider.
        
        Args:
            provider: 'google' or 'microsoft'
            user_id: User ID for state tracking
            state: Optional custom state parameter
            
        Returns:
            Dict with 'auth_url' and 'state'
        """
        if provider not in self.PROVIDERS:
            return {"error": f"Unknown provider: {provider}"}
        
        config = self.PROVIDERS[provider]
        
        # Generate state for CSRF protection
        state = state or secrets.token_urlsafe(32)
        
        if provider == "google":
            params = {
                "client_id": self.google_client_id,
                "redirect_uri": self.google_redirect_uri,
                "response_type": "code",
                "scope": " ".join(config["scopes"]),
                "access_type": "offline",
                "prompt": "consent",
                "state": f"{user_id}:{state}"
            }
        elif provider == "microsoft":
            params = {
                "client_id": self.microsoft_client_id,
                "redirect_uri": self.microsoft_redirect_uri,
                "response_type": "code",
                "scope": " ".join(config["scopes"]),
                "response_mode": "query",
                "state": f"{user_id}:{state}"
            }
        else:
            return {"error": "Provider not configured"}
        
        auth_url = f"{config['auth_url']}?{urlencode(params)}"
        
        return {
            "auth_url": auth_url,
            "state": state
        }
    
    async def exchange_code(
        self, 
        provider: str, 
        code: str
    ) -> Dict[str, Any]:
        """
        Exchange authorization code for tokens.
        
        Args:
            provider: 'google' or 'microsoft'
            code: Authorization code from OAuth callback
            
        Returns:
            Dict with tokens and user info
        """
        if provider not in self.PROVIDERS:
            return {"error": f"Unknown provider: {provider}"}
        
        config = self.PROVIDERS[provider]
        
        if provider == "google":
            data = {
                "client_id": self.google_client_id,
                "client_secret": self.google_client_secret,
                "code": code,
                "redirect_uri": self.google_redirect_uri,
                "grant_type": "authorization_code"
            }
        elif provider == "microsoft":
            data = {
                "client_id": self.microsoft_client_id,
                "client_secret": self.microsoft_client_secret,
                "code": code,
                "redirect_uri": self.microsoft_redirect_uri,
                "grant_type": "authorization_code"
            }
        else:
            return {"error": "Provider not configured"}
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                config["token_url"],
                data=data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code != 200:
                return {
                    "error": f"Token exchange failed: {response.text}",
                    "status_code": response.status_code
                }
            
            tokens = response.json()
        
        # Calculate token expiration
        expires_in = tokens.get("expires_in", 3600)
        expires_at = datetime.utcnow() + timedelta(seconds=expires_in)
        
        return {
            "success": True,
            "access_token": tokens.get("access_token"),
            "refresh_token": tokens.get("refresh_token"),
            "expires_at": expires_at.isoformat(),
            "token_type": tokens.get("token_type", "Bearer"),
            "scope": tokens.get("scope", "")
        }
    
    async def refresh_token(
        self, 
        provider: str, 
        refresh_token: str
    ) -> Dict[str, Any]:
        """
        Refresh an expired access token.
        
        Args:
            provider: 'google' or 'microsoft'
            refresh_token: The refresh token
            
        Returns:
            Dict with new tokens
        """
        if provider not in self.PROVIDERS:
            return {"error": f"Unknown provider: {provider}"}
        
        config = self.PROVIDERS[provider]
        
        if provider == "google":
            data = {
                "client_id": self.google_client_id,
                "client_secret": self.google_client_secret,
                "refresh_token": refresh_token,
                "grant_type": "refresh_token"
            }
        elif provider == "microsoft":
            data = {
                "client_id": self.microsoft_client_id,
                "client_secret": self.microsoft_client_secret,
                "refresh_token": refresh_token,
                "grant_type": "refresh_token"
            }
        else:
            return {"error": "Provider not configured"}
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                config["token_url"],
                data=data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code != 200:
                return {
                    "error": f"Token refresh failed: {response.text}",
                    "status_code": response.status_code
                }
            
            tokens = response.json()
        
        expires_in = tokens.get("expires_in", 3600)
        expires_at = datetime.utcnow() + timedelta(seconds=expires_in)
        
        return {
            "success": True,
            "access_token": tokens.get("access_token"),
            "refresh_token": tokens.get("refresh_token", refresh_token),  # MS may not return new refresh token
            "expires_at": expires_at.isoformat()
        }
    
    async def revoke_access(
        self, 
        provider: str, 
        token: str
    ) -> bool:
        """
        Revoke OAuth access for a provider.
        
        Args:
            provider: 'google' or 'microsoft'
            token: Access or refresh token
            
        Returns:
            True if successful
        """
        if provider == "google":
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.PROVIDERS["google"]["revoke_url"],
                    params={"token": token}
                )
                return response.status_code == 200
        elif provider == "microsoft":
            # Microsoft doesn't have a revoke endpoint
            # We just delete the stored tokens
            return True
        
        return False
    
    # ==================== Database Operations ====================
    
    async def store_connection(
        self,
        user_id: str,
        provider: str,
        access_token: str,
        refresh_token: str,
        expires_at: str,
        scope: str = ""
    ) -> Dict[str, Any]:
        """Store OAuth connection in database."""
        connection_data = {
            "user_id": user_id,
            "provider": provider,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_expires_at": expires_at,
            "scopes": scope.split() if scope else [],
            "connected_at": datetime.utcnow().isoformat(),
            "last_used_at": datetime.utcnow().isoformat()
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Check if connection exists
            check_response = await client.get(
                f"{self.supabase_url}/rest/v1/app_connections?user_id=eq.{user_id}&provider=eq.{provider}",
                headers=self._get_headers()
            )
            
            existing = check_response.json() if check_response.status_code == 200 else []
            
            if existing:
                # Update existing connection
                response = await client.patch(
                    f"{self.supabase_url}/rest/v1/app_connections?user_id=eq.{user_id}&provider=eq.{provider}",
                    headers=self._get_headers(),
                    json={
                        "access_token": access_token,
                        "refresh_token": refresh_token,
                        "token_expires_at": expires_at,
                        "scopes": connection_data["scopes"],
                        "last_used_at": datetime.utcnow().isoformat()
                    }
                )
            else:
                # Create new connection
                response = await client.post(
                    f"{self.supabase_url}/rest/v1/app_connections",
                    headers=self._get_headers(),
                    json=connection_data
                )
            
            if response.status_code in [200, 201]:
                return {"success": True, "connection": connection_data}
            else:
                return {"success": False, "error": response.text}
    
    async def get_connection(
        self,
        user_id: str,
        provider: str
    ) -> Optional[Dict[str, Any]]:
        """Get stored OAuth connection."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.supabase_url}/rest/v1/app_connections?user_id=eq.{user_id}&provider=eq.{provider}",
                headers=self._get_headers()
            )
            
            if response.status_code == 200:
                data = response.json()
                return data[0] if data else None
        
        return None
    
    async def delete_connection(
        self,
        user_id: str,
        provider: str
    ) -> bool:
        """Delete stored OAuth connection."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.delete(
                f"{self.supabase_url}/rest/v1/app_connections?user_id=eq.{user_id}&provider=eq.{provider}",
                headers=self._get_headers()
            )
            
            return response.status_code == 200
    
    async def get_valid_token(
        self,
        user_id: str,
        provider: str
    ) -> Optional[str]:
        """
        Get a valid access token, refreshing if necessary.
        
        Returns:
            Valid access token or None
        """
        connection = await self.get_connection(user_id, provider)
        if not connection:
            return None
        
        # Check if token is expired
        expires_at_str = connection.get("token_expires_at")
        if expires_at_str:
            expires_at = datetime.fromisoformat(expires_at_str.replace("Z", "+00:00"))
            if datetime.utcnow() > expires_at.replace(tzinfo=None) - timedelta(minutes=5):
                # Token is expired or about to expire, refresh it
                refresh_result = await self.refresh_token(
                    provider, 
                    connection.get("refresh_token")
                )
                
                if refresh_result.get("success"):
                    # Store new tokens
                    await self.store_connection(
                        user_id=user_id,
                        provider=provider,
                        access_token=refresh_result["access_token"],
                        refresh_token=refresh_result["refresh_token"],
                        expires_at=refresh_result["expires_at"]
                    )
                    return refresh_result["access_token"]
                else:
                    return None
        
        return connection.get("access_token")


# Singleton instance
oauth_service = OAuthService()
