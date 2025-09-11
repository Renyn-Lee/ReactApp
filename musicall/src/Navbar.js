import './styles.css';
export default function Navbar(){
  const path = window.location.pathname
  return<nav className='nav'>
<a href="/" className='site-title'>Musicall</a>
<ul> 
  <CustomLink href="/Piano"> Piano </CustomLink>
  <CustomLink href="/Guitar"> Guitar </CustomLink>
  <CustomLink href="/Aboutus"> About us </CustomLink>
</ul>
  </nav>
}

function CustomLink({href, children, ...props}) {
  const path = window.location.pathname
  return (
    <li className= {path === href ? "active" :""} >
        <a href={href} {...props}>{children}</a>
    </li>
  )
}