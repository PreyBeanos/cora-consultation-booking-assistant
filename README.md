## Consultation and Online Request Assistant (CORA) for PSHS-CBZRC

CORA is a proof-of-concept-esque basic website that employs the Google Gemini 3.1 Lite Preview API as its main chatbot.
The chatbot is designed to ease the consultation booking for PSHS scholars looking for teachers to consult with.

The system in theory should have a proper backend framework but given our lack of expertise in that department, the website mainly focuses on frontend, chatbot communication, and for functionality purposes, a local schedule blocking stored in memory.

CORA aims to promote consultations with teachers by providing a more seamless way to request for consultation sessions.
Students who also feel discouraged from asking teachers prior to the session in person will also benefit with the presence of a chatbot.
By encouraging students to do consultations, it will improve the likelihood of a student to better progress through their studies.

## Functionalities

The chatbot will recognize the current state of schedule blockings and inform the student of the teacher's availability at a particular time.
It will refuse to book a consultation if the set schedule is beyond the teacher's availability or is already taken by a prior approved session.

Students also have the option to cancel upcoming consultations by communicating to the chatbot of the matter, which will reflect on the teacher's end.

Teachers will also have their own separate dashboard containing a list of consultation requests to approve, upcoming approved sessions, and the option to modify their availability hours.

## How to use

1. Install required dependencies by running `npm install` within the code's root directory in terminal.
2. Open the code `student.html` and find `const API_KEY = "GEMINI_API_KEY"`. Replace `GEMINI_API_KEY` with your working Google Gemini API key. If you don't have a key yet, you can generate one through this link `https://aistudio.google.com/api-keys`.
3. Run the file `index.html` on a browser to access the project's main page.

## Note

This project is a submission for the 2026 STEM Week AI Hackathon.
