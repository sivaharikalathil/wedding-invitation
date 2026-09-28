# 🌸 Traditional Kerala Hindu Wedding Invitation Website (ഡിജിറ്റൽ വിവാഹ ക്ഷണക്കത്ത്)

A modern, responsive, and culturally authentic digital wedding invitation web application designed specifically for a **Hindu Kerala Wedding**. Inspired by modern mobile web invitations, it combines traditional Kerala aesthetics (Kasavu gold, temple motifs, Nilavilakku, and Malayalam typography) with interactive features like **live countdowns, trackable RSVPs, Google Maps integration, background wedding music, and personalized guest sharing**.

---

## ✨ Features Included

1. **Gate / Envelope Opening Animation (Viral Style)**:
   - Fullscreen royal opening card with Lord Ganesha motif, auspicious Malayalam shloka, and traditional Kasavu corner borders.
   - **Personalized Guest Addressing**: Dynamically greets guests using the URL parameter `?to=Guest+Name` (e.g., `?to=Suresh+Uncle+%26+Family`).
   - "ക്ഷണക്കത്ത് തുറക്കുക / OPEN INVITATION" button with a wax seal effect, opening animation, and automatic music trigger.

2. **Auspicious Traditional Audio Engine**:
   - Built-in **Raag Mohanam** Carnatic flute & Tanpura drone synthesizer using the Web Audio API.
   - Works 100% offline with zero external audio dependencies.
   - Floating vinyl record toggle button with spinning animation to easily mute or play.

3. **Falling Petals Animation (Pushpavrishi / പുഷ്പവൃഷ്ടി) with Side-Bar Toggle**:
   - Gentle, realistic jasmine (*mulla poo*) and marigold (*chendumalli*) flower petals floating down the screen.
   - Interactive **Petals Toggle Button** located on the floating side bar controls to **Enable or Disable (Turn ON / OFF)** the falling flower shower at any time.

4. **Live Muhurtham Countdown Timer**:
   - Real-time countdown clock (Days, Hours, Minutes, Seconds) ticking down to the sacred Muhurtham.
   - One-click **"Add to Google Calendar"** button.
   - **"Download Apple / Outlook iCal (.ics)"** button.

5. **Bride & Groom Showcase (വരൻ & വധു)**:
   - High-definition portrait photos in authentic Kerala Kasavu attire and temple jewelry.
   - Family details, ancestral house names (*tharavadu / illam*), profession, and social links.
   - Sacred Kerala *Ela Thali* (Minnu) emblem uniting the couple.

6. **Wedding Events & Schedule (ചടങ്ങുകൾ)**:
   - **Thalikettu Kalyanam (Sacred Muhurtham)**: 09:30 AM – 10:15 AM
   - **Traditional Kerala Sadhya (The Grand Feast)**: 11:30 AM – 02:30 PM (28-dish plantain leaf feast)
   - **Wedding Reception & Gala Evening**: 06:00 PM – 10:00 PM (Kochi)

7. **Interactive Venue & Maps (Directions)**:
   - Switch between **Guruvayur Mandapam** and **Kochi Reception**.
   - Embedded interactive Google Map.
   - **"Open in Google Maps"** navigation button.
   - **"Copy Venue Address"** button with instant toast notification.
   - Airport and railway transit information.

8. **Live Wishes & Blessings Guestbook Wall**:
   - Guests can leave their congratulations and blessings.
   - Displays real-time wishes with timestamps and instant submission form.

9. **Digital Kaineettam & Shagun (Gift Registry)**:
   - Traditional Kerala *Kaineettam* token of love.
   - Dynamic UPI QR Code (GPay, PhonePe, Paytm, BHIM) with "Copy UPI ID" button.

10. **Personalized WhatsApp Invite Link Generator**:
    - Built-in host tool: Type any relative or friend's name to instantly generate a personalized link and pre-composed WhatsApp message in Malayalam and English!

11. **Live Customizer Panel (Edit Without Touching Code)**:
    - Click **"Edit Wedding Details"** at the bottom of the page to customize bride & groom names, parents' names, venue, dates, or UPI ID directly in your browser.

---

## 🚀 How to View & Share

### 1. View Locally
Simply double-click [index.html](file:///c:/Users/PRO/Documents/Wedding%20Invitation%20Using%20AntiGravity/index.html) or open it in any web browser (Chrome, Safari, Edge, Firefox).

### 2. Share with Specific Guests
To personalize the invitation for a guest or family, append `?to=Their+Name` to the URL:
- `index.html?to=Suresh+Uncle+%26+Family`
- `index.html?to=Dr.+Harikrishnan`
- `index.html?to=Lakshmi+%26+Anoop`

### 3. Deploy for Free to the Web
To share it with everyone over WhatsApp, you can host it for free in 1 minute using:
- **GitHub Pages**: Push this folder to a GitHub repository and turn on GitHub Pages in repository settings.
- **Vercel** or **Netlify**: Drag and drop this folder onto [netlify.com/drop](https://app.netlify.com/drop) or deploy via Vercel.

---

## 📁 File Structure
```
Wedding Invitation Using AntiGravity/
├── index.html                   # Main invitation webpage
├── README.md                    # Documentation & setup guide
└── assets/
    ├── css/
    │   └── style.css            # Kasavu gold & maroon styling, responsive layout
    ├── js/
    │   └── app.js               # Audio synthesizer, countdown, RSVP & petals engine
    └── images/
        ├── hero.jpg             # Kerala temple mandapam couple photograph
        ├── groom.jpg            # Traditional Kerala groom portrait
        ├── bride.jpg            # Traditional Kerala bride portrait
        ├── sadhya.jpg           # Authentic Kerala Sadhya feast on banana leaf
        ├── backwaters.jpg       # Kumarakom backwaters pre-wedding photo
        └── decor/
            ├── ganesha.svg      # Minimalist gold Lord Ganesha motif
            ├── nilavilakku.svg  # Auspicious Kerala brass Nilavilakku lamp
            ├── thali.svg        # Sacred Ela Thali / Minnu emblem
            └── kasavu-pattern.svg# Traditional Kasavu zari border pattern
```
