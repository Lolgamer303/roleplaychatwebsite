"use client";
import React from 'react';
import Markdown from 'markdown-to-jsx';
import styled, { createGlobalStyle } from 'styled-components';

// Cleaned Markdown content (no unnecessary escapes)
const markdown = `# RoleplayChat API Documentation

This document describes the RoleplayChat Flask-based API.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Database Models](#database-models)
4. [Endpoints](#endpoints)

   * [Campaigns Collection](#campaigns-collection)
   * [Single Campaign](#single-campaign)
   * [Campaign Chats](#campaigns-chats)
5. [Error Handling](#error-handling)

---

## Overview

The RoleplayChat backend allows clients to create, manage, and interact with role-playing game campaigns. It leverages Flask for HTTP routing, SQLAlchemy for database access, and Google GenAI for AI-generated content.

---

## Authentication

All endpoints require an API key supplied via the \`Authorization\` header:

\`\`\`
Authorization: Bearer <API_KEY>
\`\`\`

You can obtain or manage API keys at [https://roleplaychatwebsite.vercel.app/keys](https://roleplaychatwebsite.vercel.app/keys). The server verifies each key against the \`ApiKey\` table before processing requests.

---

## Database Models

| Table    | Fields                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------ |
| ApiKey   | \`id\` (UUID), \`key\` (string)                                                               |
| Campaign | \`id\` (UUID), \`name\` (string), \`book\` (string), \`prompt\` (text), \`userId\` (string/null),          |
|          | \`apiKeyId\` (UUID), \`createdAt\` (timestamp)                                                       |
| Chat     | \`id\` (serial), \`message\` (text), \`response\` (text), \`campaignId\` (UUID), \`createdAt\` (timestamp) |

---

## Endpoints

### Campaigns Collection

#### GET \`/campaigns\`

Retrieves all campaigns associated with your API key. Optional query parameter:

* \`userId\` (string): filter campaigns by user identifier.

**Responses**:

* \`200 OK\` with JSON array of campaigns:

  \`\`\`json
  [
    { "id": "uuid-1", "name": "Dragon Hunt" },
    { "id": "uuid-2", "name": "Space Odyssey" }
  ]
  \`\`\`

* \`204 No Content\` if none exist:

  \`\`\`json
  { "message": "You have no campaigns yet." }
  \`\`\`

* \`401 Unauthorized\` if the API key is missing or invalid.
* \`500 Internal Server Error\` on database failure.

#### POST \`/campaigns\`

Creates a new campaign. Request body (JSON):

| Field    | Type   | Required | Description                                   |
| -------- | ------ | -------- | --------------------------------------------- |
| \`name\`   | string | yes      | Campaign name                                 |
| \`book\`   | string | yes      | Source book or setting                        |
| \`prompt\` | string | no       | Initial prompt (defaults to server default)   |
| \`userId\` | string | no       | Client user identifier                        |

**Example**:

\`\`\`bash
curl -X POST https://api.example.com/campaigns \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Quest","book":"Mythos","prompt":"Once upon a time...","userId":"user123"}'
\`\`\`

**Responses**:

* \`201 Created\`:
  \`\`\`json
  { "status": "success", "message": "Campaign created successfully." }
  \`\`\`
* \`400 Bad Request\` if required fields are missing.
* \`500 Internal Server Error\` on database or AI errors.

---

### Single Campaign

#### GET \`/campaigns/<campaignid>\`

Fetch detailed information for a campaign by its UUID.

**Response**:

\`\`\`json
{
  "book": "Mythos",
  "prompt": "Once upon a time...",
  "name": "Quest",
  "created_at": "2025-05-16T12:34:56"
}
\`\`\`

**Status Codes**:

* \`200 OK\` on success.
* \`401 Unauthorized\` if the API key is invalid or access is denied.
* \`404 Not Found\` if the campaign does not exist.
* \`500 Internal Server Error\` on database failure.

---

#### PUT \`/campaigns/<campaignid>\`

Update the campaign’s name. Request body:

\`\`\`json
{ "name": "New Campaign Name" }
\`\`\`

**Status Codes**:

* \`200 OK\` on success.
* \`400 Bad Request\` if \`name\` is missing.
* \`401 Unauthorized\` if the API key is invalid or you are not the campaign owner.
* \`404 Not Found\` if the campaign does not exist.
* \`500 Internal Server Error\` on database failure.

---

#### DELETE \`/campaigns/<campaignid>\`

Delete a campaign and all associated chats.

**Response**:

\`\`\`json
{ "status": "success", "message": "Campaign deleted successfully." }
\`\`\`

**Status Codes**:

* \`200 OK\` on success.
* \`401 Unauthorized\` if the API key is invalid or you are not the campaign owner.
* \`404 Not Found\` if the campaign does not exist.
* \`500 Internal Server Error\` on database failure.

---

### Campaign Chats

#### POST \`/campaigns/<campaignid>/chats\`

Send a user message to the AI; returns the AI response and stores both in the chat history.

**Request body**:

\`\`\`json
{ "input": "I open the treasure chest." }
\`\`\`

**Behavior**:

1. Retrieves the last 8 messages for context.
2. If there are more than 8 messages, older ones are summarized to maintain performance.
3. Calls the Google GenAI model \`gemini-2.0-flash\` with full context plus the new input.
4. Stores the user message and generated response.

**Response**:

\`\`\`json
{ "response": "Inside the chest, you find..." }
\`\`\`

**Status Codes**:

* \`200 OK\` on success.
* \`401 Unauthorized\` if the API key is invalid or you are not the campaign owner.
* \`404 Not Found\` if the campaign does not exist.
* \`500 Internal Server Error\` on database failure.

---

#### GET \`/campaigns/<campaignid>/chats\`

Retrieve stored chat history for a campaign.

**Query parameters**:

* \`number\` (int): maximum number of chat entries to return, ordered oldest first.

**Response**:

\`\`\`json
[
  { "message": "Once upon a time...", "response": "Understood", "createdAt": "2025-05-16T12:00:00" },
  { "message": "I open the treasure chest.", "response": "Inside you see...", "createdAt": "2025-05-16T12:01:00" }
]
\`\`\`

**Status Codes**:

* \`200 OK\` on success.
* \`204 No Content\` if no chats exist.
* \`401 Unauthorized\` if the API key is invalid or you are not the campaign owner.
* \`404 Not Found\` if the campaign does not exist.
* \`500 Internal Server Error\` on database failure.

---

#### DELETE \`/campaigns/<campaignid>/chats\`

Delete chat history for a campaign.

**Query parameters**:

* \`count\` (int): number of most recent messages to remove. If omitted, all messages are deleted and the chat resets to the default prompt.

**Response**:

\`\`\`json
{ "status": "success", "message": "Chats deleted and history reset successfully." }
\`\`\`

**Status Codes**:

* \`200 OK\` on success.
* \`401 Unauthorized\` if the API key is invalid or you are not the campaign owner.
* \`404 Not Found\` if the campaign does not exist.
* \`500 Internal Server Error\` on database failure.

---

## Error Handling

All error responses are JSON objects with an \`error\` or \`message\` field and appropriate HTTP status codes.

Example:

\`\`\`json
{ "error": "Invalid API key." }
\`\`\`

---

*End of documentation.*
`;

// Global styles for smooth scrolling and anchor offset
const GlobalStyle = createGlobalStyle`
  html {
    scroll-behavior: smooth;
  }
  h1[id], h2[id], h3[id], h4[id] {
    scroll-margin-top: 100px;
  }
`;

// Styled container with theme variables
const Container = styled.div`
  font-family: var(--font-sans, 'Inter', sans-serif);
  line-height: 1.6;
  color: var(--color-custom-text-primary, #333);
  background: var(--color-custom-background-primary, #fff);
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;

  h1 { font-size: 2.5rem; margin-bottom: 1rem; }
  h2 { font-size: 2rem; margin-top: 2rem; margin-bottom: 1rem; }
  h3 { font-size: 1.75rem; margin-top: 1.5rem; }

  p { margin: 1rem 0; }

  a { color: var(--color-custom-accent-primary, #0070f3); text-decoration: none; }
  a:hover { text-decoration: underline; }

  code { 
    background: var(--color-custom-background-secondary, #f5f5f5); 
    padding: 0.2rem 0.4rem; 
    border-radius: 4px; 
    font-family: var(--font-mono, 'Courier New', monospace); 
  }
  pre { 
    background: var(--color-custom-background-secondary, #f5f5f5); 
    padding: 1rem; 
    border-radius: 4px; 
    overflow-x: auto; 
  }

  blockquote { 
    border-left: 4px solid var(--color-custom-border, #ddd); 
    padding-left: 1rem; 
    color: var(--color-custom-text-secondary, #666); 
    font-style: italic; 
    margin: 1rem 0; 
  }

  ul, ol { margin: 1rem 0 1rem 2rem; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    background: var(--color-custom-background-secondary, #f9f9f9);
  }
  th, td {
    border: 1px solid var(--color-custom-border, #ddd);
    padding: 0.75rem 1rem;
  }
  th {
    background: var(--color-custom-accent-tertiary, #f0f0f0);
    text-align: left;
    color: var(--color-custom-text-primary, #1a1a1a);
  }
`;

export default function StyledMarkdownPage() {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Markdown
          options={{ overrides: { table: 'table', th: 'th', td: 'td' } }}
        >
          {markdown}
        </Markdown>
      </Container>
    </>
  );
}