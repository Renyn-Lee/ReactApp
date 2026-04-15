// pages/GuitarLesson.js
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './GuitarLessons.css';
import { useUser } from '@clerk/clerk-react';

const guitarLessonData = {
  1: {
    title: "Lesson 1:",
    description: "Getting Started & Anatomy",
    customClass: "lesson-one",
    content: `
      <h2>Welcome to the Guitar! Here are cool facts to start.</h2>
      <h3>Did you know?</h3>
        <h2>The six strings exert over 150-200 lbs of pressure on the neck!</h2>
        <h2>Before steel, strings were made from "catgut" (sheep intestines).</h2>
        <h2>Leo Fender, creator of the Stratocaster, couldn't actually play guitar!</h2>
      <hr/>
      <h2>The Setup of a Guitar</h2>
      <p>

[Image of guitar parts: Headstock, Frets, Body, Bridge]
</p>
      
      <h3>Tuning Pegs</h3>
      <p>Used to tighten or loosen strings to change their pitch.</p>

      <h3>Frets</h3>
      <p>Metal strips that divide the neck. Pressing behind them changes the note.</p>

      <h3>Acoustic vs. Electric</h3>
      <p><strong>Acoustic:</strong> Uses a hollow body to amplify sound naturally.</p>
      <p><strong>Electric:</strong> Uses "pickups" (magnets) to send a signal to an amp.</p>
      
      <hr/>
      <h2>String Names</h2>
      <p></p>
      <h3>The strings from thickest to thinnest are: <strong>E A D G B e</strong>.</h3>
      <p>Mnemonic: <strong>E</strong>ddy <strong>A</strong>te <strong>D</strong>ynamite, <strong>G</strong>ood <strong>B</strong>ye <strong>E</strong>ddy.</p>

      <h2>Posture & Holding a Pick</h2>
      <h3>Hold the pick between your thumb and the side of your index finger. Keep your wrist loose and try a few down-strokes on the thickest string (Low E).</h3>
      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Memorize the string names using the mnemonic.</h2>
        <h2>Practice 5 minutes of steady down-strokes on the open strings.</h2>
    `,
    backgroundColor: "#D09691"
  },
  2: {
    title: "Lesson 2:", 
    description: "Rhythm & Tablature",
    customClass: "lesson-two",
    content: `
      <h2>Rhythm Basics</h2>
      <h3>Use a metronome (there's one at the bottom of the screen). Count "1 - 2 - 3 - 4" and play a down-stroke (this is a downward motion strum) on the Low E string for every beat. This is called a quarter note.</h3>
      
      <hr/>
      <h2>Reading Tablature (TAB)</h2>
      <p></p>
      <h3>TAB has 6 lines (the strings). A number on a line tells you which fret to press.</h3>
      <p><strong>Example:</strong> A "2" on the 3rd line means play the 2nd fret of the D string.</p>

      <hr/>
      <h2>Fretting Hand Technique</h2>
      <p></p>
      <h3>Use your <strong>fingertips</strong>. Press down just behind the metal fret wire. If it buzzes, press a little harder or move closer to the fret!</h3>

      <hr/>
      <h2>The 1-2-3-4 Exercise</h2>
      <h3>Play fret 1, then 2, then 3, then 4 on the same string using four different fingers. This builds strength!</h3>
      <p>The beginning of your journey may cause pain in your finger, if that is the case, take a break. You'll develop calluses in around a week or two.</p>
      
      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Practice the 1-2-3-4 exercise for 5 minutes a day.</h2>
        <h2>Try to play a simple "0 - 2 - 4" pattern on the D string perfectly in time with a beat.</h2>
    `,
    backgroundColor: "#D09691"
  },
  3: {
    title: "Lesson 3:",
    description: "The First Chords (Em, Cmaj7 & Am)",
    customClass: "guitar-lesson-three",
    content: `
      <h2>The Easy Duo</h2>
      <h3>Three of the easiest chords: <strong>E minor (Em)</strong>, <strong>C Major 7 (Cmaj7)</strong>, and <strong>A minor (Am)</strong></h3>
      <h3>Try to focus on arching the fingers so your fingertips press the strings cleanly and not muting adjacent strings. Don't worry about going fast; take time to place each finger and let the chord ring before moving on.</h3>
      <h3><strong>Em fingering:</strong> 0-2-2-0-0-0 (low to high). Place the middle and ring fingers on the 2nd fret of the A and D strings.</h3>
      <h3><strong>Cmaj7 fingering:</strong> X-3-2-0-0-0 — place the ring finger on the 3rd fret of the A string and the middle finger on the 2nd fret of the D string; the low E is muted (X).</h3>
      <h3><strong>Am fingering:</strong> X-0-2-2-0-0 — place the middle finger on the 2nd fret of the D string and the ring finger on the 2nd fret of the B string; the low E is muted (X).</h3>
      <p> With muted strings marked as "X", you shouldn't hear them. it's up to you how you want to mute the string.</p>
      <hr></hr>

      <h2>Chord Transitions</h2>
      <h3>The hardest part is switching smoothly between chords. Practice moving from Em to Cmaj, spending four beats on each chord (count "1-2-3-4" on each). </h3>
      <p>Use the concept of <em>anchor fingers</em> — notice which fingers stay in place or move minimally when switching.</p>
      <h3>For Em → Cmaj7: keep your middle finger close to the D string when you move your ring finger to the A string; this will make transitioning smoother.</h3>

      <hr></hr>
      <h2>Core Chords (The G, C, D Group)</h2>
      <h3>Next are the three common chords used in many songs: G Major, C Major, and D Major. Practice each slowly and watch for muted strings.</h3>
      <h3><strong>G Major:</strong> 3-2-0-0-0-3 — fingers: middle on A2, index on E2 (or alternative fingerings). Avoid muting higher strings.</h3>
      <h3><strong>C Major:</strong> X-3-2-0-1-0 — ring finger on A3, middle finger on D2, index finger on B1; low E muted (X).</h3>
      <h3><strong>D Major:</strong> X-X-0-2-3-2 — fingers: index on G2, middle on E2, ring on B3; avoid hitting the low E and A strings (mark them X).</h3>

      <hr></hr>
      <h2>Basic Strumming Patterns</h2>
      <h3>Pattern 1: <strong>D D D D</strong> — downstroke on every beat (counts: 1 2 3 4). Keep the strumming hand moving with a steady down motion on each count.</h3>
      <h3>Pattern 2: <strong>D D U U D U</strong> (written as D DU UDU) — count with the rhythm and keep the wrist moving constantly even on the up-beats where you may not hit the strings.</h3>
      <h3>Practice: play Em for four beats using Pattern 1, then switch to Cmaj7 for four beats using the same pattern. Repeat slowly until changes feel natural.</h3>
      <p>As you get into the rhythm, try to relax your wrists as a common issue with beginners is keeping an overly tense wrist and  only using their arms to strum.</p>
    `,
    backgroundColor: "#D09691"
  },
  // Placeholders for remaining lessons
  4: {
    title: "Lesson 4:",
    description: "The Major Scale & Music Theory Basics",
    customClass: "lesson-four",
    content: `
      <h2>Why Learn Scales?</h2>
      <h3>Scales are the building blocks of music. Every melody, chord, and solo comes from a scale. Learning the major scale will help you understand <em>why</em> chords are built the way they are.</h3>

      <hr/>
      <h2>The C Major Scale</h2>
      <h3>The C Major scale uses the notes: <strong>C D E F G A B C</strong>. No sharps or flats — it's the cleanest scale to start with.</h3>
      <h3>TAB (play on the B and e strings, low to high):</h3>
      <p><strong>e: --0--1--3--</strong></p>
      <p><strong>B: --0--1--3--</strong></p>
      <p><strong>G: --0--2--</strong></p>
      <h3>Play each note cleanly, one at a time, using a metronome. Go slow — speed comes later. Try going up and then back down.</h3>

      <hr/>
      <h2>Intervals: The Distance Between Notes</h2>
      <h3>The distance between two notes is called an <strong>interval</strong>. The major scale follows this pattern of steps: <strong>W W H W W W H</strong> (W = Whole step, H = Half step).</h3>
      <p>On guitar, a half step = 1 fret. A whole step = 2 frets. This pattern is the DNA of the major scale — it's the same regardless of which note you start on.</p>

      <hr/>
      <h2>Connecting Scales to Chords</h2>
      <h3>The chords G, C, and D (which you already know) all come from the G Major scale. This is called a <strong>key</strong>. When you play those three chords together, you're playing in the key of G!</h3>
      <p>This is why certain chords always sound good together — they share the same scale DNA.</p>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Practice the C Major scale up and down 10 times daily with a metronome at 60 BPM.</h2>
        <h2>Try to memorize the W W H W W W H pattern by saying it out loud while you play.</h2>
    `,
    backgroundColor: "#D09691"
  },
  5: {
    title: "Lesson 5:",
    description: "Power Chords & Rock Fundamentals",
    customClass: "lesson-five",
    content: `
      <h2>What is a Power Chord?</h2>
      <h3>A power chord (written as <strong>G5, A5, E5</strong> etc.) uses only two notes: the root and the 5th. They sound powerful and work especially well with electric guitars and distortion.</h3>
      <h3>They're used in countless rock, punk, and metal songs — and they're easy to learn!</h3>

      <hr/>
      <h2>The Power Chord Shape</h2>
      <h3>Use your <strong>index finger</strong> on the root note and your <strong>ring finger</strong> two frets higher on the next string down. Your pinky can optionally double the ring finger one fret lower on the string below that for a fuller sound.</h3>
      <h3><strong>E5 (open):</strong> 0-2-2-X-X-X — index on A2, ring on D2.</h3>
      <h3><strong>A5 (open):</strong> X-0-2-2-X-X — index on D2, ring on G2.</h3>
      <h3>The shape stays the same no matter where you move it on the neck. Slide it up two frets and E5 becomes F#5!</h3>

      <hr/>
      <h2>Moving Power Chords Around the Neck</h2>
      <h3>Because power chords have no open strings (once you leave the open position), they are fully <strong>moveable</strong>. The fret your index finger sits on determines the chord name.</h3>
      <p>On the low E string: Fret 1 = F5, Fret 2 = F#5, Fret 3 = G5, Fret 5 = A5, Fret 7 = B5.</p>

      <hr/>
      <h2>Palm Muting</h2>
      <h3>Rest the side of your strumming hand lightly on the strings near the bridge. Strum while keeping that light pressure. This creates a tight, chunky sound — a staple of rock rhythm guitar.</h3>
      <p>Try alternating between palm muted and open (unmuted) strums for a dynamic riff feel.</p>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Practice sliding a power chord shape up and down the low E string, landing on each fret cleanly.</h2>
        <h2>Try palm muting a simple E5 → A5 → B5 progression with four beats per chord.</h2>
    `,
    backgroundColor: "#D09691"
  },
  6: {
    title: "Lesson 6:",
    description: "Barre Chords: The Big Milestone",
    customClass: "lesson-six",
    content: `
      <h2>What is a Barre Chord?</h2>
      <h3>A barre chord requires your index finger to press down <strong>all six strings</strong> at once, acting as a moveable "capo." This is one of the hardest milestones for beginners — be patient with yourself. It often takes weeks to sound clean.</h3>

      <hr/>
      <h2>The F Major Chord (E-Shape Barre)</h2>
      <h3>The F Major chord is a barre chord at the 1st fret using the shape of an open E chord. It's often the first barre chord guitarists learn.</h3>
      <h3><strong>F Major fingering:</strong> 1-1-2-3-3-1 — barre all strings at fret 1 with your index finger, then place your middle finger on G2, ring finger on A3, pinky on D3.</h3>
      <p>Tip: Roll your index finger slightly toward the headstock so the bony edge of your finger (not the soft pad) presses the strings. This helps avoid buzzing.</p>

      <hr/>
      <h2>Building Barre Chord Strength</h2>
      <h3>If F Major sounds buzzy or dead, try these drills:</h3>
      <h3>1. Just barre the first fret and strum — work on getting all 6 strings to ring cleanly before adding other fingers.</h3>
      <h3>2. Practice squeezing and releasing the barre repeatedly to build hand endurance.</h3>
      <h3>3. Try the barre at fret 5 (A Major shape) first — it's easier physically because the strings have less tension up the neck.</h3>

      <hr/>
      <h2>Why Barre Chords Are Worth It</h2>
      <h3>Once you have one barre shape down, you have <strong>every major chord</strong> on the guitar. The F shape at fret 1 = F, at fret 2 = F#, at fret 3 = G, and so on. One shape, infinite chords!</h3>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Spend at least 5 minutes each day just holding the F barre chord and squeezing until it rings clearly.</h2>
        <h2>Try the barre shape at fret 5 (A Major) — does it feel easier than fret 1?</h2>
    `,
    backgroundColor: "#D09691"
  },
  7: {
    title: "Lesson 7:",
    description: "Fingerpicking Fundamentals",
    customClass: "lesson-seven",
    content: `
      <h2>A New Way to Play</h2>
      <h3>Fingerpicking (also called fingerstyle) means using your individual fingers instead of a pick to pluck the strings. It creates a softer, more detailed sound and is the foundation of classical guitar, folk, and ballads.</h3>

      <hr/>
      <h2>Right Hand Finger Names</h2>
      <h3>In fingerpicking, each finger has a role:</h3>
      <h3><strong>Thumb (p)</strong> — plays the low E, A, and D strings (bass strings).</h3>
      <h3><strong>Index (i)</strong> — plays the G string.</h3>
      <h3><strong>Middle (m)</strong> — plays the B string.</h3>
      <h3><strong>Ring (a)</strong> — plays the high e string.</h3>
      <p>These assignments aren't absolute rules, but they're the best starting point.</p>

      <hr/>
      <h2>Pattern 1: The Pinch</h2>
      <h3>Hold an Em chord. Simultaneously pluck the low E string with your thumb and the high e string with your ring finger. This "pinch" creates a full, resonant sound and trains both hands to work together.</h3>

      <hr/>
      <h2>Pattern 2: The Basic Arpeggio</h2>
      <h3>An arpeggio is a chord played one note at a time. Hold a C Major chord and pluck: <strong>A (thumb) → G (index) → B (middle) → e (ring)</strong>. Repeat in a steady rhythm.</h3>
      <h3>Once comfortable, try reversing it: <strong>e → B → G → A</strong>.</h3>

      <hr/>
      <h2>Travis Picking (Introduction)</h2>
      <h3>Travis picking alternates the thumb between two bass strings while the fingers play melody notes above. Hold an Em and alternate your thumb between the low E and A strings while your index finger plucks the G string on the off-beats.</h3>
      <p>It sounds complex but becomes muscle memory with time — go very slow at first.</p>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Practice the basic arpeggio pattern on Em and C Major for 5 minutes each.</h2>
        <h2>Try the thumb alternation exercise using only two strings before adding the fingers.</h2>
    `,
    backgroundColor: "#D09691"
  },
  8: {
    title: "Lesson 8:",
    description: "The Minor Pentatonic Scale",
    customClass: "lesson-eight",
    content: `
      <h2>The Most Important Scale in Rock & Blues</h2>
      <h3>The <strong>minor pentatonic scale</strong> is the go-to scale for solos, improvisation, and riffs. It's used in blues, rock, metal, and pop. "Penta" means five — this scale uses only 5 notes instead of 7, which makes it very forgiving and musical.</h3>

      <hr/>
      <h2>The A Minor Pentatonic Scale (Box Pattern 1)</h2>
      <h3>This is the most widely used position. Memorize this box pattern:</h3>
      <p><strong>e: --5--8--</strong></p>
      <p><strong>B: --5--8--</strong></p>
      <p><strong>G: --5--7--</strong></p>
      <p><strong>D: --5--7--</strong></p>
      <p><strong>A: --5--7--</strong></p>
      <p><strong>E: --5--8--</strong></p>
      <h3>Your index finger covers fret 5 on every string. Your ring and pinky cover fret 7 and 8 respectively. Start at the low E and play each note going up, then come back down.</h3>

      <hr/>
      <h2>Making It Musical</h2>
      <h3>Don't just play scales up and down — that sounds like an exercise! Try skipping strings, playing notes in a different order, or repeating short patterns called <strong>licks</strong>.</h3>
      <h3>Example lick: Play fret 5 then 8 on the B string, then fret 5 on the high e — this is a classic blues move!</h3>

      <hr/>
      <h2>The Scale is Moveable</h2>
      <h3>Just like power chords, the pentatonic box shape moves with you. Slide it to start at fret 7 and you're in B minor pentatonic. Fret 3 = G minor pentatonic. The shape is always the same!</h3>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Memorize the A minor pentatonic box pattern — play it up and down 10 times daily.</h2>
        <h2>Try improvising over a backing track in A minor using only this scale.</h2>
    `,
    backgroundColor: "#D09691"
  },
  9: {
    title: "Lesson 9:",
    description: "Playing Your First Full Song",
    customClass: "lesson-nine",
    content: `
      <h2>It's Time to Put It All Together!</h2>
      <h3>Everything you've learned — chord shapes, strumming patterns, transitions — comes together when you play a real song. This lesson walks you through learning a complete song from start to finish.</h3>

      <hr/>
      <h2>How to Learn a Song (The Right Way)</h2>
      <h3><strong>Step 1: Find the chords.</strong> Use a site like Ultimate Guitar to find a chord chart. Look for songs in keys you know — G, C, D, Em, Am.</h3>
      <h3><strong>Step 2: Learn each chord individually</strong> before trying to play the whole song. Make sure each one rings cleanly.</h3>
      <h3><strong>Step 3: Practice the transitions</strong> — just the chord changes, back and forth, slowly. Don't add strumming yet.</h3>
      <h3><strong>Step 4: Add the strumming pattern.</strong> Start with all downstrokes if needed. Add complexity once transitions feel smooth.</h3>
      <h3><strong>Step 5: Play along with the recording</strong> at a slow speed (YouTube and Spotify both have speed controls).</h3>

      <hr/>
      <h2>Beginner-Friendly Song Suggestions</h2>
      <h3><strong>"Knockin' on Heaven's Door"</strong> — G, D, Am/C. Simple pattern, slow tempo.</h3>
      <h3><strong>"Horse With No Name"</strong> — Only two chords (Em and D6). Great for transitions.</h3>
      <h3><strong>"Wish You Were Here"</strong> — G, Em, C, D, Am. A legendary song with chords you already know.</h3>
      <h3><strong>"Brown Eyed Girl"</strong> — G, C, D, Em. A classic that sounds impressive.</h3>

      <hr/>
      <h2>Don't Rush</h2>
      <h3>Playing a song at 60% speed cleanly is far better than playing it at full speed sloppily. Record yourself — you'll hear things you miss while playing.</h3>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Pick one song from the list above and work through all 5 steps this week.</h2>
        <h2>Record a short clip of yourself playing — listening back is one of the best learning tools available.</h2>
    `,
    backgroundColor: "#D09691"
  },
  10: {
    title: "Lesson 10:",
    description: "Dynamics, Tone & Expression",
    customClass: "lesson-ten",
    content: `
      <h2>Playing Loud Isn't Playing Well</h2>
      <h3><strong>Dynamics</strong> are the variation in volume and intensity in your playing. A guitarist who can play softly and gradually build to a powerful strum is far more musical than one who plays at the same volume constantly.</h3>

      <hr/>
      <h2>How to Control Your Dynamics</h2>
      <h3>The main controller of volume on guitar is <strong>how hard you strum or pick</strong>. Light brushing of the strings creates softness. Digging in with the pick creates intensity.</h3>
      <h3>Practice playing the same chord progression: once very softly, once at medium, and once as hard and full as you can. Notice how the feel of the song changes completely.</h3>

      <hr/>
      <h2>Tone: Where You Pick Matters</h2>
      <h3>Picking near the <strong>neck</strong> produces a warm, full, rounded tone. Picking near the <strong>bridge</strong> produces a bright, sharp, twangy tone.</h3>
      <p>Try strumming the same chord at three different spots between the neck and bridge and listen to how drastically the sound changes. There's no "wrong" position — different songs call for different tones.</p>

      <hr/>
      <h2>Muting & Silence as Expression</h2>
      <h3>Silence is music too. Practice stopping strings dead with your strumming hand by laying it flat across the strings mid-strum. This is called a <strong>choke</strong> or <strong>staccato strum</strong> and it adds a rhythmic punch to your playing.</h3>

      <hr/>
      <h2>For Electric Players: Using Your Controls</h2>
      <h3>Your guitar's <strong>volume knob</strong> can be rolled off slightly for a cleaner, rounder tone and cranked for a full aggressive sound. Your <strong>tone knob</strong> rolls off high frequencies for a warmer, darker sound. Experiment — it's all part of finding your voice.</h3>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Play through a chord progression you know three times: once very quietly, once at medium, once as loud and full as possible.</h2>
        <h2>Try the pick position experiment — neck vs. bridge — and describe (even just to yourself) how each sounds.</h2>
    `,
    backgroundColor: "#D09691"
  },
  11: {
    title: "Lesson 11:",
    description: "Minor Keys & The Natural Minor Scale",
    customClass: "lesson-eleven",
    content: `
      <h2>Major vs. Minor: The Emotional Difference</h2>
      <h3>Major keys tend to sound <strong>happy, bright, or resolved</strong>. Minor keys tend to sound <strong>sad, tense, or mysterious</strong>. Understanding both gives you a full emotional palette as a musician.</h3>

      <hr/>
      <h2>The Natural Minor Scale</h2>
      <h3>The A Natural Minor scale uses the notes: <strong>A B C D E F G A</strong>. Compared to A Major, the 3rd, 6th, and 7th notes are lowered by a half step — that's what gives it the darker quality.</h3>
      <h3>TAB for A Natural Minor (starting on the A string, open position):</h3>
      <p><strong>A: 0-2-3</strong></p>
      <p><strong>D: 0-2-3</strong></p>
      <p><strong>G: 0-2</strong></p>
      <p><strong>B: 1-3</strong></p>
      <p><strong>e: 0-1-3</strong></p>

      <hr/>
      <h2>Relative Major & Minor</h2>
      <h3>Here's a cool secret: <strong>A minor and C major share all the same notes</strong>. They are called <strong>relative keys</strong>. If a song uses Am, Em, Dm, and C, it's in the key of A minor (or C major) — and your C major scale shapes will work over it.</h3>
      <p>This is why the chords Am, Em, Dm, C, and G all sound great together.</p>

      <hr/>
      <h2>Common Minor Key Chord Progressions</h2>
      <h3><strong>Am - F - C - G</strong> — one of the most common progressions in pop music.</h3>
      <h3><strong>Am - G - F - E</strong> — the "Andalusian Cadence," used in flamenco and rock.</h3>
      <h3><strong>Em - C - G - D</strong> — also extremely common in modern music.</h3>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Learn the A Natural Minor scale up and down in the open position.</h2>
        <h2>Practice the Am - F - C - G progression with four beats per chord using a strumming pattern of your choice.</h2>
    `,
    backgroundColor: "#D09691"
  },
  12: {
    title: "Lesson 12:",
    description: "The CAGED System",
    customClass: "lesson-twelve",
    content: `
      <h2>Unlocking the Entire Fretboard</h2>
      <h3>The <strong>CAGED system</strong> is one of the most powerful concepts in guitar theory. It shows how five open chord shapes — <strong>C, A, G, E, D</strong> — link together to cover the entire neck. Once understood, you'll never feel "lost" on the fretboard again.</h3>

      <hr/>
      <h2>How It Works</h2>
      <h3>Each of the five open chord shapes can be turned into a barre chord and moved up the neck. The shapes connect end-to-end in the order C → A → G → E → D → C, repeating across the fretboard.</h3>
      <h3>For example, if you play a G chord using the open G shape at fret 3, the next G chord up the neck uses the E barre shape at fret 5... then the D shape at fret 7... and so on.</h3>

      <hr/>
      <h2>Visualizing Two Shapes</h2>
      <h3><strong>G chord — E shape barre at fret 3:</strong> This is the standard barre chord E shape with the root on the low E string at fret 3.</h3>
      <h3><strong>G chord — D shape at fret 7:</strong> Use the open D shape, barre at fret 7. Your index finger covers fret 7 and you form the D chord a shape above it.</h3>
      <p>Both are G major — same chord, different positions, different voicings. They each have a unique flavor.</p>

      <hr/>
      <h2>Why This Matters for Solos</h2>
      <h3>Each CAGED shape has an associated pentatonic scale shape embedded within it. When you know which CAGED shape you're in, you automatically know which scale pattern to use for soloing.</h3>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Find at least two different places on the neck where you can play a G Major chord using different shapes.</h2>
        <h2>Look up a CAGED diagram online and try to trace the five shapes connecting across the neck for one chord (G or C is a good starting point).</h2>
    `,
    backgroundColor: "#D09691"
  },
  13: {
    title: "Lesson 13:",
    description: "Intermediate Strumming & Syncopation",
    customClass: "lesson-thirteen",
    content: `
      <h2>Beyond the Basic Strum</h2>
      <h3>You've learned D and D-DU-UDU patterns. Now it's time to add <strong>syncopation</strong> — accenting the "off" beats (the "ands" between the counts). This is what makes rhythm guitar feel alive instead of mechanical.</h3>

      <hr/>
      <h2>Counting 16th Notes</h2>
      <h3>Instead of counting "1 - 2 - 3 - 4," count: <strong>"1 e + a 2 e + a 3 e + a 4 e + a"</strong> (the "+" is called the "and"). This divides each beat into four smaller pieces.</h3>
      <p>Your strumming hand should move down on the numbers and up on the "ands," even if you don't hit the strings every time. Keeping the hand moving is the key — you just choose when to make contact.</p>

      <hr/>
      <h2>Pattern 3: The Syncopated Strum</h2>
      <h3>This pattern skips the downstroke on beat 3, creating a "chunk" of space that makes the rhythm groove:</h3>
      <h3><strong>D - DU - UDU</strong> — the space where beat 3 would be is left empty (hand still moves but doesn't hit). Count: 1 - 2 + - + 4 +.</h3>
      <p>This is one of the most widely used strumming patterns in pop and rock. You'll recognize it in dozens of songs once you learn it.</p>

      <hr/>
      <h2>The "Chunk" (Percussive Mute)</h2>
      <h3>On the upstroke before beat 1, briefly mute the strings with your fretting hand by releasing pressure (don't lift the fingers off completely). The "chunk" sound adds a percussive, rhythmic feel like a snare hit.</h3>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Practice counting "1 e + a 2 e + a..." out loud while tapping your foot before even picking up the guitar.</h2>
        <h2>Apply Pattern 3 to the G - C - D progression at 70 BPM.</h2>
    `,
    backgroundColor: "#D09691"
  },
  14: {
    title: "Lesson 14:",
    description: "Barre Chords: Minor Shapes & Full Mastery",
    customClass: "lesson-fourteen",
    content: `
      <h2>Completing Your Barre Chord Toolkit</h2>
      <h3>In Lesson 6 you learned the E-shape major barre chord (like F Major). Now we add the <strong>A-shape</strong> barre chords and introduce <strong>minor barre chords</strong> — giving you every major and minor chord on the entire neck.</h3>

      <hr/>
      <h2>The E Minor Barre Shape</h2>
      <h3>Take the open Em chord shape and barre it at any fret. At fret 5, this gives you <strong>A minor</strong>. The difference from the major barre: remove your middle finger (the G string note). The shape is: barre + ring finger on A string + pinky on D string.</h3>
      <h3>On the low E string: fret 1 = Fm, fret 3 = Gm, fret 5 = Am, fret 7 = Bm, fret 8 = Cm.</h3>

      <hr/>
      <h2>The A Major Barre Shape</h2>
      <h3>Barre at a fret with your index finger and use your ring finger to press the D, G, and B strings two frets higher simultaneously. At fret 2, this is <strong>B Major</strong>. This shape is harder because of the three-string ring finger press — some players use their pinky for one string.</h3>
      <p>Alternative: Use ring, middle, and pinky on the D, G, and B strings individually. Either approach works — choose what feels natural.</p>

      <hr/>
      <h2>Barre Chord Transition Drills</h2>
      <h3>Practice these progressions using only barre chords — no open chords:</h3>
      <h3><strong>Bm - G - D - A</strong> (all barre or mixed)</h3>
      <h3><strong>Am - F - C - G</strong> using full barre shapes for Am and F</h3>
      <p>Moving between barre chords builds tremendous speed and strength. Even 5 minutes a day will show improvement within two weeks.</p>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Practice the Em barre shape at frets 3, 5, and 7 until each rings cleanly.</h2>
        <h2>Try the full Bm - G - D - A progression using barre chords, four beats each at 60 BPM.</h2>
    `,
    backgroundColor: "#D09691"
  },
  15: {
    title: "Lesson 15:",
    description: "Legato: Hammer-ons, Pull-offs & Slides",
    customClass: "lesson-fifteen",
    content: `
      <h2>What is Legato?</h2>
      <h3>Legato means "smooth and connected." On guitar, legato techniques let you play multiple notes with <strong>one pick stroke</strong> — the fretting hand does the work. The result is a fluid, flowing sound used in blues, rock solos, and classical playing.</h3>

      <hr/>
      <h2>Hammer-ons</h2>
      <h3>Pick a note, then without picking again, <strong>hammer</strong> a finger down onto a higher fret on the same string hard enough to make it sound. In TAB, this is written as <strong>2h4</strong> (hammer from fret 2 to fret 4).</h3>
      <h3>The key is speed and firmness — a slow or gentle hammer won't produce a clear note. Think of your finger as a tiny hammer hitting the string against the fret.</h3>

      <hr/>
      <h2>Pull-offs</h2>
      <h3>The reverse of a hammer-on. Have two fingers down on a string (say fret 5 and fret 7). Pick the higher note, then <strong>pull</strong> your top finger off the string in a slight downward curl — this plucks the string and sounds the lower note. Written as <strong>7p5</strong>.</h3>
      <p>Don't just lift your finger straight up — the slight sideways pull is what makes the lower note ring out clearly.</p>

      <hr/>
      <h2>Slides</h2>
      <h3>Pick a note, then slide your finger along the string to a higher or lower fret without lifting it. Written as <strong>5/7</strong> (slide up) or <strong>7/5</strong> (slide down). Maintain pressure the whole way or the note will die out mid-slide.</h3>

      <hr/>
      <h2>Combining Them</h2>
      <h3>A classic pentatonic lick using all three: <strong>5h7 - 7p5 - 5/7</strong> on the B string. Pick once, hammer on, pull off back, then slide back up. This is a building block of blues and rock soloing.</h3>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Practice hammer-ons and pull-offs slowly on the B and G strings using the pentatonic scale you know.</h2>
        <h2>Try the combined lick: 5h7 → 7p5 → 5/7 at a slow tempo until it's clean.</h2>
    `,
    backgroundColor: "#D09691"
  },
  16: {
    title: "Lesson 16:",
    description: "Blues Fundamentals & The 12-Bar Blues",
    customClass: "lesson-sixteen",
    content: `
      <h2>The Foundation of Modern Music</h2>
      <h3>Blues is the root of rock, jazz, soul, and R&B. The <strong>12-bar blues</strong> is the most important chord progression in all of popular music. Once you learn it, you'll recognize it in hundreds of songs.</h3>

      <hr/>
      <h2>The 12-Bar Blues in A</h2>
      <h3>Each box = one bar (4 beats). Use A5, D5, and E5 power chords or full chords:</h3>
      <p><strong>| A7 | A7 | A7 | A7 |</strong></p>
      <p><strong>| D7 | D7 | A7 | A7 |</strong></p>
      <p><strong>| E7 | D7 | A7 | E7 |</strong></p>
      <h3>The last E7 is the "turnaround" — it drives the progression back to the start. Play this on loop!</h3>

      <hr/>
      <h2>Dominant 7th Chords</h2>
      <h3>Notice the chords are A<strong>7</strong>, D<strong>7</strong>, E<strong>7</strong>. The "7" adds a slightly tense, bluesy flavor. Open shapes:</h3>
      <h3><strong>A7:</strong> X-0-2-0-2-0</h3>
      <h3><strong>D7:</strong> X-X-0-2-1-2</h3>
      <h3><strong>E7:</strong> 0-2-0-1-0-0</h3>

      <hr/>
      <h2>The Blues Shuffle</h2>
      <h3>The classic blues rhythm is the <strong>shuffle</strong> — instead of straight eighth notes, you play a long-short "swing" feel. Think of it as "duh-duh DUH, duh-duh DUH." Listen to any Stevie Ray Vaughan or BB King song and you'll hear it immediately.</h3>
      <p>Tip: Put on a 12-bar blues backing track and just improvise using your A minor pentatonic scale. You'll be surprised how natural it sounds!</p>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Memorize the 12-bar blues progression in A and play it until it's automatic.</h2>
        <h2>Play the pentatonic scale over a 12-bar blues backing track in A — just explore freely without worrying about sounding "right."</h2>
    `,
    backgroundColor: "#D09691"
  },
  17: {
    title: "Lesson 17:",
    description: "Intermediate Fingerpicking & Arpeggios",
    customClass: "lesson-seventeen",
    content: `
      <h2>Taking Fingerstyle Further</h2>
      <h3>In Lesson 7 you learned the basics of fingerpicking. Now we'll explore more complex patterns and introduce the concept of playing <strong>melody and bass simultaneously</strong> — one of the most impressive things a guitarist can do.</h3>

      <hr/>
      <h2>Pattern: The Classical Waltz (3/4 Time)</h2>
      <h3>Some songs are in <strong>3/4 time</strong> (three beats per bar instead of four). Hold a C Major chord and pluck: <strong>A (thumb) → B (middle) → e (ring)</strong>. Count "1 - 2 - 3" and repeat. This is a waltz pattern, used in many folk and classical pieces.</h3>

      <hr/>
      <h2>Alternating Bass with Melody</h2>
      <h3>Hold a G Major chord. On beat 1 and 3, your thumb plays the low E string (the bass note). On beats 2 and 4, your fingers play the higher strings together or in sequence. The bass line and chord notes weave together into a complete, full arrangement.</h3>
      <p>This technique is the backbone of players like James Taylor, Paul Simon, and classical guitarists worldwide.</p>

      <hr/>
      <h2>Chord Melody Introduction</h2>
      <h3>Chord melody means the top note of your chord shape follows the melody of a song, while the lower strings provide harmony. Try playing a simple tune like "Happy Birthday" where every melody note has a chord underneath it.</h3>
      <p>This takes time — don't be discouraged. Start by just getting the melody notes right on their own, then slowly add one chord note at a time underneath.</p>

      <hr/>
      <h2>Right Hand Independence</h2>
      <h3>The biggest challenge in fingerstyle is making each finger move independently. Try this drill: tap your thumb on a table in a steady pulse while your index, middle, and ring fingers tap in a different rhythm above. This cross-coordination is exactly what fingerpicking demands.</h3>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Practice the waltz pattern on Am, C, G, and Em in a loop.</h2>
        <h2>Try the alternating bass pattern on a G Major chord for 3 minutes straight.</h2>
    `,
    backgroundColor: "#D09691"
  },
  18: {
    title: "Lesson 18:",
    description: "Song Structure & Playing With Others",
    customClass: "lesson-eighteen",
    content: `
      <h2>How Songs Are Built</h2>
      <h3>Most songs in popular music follow a predictable structure. Understanding this structure helps you learn songs faster and even write your own.</h3>
      <h3><strong>Verse:</strong> The main narrative section. Usually repeats with different lyrics but the same chord progression.</h3>
      <h3><strong>Chorus:</strong> The emotional peak of the song. Louder, more energetic, with lyrics that don't change.</h3>
      <h3><strong>Bridge:</strong> A contrasting section — different chords, different feel — that breaks up the verse/chorus cycle.</h3>
      <h3><strong>Intro / Outro:</strong> The opening and closing sections, often instrumental.</h3>

      <hr/>
      <h2>Playing With a Drummer</h2>
      <h3>When playing with a drummer, <strong>lock in with the kick and snare</strong>. The kick (bass drum) usually hits on beats 1 and 3; the snare on beats 2 and 4. Your rhythm guitar strums should align with this framework.</h3>
      <p>The most important skill when playing with others is <strong>listening</strong>. Play less, leave space, and support the other musicians rather than trying to fill every moment.</p>

      <hr/>
      <h2>Playing With a Bassist</h2>
      <h3>You and the bassist are the rhythm section. Avoid clashing by <strong>simplifying your part</strong> when the bass is active. The bass covers the low-end; you can focus on mid-range chord voicings higher up the neck (this is where the CAGED system really shines).</h3>

      <hr/>
      <h2>Jamming & Communication</h2>
      <h3>When jamming without sheet music, musicians communicate through <strong>eye contact, head nods, and musical cues</strong>. A nod can signal a chorus is coming. A raised eyebrow might mean "take a solo." Learn to read these cues — it's a language of its own.</h3>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Pick a song you know and map out its structure: how many verses, choruses, and bridges does it have?</h2>
        <h2>If possible, try playing with another musician — even just trading chords with someone on drums or bass.</h2>
    `,
    backgroundColor: "#D09691"
  },
  19: {
    title: "Lesson 19:",
    description: "Vibrato, Bends & Expressive Lead Techniques",
    customClass: "lesson-nineteen",
    content: `
      <h2>The Voice of the Guitar</h2>
      <h3>Any guitarist can play the right notes. What separates great players is <strong>how</strong> they deliver those notes. Vibrato and string bends are the most expressive tools in lead guitar — they are what makes a guitar "sing."</h3>

      <hr/>
      <h2>String Bends</h2>
      <h3>Pick a note on the G string (try fret 7) and push the string <strong>upward</strong> toward the ceiling while keeping your finger pressed down. The pitch rises as the string stretches. A <strong>half-step bend</strong> raises the pitch by one fret; a <strong>whole-step bend</strong> raises it by two frets.</h3>
      <h3>Support the bending finger with the fingers behind it — if bending with your ring finger, keep your middle and index finger on the string behind it. This gives you the strength to push without injury.</h3>
      <p>TAB notation: 7b9 means bend the note at fret 7 up to the pitch of fret 9.</p>

      <hr/>
      <h2>Vibrato</h2>
      <h3>Vibrato is a rapid, controlled oscillation of a note's pitch. After picking a note, repeatedly push and release the string in a steady rhythm — up a tiny amount and back, up and back. The result is a wavering, singing quality.</h3>
      <h3>Width and speed are personal: <strong>narrow and fast</strong> (classical style) vs. <strong>wide and slow</strong> (blues style). Listen to players like B.B. King (wide vibrato) and Eric Clapton (refined, moderate) and try to imitate their feel.</h3>

      <hr/>
      <h2>The Pre-Bend</h2>
      <h3>Bend the string to pitch <em>before</em> picking it, then pick and release. This gives the opposite of a normal bend — you hear the note go down instead of up. Written in TAB as <strong>(9)b7</strong>.</h3>

      <hr/>
      <h2>Putting It Together</h2>
      <h3>A classic BB King-style lick: bend fret 7 on the G string up a whole step, hold with vibrato, then release. Simple, but intensely expressive.</h3>

      <hr/>
      <h2>Optional Homework:</h2>
        <h2>Practice whole-step bends on the G string at frets 5 and 7. Check accuracy by hitting the target fret first, then bending up to match it by ear.</h2>
        <h2>Work on vibrato for 2 minutes daily — consistency and control matter more than width.</h2>
    `,
    backgroundColor: "#D09691"
  },
  20: {
    title: "Lesson 20:",
    description: "Putting It All Together & Your Next Steps",
    customClass: "lesson-twenty",
    content: `
      <h2>You've Come So Far</h2>
      <h3>Take a moment to recognize how much ground you've covered: you know chords, scales, rhythm, fingerpicking, barre chords, legato, bends, blues, theory, and more. Most guitarists never get this far. This is not the end — it's the beginning of a lifelong journey.</h3>

      <hr/>
      <h2>What You've Mastered</h2>
      <h3>Over these 20 lessons you have learned:</h3>
      <p>Open chords (Em, Am, G, C, D, Cmaj7) and barre chords in major and minor shapes. The major scale, natural minor scale, and minor pentatonic scale. Strumming patterns including syncopation, the shuffle, and fingerpicking. Expressive techniques: hammer-ons, pull-offs, slides, bends, and vibrato. Music theory: keys, intervals, the CAGED system, 12-bar blues, and song structure. How to learn songs, play with others, and develop your own sound.</p>

      <hr/>
      <h2>Choosing Your Path Forward</h2>
      <h3><strong>If you love rhythm guitar:</strong> Dive deep into chord voicings, funk rhythms, and jazz chords. Learn every song you love.</h3>
      <h3><strong>If you love lead guitar:</strong> Expand your pentatonic knowledge to all 5 box positions. Study phrasing by learning solos note-for-note.</h3>
      <h3><strong>If you love fingerstyle:</strong> Explore Travis picking, chord melody arrangements, and classical technique.</h3>
      <h3><strong>If you love songwriting:</strong> Start with the progressions you know and experiment with lyrics, melodies, and song structure.</h3>

      <hr/>
      <h2>The Secret to Getting Better</h2>
      <h3>There is no secret — it's <strong>consistent, focused practice</strong>. 20 minutes every day will make you a better guitarist than 3 hours on the weekend. Practice what's hard, not what's comfortable.</h3>
      <p>Record yourself regularly. Play with other musicians whenever possible. And above all — play music that genuinely moves you. Passion is the engine that drives every great guitarist.</p>

      <hr/>
      <h2>Final Challenge:</h2>
        <h2>Learn one complete song — intro, verse, chorus, bridge, and outro — and perform it for someone. Even one person. That performance will teach you more than any lesson can.</h2>
        <h2>Keep playing. Keep listening. Keep growing.</h2>
    `,
    backgroundColor: "#D09691"
  },
  test1: { title: "Optional Test", description: "Basics Quiz", customClass: "guitar-lesson-test", content: `<h2>Coming Soon</h2>`, backgroundColor: "#D09691" }
};

function GuitarLesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();
  
  const lessonKey = isNaN(lessonId) ? lessonId : Number(lessonId);
  const lesson = guitarLessonData[lessonKey];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (lesson) {
      document.body.style.backgroundColor = lesson.backgroundColor;
    }
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [lesson]);

  const handleCompleteLesson = async () => {
    console.log('=== GUITAR LESSON SAVE DEBUG ===');
    console.log('lessonId from URL:', lessonId);
    console.log('lessonVal (converted):', isNaN(lessonId) ? lessonId : Number(lessonId));
    console.log('isLoaded:', isLoaded);
    console.log('isSignedIn:', isSignedIn);
    
    if (isLoaded && isSignedIn && user) {
      try {
        const currentLessons = user.unsafeMetadata.completedGuitarLessons || [];
        const lessonVal = isNaN(lessonId) ? lessonId : Number(lessonId);

        console.log('Current completed lessons:', currentLessons);
        console.log('Already includes this lesson?', currentLessons.includes(lessonVal));

        // Update Clerk Metadata if not already completed
        if (!currentLessons.includes(lessonVal)) {
          const updatedLessons = [...currentLessons, lessonVal];
          console.log('Saving to Clerk:', updatedLessons);
          
          await user.update({
            unsafeMetadata: {
              ...user.unsafeMetadata,
              completedGuitarLessons: updatedLessons
            }
          });
          
          console.log('✅ Save successful!');
        } else {
          console.log('⚠️ Lesson already completed, skipping save');
        }
      } catch (err) {
        console.error("❌ Error saving lesson progress:", err);
      }
    } else {
      console.log('❌ Cannot save - not loaded or not signed in');
    }
    
    navigate('/guitar', { state: { fromLesson: true } });
  };

  if (!lesson) {
    return (
      <div className="guitar-lesson-container">
        <h1>Lesson not found</h1>
        <Link to="/guitar" className="guitar-back-button">← Back to Roadmap</Link>
      </div>
    );
  }

  return (
    <div className={`guitar-lesson-container ${lesson.customClass || ''}`}>
      <Link to="/guitar" className="guitar-back-button">← Back to Roadmap</Link>
      
      <h1 className="guitar-lesson-title">{lesson.title}</h1>
      <p className="guitar-lesson-description">{lesson.description}</p>
      <div className="guitar-lesson-content" dangerouslySetInnerHTML={{ __html: lesson.content }}/>
      
      <button onClick={handleCompleteLesson} className="guitar-back-button bottom-button">
        Finish Lesson & Return to Roadmap
      </button>
    </div>
  );
}

export default GuitarLesson;