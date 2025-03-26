# **Entity Risk Assessment Methodology**

## **Pre-Research Instructions: Extracting Key Information from Transactions**

Before conducting research, extract the following important details from the transaction data:

### **1. Key Entity Information**

- **Sender & Receiver Names** (Identify inconsistencies, abbreviations, known fraudulent names)
- **Entity Type** (Corporation, Non-Profit, Financial Intermediary, Shell Company, Unknown)
- **Account Numbers & Bank Details** (IBAN, SWIFT codes, offshore banks, cryptocurrency wallets)
- **Address** (Cross-check against tax havens, sanctioned locations, or high-risk jurisdictions)
- **Beneficial Owner Details** (Verify against regulatory filings, leaks, or corporate databases)

### **2. Transaction Details**

- **Amount & Currency** (Unusual values, frequent transactions just below reporting thresholds)
- **Transaction Type** (Wire transfers, SWIFT, cryptocurrency, correspondent banking)
- **Currency Exchange (if applicable)** (Unusual or unnecessary conversions)
- **Purpose** (Extract purpose notes, references, and check legitimacy)

### **3. Additional Risk Indicators**

- **Intermediaries & Routing** (Unnecessary intermediaries, offshore accounts, circular transactions)
- **Approvers & Signatories** (Check for politically exposed persons (PEPs) or known risk associations)
- **IP Addresses & Geolocation** (Use of VPNs, proxy services, links to sanctioned regions)
- **Supporting Documents & Metadata** (Check for missing or manipulated documents)
- **Sanctions/Watchlists** (Ownership structure, indirect control by blocked entities)

---

## **Post-Research Instructions: Classifying & Scoring Risk**

### **1. Expanded Classification of Red Flags**


| **Category**                                     | **Indicators**                                                                                          | **Risk Weight** (0.1 - 1.0) |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------- |
| **Sanctioned Entity Involvement**                | Direct/Indirect ownership by a blocked entity or presence on sanctions lists (OFAC, UN, EU, etc.)       | **1.0**                     |
| **Shell Company Activity**                       | No clear business activity, offshore jurisdiction, linked to known shell networks (e.g., Panama Papers) | **0.9**                     |
| **Politically Exposed Person (PEP) Involvement** | Transactions approved by, benefiting, or linked to a PEP                                                | **0.8**                     |
| **Unusual Transaction Patterns**                 | Large transactions without justification, frequent small transfers, or circular transactions            | **0.7**                     |
| **High-Risk Jurisdiction**                       | Involvement of entities from tax havens, conflict zones, or non-cooperative countries                   | **0.6**                     |
| **Lack of Transparency**                         | Missing/forged documents, unknown ownership, inconsistent records                                       | **0.5**                     |
| **Use of Intermediaries in High-Risk Locations** | Money passing through multiple offshore companies unnecessarily                                         | **0.4**                     |
| **Mismatch Between Entity Type & Transaction**   | For example, a charity receiving unusually high consulting fees                                         | **0.3**                     |
| **VPN or Proxy Usage**                           | Entity consistently hides its location using VPNs or proxy networks                                     | **0.2**                     |
| **Minor Inconsistencies**                        | Name spelling variations, minor data mismatches                                                         | **0.1**                     |

---

### **2. Updated Formula for Risk Score (0-1)**

There can be **multiple individual red flags corresponding to one single risk category**.
The total number of such red flags for a category is referred to as **Risk Frequency**.

$$
\text{Risk Score} = \frac{\sum (\text{Risk Weight} \times \text{Risk Frequency})}{\text{Total Number of Red Flags}}

$$

Where:

- **Risk Weight** is the predefined weight of a risk category (e.g., 1.0 for sanctions involvement, 0.5 for lack of transparency).
- **Risk Frequency** is the number of **independent** red flags found for that category.
- **Total Number of Red Flags** is the sum of all risk frequencies across all categories.

This ensures the final **Risk Score** always remains between **0 and 1**.

---

### **3. Updated Formula for Confidence Score (0-1)**

$$
\text{Final Confidence Score} = \frac{\sum (\text{Confidence Score of Individual Red Flags})}{\text{Total Number of Red Flags}}

$$

Where:

- **Confidence Score of Individual Red Flags** is the level of certainty assigned to each identified red flag.
- **Total Number of Red Flags** is the sum of all identified red flags across categories.

This ensures that **confidence scores are normalized** to a value between **0 and 1**.

---

### **4. Transaction Classification Based on Final Risk Score**


| **Risk Score** | **Category**      | **Action**                                                    |
| ---------------- | ------------------- | --------------------------------------------------------------- |
| **0.9 - 1.0**  | **Severe Risk**   | Immediate escalation. Likely involvement in illicit activity. |
| **0.7 - 0.89** | **High Risk**     | Detailed investigation required. Possible sanctions exposure. |
| **0.5 - 0.69** | **Moderate Risk** | Proceed with caution. Further review needed.                  |
| **0.3 - 0.49** | **Low Risk**      | No immediate risk but monitor for future activity.            |
| **0.1 - 0.29** | **Minimal Risk**  | No action needed.                                             |

---

### **5. Evidence Trail Structure**

1. **Extracted Entities:**

   - List verified names and entity types.
2. **Risk Score & Confidence Score:**

   - Show calculations and individual risk categories considered.
3. **Supporting Evidence:**

   - List databases used.
4. **Detailed Justification:**

   - Describe why the entity was flagged.
5. **Transaction Classification & Conclusion:**

   - Assign the final classification from the table above.
   - Provide a **short conclusion** summarizing why the transaction was classified as such.

---

### **6. Output Format**

The researcher must document findings using the following JSON format:

```json
{
  "Transaction ID": "TXN001",
  "Extracted Entity": ["Acme Corporation", "SovCo Capital Partners"],
  "Entity Type": ["Corporation", "Corporation"],
  "Risk Score": 0.65,
  "Supporting Evidence": ["OpenCorporates", "Company Website"],
  "Confidence Score": 0.95,
  "Reason": "SovCo Capital Partners is not on sanctions list but an entity of interest. It is owned by Russian businessmen and related to Socombank PJSC, a sanctioned entity.",
  "Transaction Classification": "Moderate Risk",
  "Conclusion": "The transaction involves SovCo Capital Partners, which is linked to sanctioned entities but not directly listed. The moderate risk score of 0.65 indicates the need for further review but not immediate escalation."
}
```

---

Each transaction must be categorized into Minimal Risk, Low Risk, Moderate Risk, High Risk, or Severe Risk based on the final risk score.

The Conclusion should summarize why the transaction was classified into that category.
