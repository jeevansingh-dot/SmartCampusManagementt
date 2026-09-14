const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const Complaint = require("../models/complaint");
const LostFound = require("../models/lostfound");

const router = express.Router();

console.log("AI ROUTES LOADED");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// ===============================
// CAMPUS INFORMATION
// ===============================

const campusInfo = `
COLLEGE INFORMATION:

College Timing:
- College is open from 9:30 AM to 4:00 PM.

Library:
- General library timing is 10:00 AM to 4:00 PM.
- Library timing may vary according to the timetable.

Canteen:
- Canteen generally remains open whenever the college is open.

Hostel:
- Hostel information is currently not available.

Complaint Process:
- Students can submit complaints through the Complaint Management section.

Lost & Found Process:
- Students can submit Lost & Found items through the Lost & Found section.
`;

// ===============================
// AI CHAT
// ===============================

router.post("/chat", async (req, res) => {

  console.log("AI CHAT ROUTE HIT");

  try {

    const {
      message,
      erpId
    } = req.body;

    if (!message || !message.trim()) {

      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    let complaintData =
      "No complaint information available.";

    // ===============================
    // GET COMPLAINTS FOR ERP
    // ===============================

    if (erpId && erpId.trim()) {

      const studentComplaints =
        await Complaint.find({
          erpId: erpId.trim().toUpperCase()
        })
        .sort({
          createdAt: -1
        })
        .limit(20)
        .select(
          "title category priority description status createdAt"
        );

      if (studentComplaints.length > 0) {

        complaintData =
          studentComplaints
            .map(
              (c, index) => `
${index + 1}.
Title: ${c.title}
Category: ${c.category}
Priority: ${c.priority}
Status: ${c.status}
Description: ${c.description}
Created: ${c.createdAt}
`
            )
            .join("\n");

      } else {

        complaintData =
          "No complaints found for this ERP ID.";
      }
    }

    // ===============================
    // GET LOST & FOUND DATA
    // ===============================

    const lostFoundItems =
      await LostFound.find()
        .sort({
          createdAt: -1
        })
        .limit(20)
        .select(
          "title type location description status createdAt"
        );

    let lostFoundData =
      "No Lost & Found items are currently available.";

    if (lostFoundItems.length > 0) {

      lostFoundData =
        lostFoundItems
          .map(
            (item, index) => `
${index + 1}.
Title: ${item.title}
Type: ${item.type}
Location: ${item.location}
Status: ${item.status}
Description: ${item.description}
Created: ${item.createdAt}
`
          )
          .join("\n");
    }

    // ===============================
    // GEMINI PROMPT
    // ===============================

    const prompt = `
You are CampusBot, an AI assistant for a college campus.

Your job is to help students with campus-related questions.

${campusInfo}

STUDENT ERP ID:
${erpId || "Not provided"}

STUDENT'S COMPLAINT DATA:
${complaintData}

CURRENT LOST & FOUND DATA:
${lostFoundData}

IMPORTANT RULES:

1. Give short, clear and helpful answers.
2. Use simple English.
3. Be polite and friendly.
4. Use the provided campus information.
5. If the student asks about their complaint status, use ONLY the complaint data provided for their ERP ID.
6. Never invent complaint records.
7. If there are multiple complaints, mention their titles and statuses clearly.
8. Do not reveal phone numbers or unnecessary personal information.
9. If no complaint is found for the ERP ID, say:
   "I could not find any complaint associated with your ERP ID."
10. Do not claim that a complaint was resolved unless its status is actually "resolved".
11. Do not perform any database action.
12. If information is unavailable, say:
   "Sorry, I don't have that information yet."

Student Question:
${message.trim()}
`;

    // ===============================
    // GEMINI
    // ===============================

    const response =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
      });

    const reply =
      response.text ||
      "Sorry, I could not generate a response.";

    res.status(200).json({
      success: true,
      reply: reply
    });

  } catch (error) {

    console.error("Gemini Error:", error);

    res.status(500).json({
      success: false,
      message:
        "AI Assistant is temporarily unavailable."
    });
  }
});

module.exports = router;
