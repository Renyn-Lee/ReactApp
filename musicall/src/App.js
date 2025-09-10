import Navbar from "./Navbar"
import Aboutus from "./pages/Aboutus"
import Guitar from "./pages/Guitar"
import Home from "./pages/Home"
import Piano from "./pages/Piano"

function App(){
    let component
    switch (window.location.pathname) {
    case"/Home":
    component = <Home/>
        break
    case"/Aboutus":
    component = <Aboutus/>
        break
   case"/Guitar":
   component = <Guitar/>
        break
    case"/Piano":
    component = <Piano/>
        break
    }
    return (
<>
    <Navbar/>
    {component}
</>
    )
}

export default App