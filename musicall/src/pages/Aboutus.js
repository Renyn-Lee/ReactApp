import '../styles.css';

export default function Aboutus(){
    return <main>
    <div  className="About-us-box">
   <h1> About us</h1>
   <h2 className="About-us-description"> Legatto is a free website created by high school students to help you reach your music goal. We incorporate lessons that will help you understand music concepts from our own experiences as a student, teacher, and band member. We don’t charge a subscription or fee and we don’t ask for a donation. All we ask is for you to share this website with your friends! Start learning today</h2>
  </div>
  <div className="Contact-info-box">
  <h1>Contact Info:</h1>
    <ul className="contact-info">
      <li className='contactbox'> Email:</li>
      <li className='contactbox'> Facebook:</li>
      <li className='contactbox'> Instagram:</li>
    </ul>
  </div>
  <div className="faq-box"> <h1>Questions & Answers</h1>
    <h2 className="contact-info"> Q: I’m a total beginner. Where do I start?</h2>
   </div>
 </main> 
}