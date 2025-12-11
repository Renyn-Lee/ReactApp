import '../styles.css';

export default function Aboutus(){
    return <main>
    <div  className="About-us-box">
   <h1> About us</h1>
   <h2 className="About-us-description"> Legatto is a free website created by high school students to help you reach your music goal. We incorporate lessons that will help you understand music concepts from our own experiences as a student, teacher, and band member. We don’t charge a subscription or fee and we don’t ask for a donation. Everything here is free! All we ask is for you to share this website with your friends and email us about bugs, issues or errors! Start learning today!</h2>
  </div>
  <div className="Contact-info-box">
  <h1>Contact Info:</h1>
    <ul className="contact-info">
      <li className='contactbox'> Email:</li>
      <li className='contactbox'> Facebook:</li>
      <li className='contactbox'> Instagram:</li>
    </ul>
  </div>
  {/* faq-box is for bold, contact-info is not bold*/}
  <div className="faq-box"> <h1>Questions & Answers</h1>
    <h2 className="faq-info"> Q: Do I really need to learn music theory? </h2>
    <h2 className='contact-info'>  A: You can certainly learn to play songs by ear or tabs without deep theory! However, learning the basics (like how chords are built or what a key signature is) will help you learn faster and eventually write your own music.</h2>
    <hr className='line'></hr>
    <h2 className='faq-info'>Q: How often should I practice?</h2>
    <h2 className='contact-info'>A: Consistency beats intensity! It is better to practice for 15 minutes every day than to practice for 3 hours once a week. Your brain needs sleep to solidify the muscle memory you build during practice.</h2>
    <hr className='line'></hr>
    <h2 className='faq-info'>Q: What does BPM mean?</h2>
    <h2 className='contact-info'>A: BPM stands for Beats Per Minute. It measures the tempo (speed) of a song. A clock ticks at 60 BPM. A standard pop song is usually around 100–120 BPM.</h2>
    <hr className='line'></hr>
    <h2 className='faq-info'>Q: How do I read sheet music?</h2>
    <h2 className='contact-info'>A: Reading sheet music is like learning a new language. Start with the basics: learn the names of the notes on the staff, understand rhythm notation, and practice sight-reading simple melodies. There are many online resources and apps that can help you improve your sight-reading skills.</h2>
    <hr className='line'></hr>
    <h2 className='faq-info'>Q: What is the best way to stay motivated while learning an instrument?</h2>
    <h2 className='contact-info'>A: Set small, achievable goals, celebrate your progress, and find music that you love to play. Joining a community of fellow learners or finding a practice buddy can also provide encouragement and accountability.</h2>
   </div>
 </main> 
}