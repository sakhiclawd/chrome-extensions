# SPEC-002: Competitor Website Analyzer

## 1. Overview
A Chrome extension that provides a rapid competitor snapshot for the currently active website and saves structured domain reports into the **PMLibrary**.

## 2. Problem Statement
Enable users to quickly answer the following questions from any website:
*   How large is this site's traffic?
*   What keywords does it rank for?
*   How strong is its backlink profile?
*   How does it compare to others over time within the PMLibrary?

## 3. Target Audience
Marketers, founders, SEO specialists, and growth teams.

## 4. Scope Definition

### ✅ In Scope
*   **Domain Detection:** Identify active tab URL and normalize domain.
*   **Analysis Levels:** Support for both root domains and specific subdomains.
*   **Metrics:** Traffic estimates, keyword overview, and backlink profile.
*   **Automated Insights:** Generation of factual summary observations.
*   **Data Persistence:** Save report snapshots to PMLibrary with clear isolation from Briefly AI data.
*   **Historical Access:** Ability to view saved reports later in PMLibrary.

### ❌ Out of Scope
*   Full technical SEO audits or content gap analysis.
*   PPC/Social media analysis.
*   AI-driven recommendations (Factual observations only).
*   Real-time alerts or tracking.

## 5. Functional Specifications

### A. Domain Detection
The extension must:
*   Detect active tab URL and normalize the domain.
*   Provide a **Scope Selector** (Root Domain vs. Current Subdomain).
*   Clearly display exactly which domain/subdomain is being analyzed.

### B. Report Sections

| Section | Key Fields | Rules/Notes |
| :--- | :--- | :--- |
| **Domain Summary** | Domain, Brand/Site Name, Category, Timestamp | Overall label: Strong / Moderate / Weak / Insufficient data |
| **Traffic Overview** | Monthly visits, Geographies, Source mix, Device split | **Must** be marked as estimates. Include confidence labels. |
| **Keyword Overview** | Est. keyword count, Top keywords, Volume bands, Branded split | Identify top ranking pages if data is available. |
| **Backlink Overview** | Total backlinks, Referring domains, Authority proxy, Follow/Nofollow | List top referring domains. |
| **Summary Insights** | 3-5 factual observations | Example: "Strong backlink profile," "Heavy reliance on branded keywords." |

### C. PMLibrary Integration
*   **Save Behavior:** Create/Update domain records in PMLibrary.
*   **Snapshots:** Store the current analysis as a timestamped snapshot.
*   **Isolation:** Maintain strict data separation from Briefly AI webpage summaries.
*   **Version Control:** Allow multiple saved reports for the same domain over time.

## 6. UI/UX Requirements
*   **Header:** Brand Title (**COMPETITOR ANALYZER**), Domain Name, Scope Selector, Global Save Button.
*   **Body:** Scrollable card-based layout for each Report Section (Summary, Traffic, Keywords, Backlinks, Insights).
*   **Footer Actions:** 
    *   Primary: `Save to PMLibrary`
    *   Secondary: `Refresh Analysis` | `Open in PMLibrary`

## 7. Success Criteria
*   Successfully executed analyses per user.
*   Save rate to PMLibrary (Action vs. Intention).
*   Repeat usage and total saved domains per user.
*   Report completion rate (Data availability vs. UI rendering).
