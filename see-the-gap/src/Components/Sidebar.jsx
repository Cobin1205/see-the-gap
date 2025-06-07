import {useState} from 'react'

const Sidebar = ({children}) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {setIsOpen(!isOpen)}

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="toggleSidebar" onClick={toggleSidebar}>
                    {isOpen ? '<' : '>'}
                </div>

                

                <div className="sidebarScroll">
                    <div style={{height: "50px"}}>
                        <h3>Components</h3>
                        <hr style={{borderColor: "#111111", width: "90%"}}/>
                    </div>
                    
                    {children}
                </div>
            </div>
        </>
    )
}

export default Sidebar