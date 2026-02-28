"""
MiniDoc - Google Service
Gmail, Drive, and Calendar integrations.
"""
import os
import base64
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import httpx
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


class GoogleService:
    """Service for Google Workspace integrations."""
    
    API_BASE = "https://www.googleapis.com"
    
    def __init__(self):
        pass
    
    def _get_headers(self, token: str) -> dict:
        """Get headers for Google API requests."""
        return {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
    
    # ==================== Gmail ====================
    
    async def get_emails(
        self,
        token: str,
        query: str = "",
        max_results: int = 10,
        label_ids: List[str] = None
    ) -> Dict[str, Any]:
        """
        Get emails from Gmail.
        
        Args:
            token: Access token
            query: Gmail search query
            max_results: Maximum number of results
            label_ids: Filter by labels (INBOX, SENT, etc.)
            
        Returns:
            Dict with list of emails
        """
        params = {
            "maxResults": max_results,
            "q": query
        }
        
        if label_ids:
            params["labelIds"] = ",".join(label_ids)
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Get message list
            response = await client.get(
                f"{self.API_BASE}/gmail/v1/users/me/messages",
                headers=self._get_headers(token),
                params=params
            )
            
            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"Gmail API error: {response.text}",
                    "emails": []
                }
            
            messages = response.json().get("messages", [])
            
            # Get details for each message
            emails = []
            for msg in messages[:max_results]:
                detail = await client.get(
                    f"{self.API_BASE}/gmail/v1/users/me/messages/{msg['id']}",
                    headers=self._get_headers(token),
                    params={"format": "metadata", "metadataHeaders": ["From", "To", "Subject", "Date"]}
                )
                
                if detail.status_code == 200:
                    msg_data = detail.json()
                    headers = {h["name"]: h["value"] for h in msg_data.get("payload", {}).get("headers", [])}
                    
                    emails.append({
                        "id": msg_data["id"],
                        "thread_id": msg_data.get("threadId"),
                        "from": headers.get("From", ""),
                        "to": headers.get("To", ""),
                        "subject": headers.get("Subject", ""),
                        "date": headers.get("Date", ""),
                        "snippet": msg_data.get("snippet", ""),
                        "label_ids": msg_data.get("labelIds", [])
                    })
            
            return {
                "success": True,
                "emails": emails,
                "count": len(emails)
            }
    
    async def get_email(
        self,
        token: str,
        message_id: str
    ) -> Dict[str, Any]:
        """
        Get full email content.
        
        Args:
            token: Access token
            message_id: Gmail message ID
            
        Returns:
            Dict with full email data
        """
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.API_BASE}/gmail/v1/users/me/messages/{message_id}",
                headers=self._get_headers(token),
                params={"format": "full"}
            )
            
            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"Gmail API error: {response.text}"
                }
            
            msg_data = response.json()
            headers = {h["name"]: h["value"] for h in msg_data.get("payload", {}).get("headers", [])}
            
            # Extract body
            body = ""
            payload = msg_data.get("payload", {})
            
            if "body" in payload and "data" in payload["body"]:
                body = base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", errors="ignore")
            elif "parts" in payload:
                for part in payload["parts"]:
                    if part.get("mimeType") == "text/plain" and "data" in part.get("body", {}):
                        body = base64.urlsafe_b64decode(part["body"]["data"]).decode("utf-8", errors="ignore")
                        break
            
            return {
                "success": True,
                "email": {
                    "id": msg_data["id"],
                    "thread_id": msg_data.get("threadId"),
                    "from": headers.get("From", ""),
                    "to": headers.get("To", ""),
                    "subject": headers.get("Subject", ""),
                    "date": headers.get("Date", ""),
                    "body": body,
                    "snippet": msg_data.get("snippet", ""),
                    "label_ids": msg_data.get("labelIds", [])
                }
            }
    
    async def send_email(
        self,
        token: str,
        to: str,
        subject: str,
        body: str,
        cc: str = None,
        bcc: str = None,
        html: bool = False
    ) -> Dict[str, Any]:
        """
        Send an email via Gmail.
        
        Args:
            token: Access token
            to: Recipient email address
            subject: Email subject
            body: Email body
            cc: CC recipients
            bcc: BCC recipients
            html: Whether body is HTML
            
        Returns:
            Dict with message ID
        """
        # Create message
        message = MIMEMultipart() if html else MIMEText(body, "plain" if not html else "html")
        
        if html:
            message.attach(MIMEText(body, "html"))
        
        message["to"] = to
        message["subject"] = subject
        if cc:
            message["cc"] = cc
        if bcc:
            message["bcc"] = bcc
        
        # Encode message
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode("utf-8")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.API_BASE}/gmail/v1/users/me/messages/send",
                headers=self._get_headers(token),
                json={"raw": raw_message}
            )
            
            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"Gmail API error: {response.text}"
                }
            
            result = response.json()
            
            return {
                "success": True,
                "message_id": result.get("id"),
                "thread_id": result.get("threadId")
            }
    
    async def draft_email(
        self,
        token: str,
        to: str,
        subject: str,
        body: str
    ) -> Dict[str, Any]:
        """
        Create an email draft in Gmail.
        
        Args:
            token: Access token
            to: Recipient email address
            subject: Email subject
            body: Email body
            
        Returns:
            Dict with draft ID
        """
        message = MIMEText(body)
        message["to"] = to
        message["subject"] = subject
        
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode("utf-8")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.API_BASE}/gmail/v1/users/me/drafts",
                headers=self._get_headers(token),
                json={"message": {"raw": raw_message}}
            )
            
            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"Gmail API error: {response.text}"
                }
            
            result = response.json()
            
            return {
                "success": True,
                "draft_id": result.get("id"),
                "message_id": result.get("message", {}).get("id")
            }
    
    # ==================== Google Drive ====================
    
    async def list_files(
        self,
        token: str,
        query: str = "",
        page_size: int = 20,
        order_by: str = "modifiedTime desc"
    ) -> Dict[str, Any]:
        """
        List files from Google Drive.
        
        Args:
            token: Access token
            query: Drive search query
            page_size: Number of results
            order_by: Sort order
            
        Returns:
            Dict with list of files
        """
        params = {
            "pageSize": page_size,
            "orderBy": order_by,
            "fields": "files(id, name, mimeType, size, modifiedTime, webViewLink, iconLink)",
            "q": query
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.API_BASE}/drive/v3/files",
                headers=self._get_headers(token),
                params=params
            )
            
            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"Drive API error: {response.text}",
                    "files": []
                }
            
            files = response.json().get("files", [])
            
            return {
                "success": True,
                "files": files,
                "count": len(files)
            }
    
    async def get_file(
        self,
        token: str,
        file_id: str
    ) -> Dict[str, Any]:
        """
        Get file metadata from Google Drive.
        
        Args:
            token: Access token
            file_id: Drive file ID
            
        Returns:
            Dict with file metadata
        """
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.API_BASE}/drive/v3/files/{file_id}",
                headers=self._get_headers(token),
                params={"fields": "id, name, mimeType, size, modifiedTime, createdTime, webViewLink, description, owners"}
            )
            
            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"Drive API error: {response.text}"
                }
            
            return {
                "success": True,
                "file": response.json()
            }
    
    async def download_file(
        self,
        token: str,
        file_id: str
    ) -> Dict[str, Any]:
        """
        Download a file from Google Drive.
        
        Args:
            token: Access token
            file_id: Drive file ID
            
        Returns:
            Dict with file content
        """
        async with httpx.AsyncClient(timeout=60.0) as client:
            # Get file metadata first
            meta_response = await client.get(
                f"{self.API_BASE}/drive/v3/files/{file_id}",
                headers=self._get_headers(token),
                params={"fields": "id, name, mimeType, size"}
            )
            
            if meta_response.status_code != 200:
                return {
                    "success": False,
                    "error": f"Drive API error: {meta_response.text}"
                }
            
            file_meta = meta_response.json()
            
            # Download content
            content_response = await client.get(
                f"{self.API_BASE}/drive/v3/files/{file_id}?alt=media",
                headers=self._get_headers(token)
            )
            
            if content_response.status_code != 200:
                return {
                    "success": False,
                    "error": f"Drive download error: {content_response.text}"
                }
            
            return {
                "success": True,
                "filename": file_meta.get("name"),
                "mime_type": file_meta.get("mimeType"),
                "size": file_meta.get("size"),
                "content": content_response.content
            }
    
    async def upload_file(
        self,
        token: str,
        filename: str,
        content: bytes,
        mime_type: str,
        parent_folder_id: str = None
    ) -> Dict[str, Any]:
        """
        Upload a file to Google Drive.
        
        Args:
            token: Access token
            filename: Name for the file
            content: File content as bytes
            mime_type: MIME type
            parent_folder_id: Parent folder ID (optional)
            
        Returns:
            Dict with file ID and URL
        """
        metadata = {"name": filename}
        if parent_folder_id:
            metadata["parents"] = [parent_folder_id]
        
        # Use multipart upload
        boundary = "minidoc_upload_boundary"
        
        body = f"--{boundary}\r\n"
        body += "Content-Type: application/json; charset=UTF-8\r\n\r\n"
        body += f'{metadata}\r\n'
        body += f"--{boundary}\r\n"
        body += f"Content-Type: {mime_type}\r\n\r\n"
        
        # Combine parts
        body_bytes = body.encode("utf-8") + content + f"\r\n--{boundary}--\r\n".encode("utf-8")
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": f"multipart/related; boundary={boundary}"
                },
                content=body_bytes
            )
            
            if response.status_code not in [200, 201]:
                return {
                    "success": False,
                    "error": f"Drive upload error: {response.text}"
                }
            
            result = response.json()
            
            return {
                "success": True,
                "file_id": result.get("id"),
                "name": result.get("name"),
                "web_view_link": result.get("webViewLink")
            }
    
    # ==================== Google Calendar ====================
    
    async def get_events(
        self,
        token: str,
        time_min: datetime = None,
        time_max: datetime = None,
        max_results: int = 20
    ) -> Dict[str, Any]:
        """
        Get calendar events.
        
        Args:
            token: Access token
            time_min: Start time filter
            time_max: End time filter
            max_results: Maximum results
            
        Returns:
            Dict with list of events
        """
        if not time_min:
            time_min = datetime.utcnow()
        if not time_max:
            time_max = time_min + timedelta(days=30)
        
        params = {
            "timeMin": time_min.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "timeMax": time_max.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "maxResults": max_results,
            "singleEvents": True,
            "orderBy": "startTime"
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{self.API_BASE}/calendar/v3/calendars/primary/events",
                headers=self._get_headers(token),
                params=params
            )
            
            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"Calendar API error: {response.text}",
                    "events": []
                }
            
            events = []
            for event in response.json().get("items", []):
                events.append({
                    "id": event.get("id"),
                    "summary": event.get("summary", ""),
                    "description": event.get("description", ""),
                    "location": event.get("location", ""),
                    "start": event.get("start", {}).get("dateTime", event.get("start", {}).get("date", "")),
                    "end": event.get("end", {}).get("dateTime", event.get("end", {}).get("date", "")),
                    "organizer": event.get("organizer", {}).get("email", ""),
                    "attendees": [a.get("email") for a in event.get("attendees", [])],
                    "html_link": event.get("htmlLink", ""),
                    "status": event.get("status", "")
                })
            
            return {
                "success": True,
                "events": events,
                "count": len(events)
            }
    
    async def create_event(
        self,
        token: str,
        summary: str,
        start: datetime,
        end: datetime,
        description: str = "",
        location: str = "",
        attendees: List[str] = None,
        timezone: str = "UTC"
    ) -> Dict[str, Any]:
        """
        Create a calendar event.
        
        Args:
            token: Access token
            summary: Event title
            start: Start time
            end: End time
            description: Event description
            location: Event location
            attendees: List of attendee emails
            timezone: Timezone
            
        Returns:
            Dict with event ID and link
        """
        event_data = {
            "summary": summary,
            "description": description,
            "location": location,
            "start": {
                "dateTime": start.strftime("%Y-%m-%dT%H:%M:%S"),
                "timeZone": timezone
            },
            "end": {
                "dateTime": end.strftime("%Y-%m-%dT%H:%M:%S"),
                "timeZone": timezone
            }
        }
        
        if attendees:
            event_data["attendees"] = [{"email": email} for email in attendees]
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.API_BASE}/calendar/v3/calendars/primary/events",
                headers=self._get_headers(token),
                json=event_data
            )
            
            if response.status_code not in [200, 201]:
                return {
                    "success": False,
                    "error": f"Calendar API error: {response.text}"
                }
            
            result = response.json()
            
            return {
                "success": True,
                "event_id": result.get("id"),
                "html_link": result.get("htmlLink"),
                "summary": result.get("summary")
            }
    
    async def delete_event(
        self,
        token: str,
        event_id: str
    ) -> bool:
        """Delete a calendar event."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.delete(
                f"{self.API_BASE}/calendar/v3/calendars/primary/events/{event_id}",
                headers=self._get_headers(token)
            )
            
            return response.status_code == 204


# Singleton instance
google_service = GoogleService()
