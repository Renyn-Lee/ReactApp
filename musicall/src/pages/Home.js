import '../styles.css';

export default function home(){
    return <main>
        <div  className="Homescreen-Box">
   <h1 className='Home-Title'> Musicall</h1>
   <h2 className="Homescreen-Motto"> Learning That Lasts</h2>
   <h1 className="homebox3"> Start Your Journey Now!</h1>
   <button className='HomeButton'>Get Started</button>
  </div>
  <div className="home-desc">
  <h3>Learning music has never been this fast and easy!
Musicall is a free resource created by students to help you easily learn music. Our lessons are short and easy, helping you learn faster than your friends.</h3>
  </div>
  <div className="twond-box"> <h1>Learn With Musicall!</h1>
    <ul className="twond-box-text">  
        <li>Faster</li>
        <li>Better</li>
        <li>Funner</li>
        <li className='extraItalics'>Learning That Lasts</li>
    </ul>
   </div>
    </main>
}