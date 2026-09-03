# HustleHub+ API

## System Overview & Intended Users
HustleHub+ is a secure freelance marketplace platform designed to connect service providers with clients. The system relies on a secure backend API that processes sensitive transactional and credential data. 
The intended users of this system include:
*   **Freelancers:** Users who advertise their services, manage gigs, and track their income.
*   **Clients:** Users who browse available services and book gigs.
*   **Administrators:** Users responsible for platform oversight (to be implemented in later phases).

## System Architecture

```mermaid
graph TD
    subgraph Client Boundary
        UI[React.js Frontend]
        Storage[Token Storage]
    end

    subgraph Network Security
        HTTPS[HTTPS / TLS Encryption]
    end

    subgraph Server Boundary
        API[Node.js + Express API]
        Val[Input Validation]
        Auth[JWT Authentication Middleware]
        Logic[Controllers & Business Logic]
        Hash[Bcrypt Password Hashing]
    end

    subgraph Database Boundary
        DB[(MongoDB)]
    end

    UI -->|JSON Payloads| HTTPS
    HTTPS -->|Secure Request| API
    API --> Val
    Val -->|Sanitized Data| Auth
    Auth -->|Validated Token| Logic
    Logic --> Hash
    Logic --> DB
    DB --> Logic
    Logic --> API
    API --> HTTPS
    HTTPS --> UI```

Test
