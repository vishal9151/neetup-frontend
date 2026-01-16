import "./style.css"
import { useEffect, useState } from "react"
import { Modal } from "antd"
import QueryModal from "./QueryModal"

function Homepage() {
    const [showQuestionModal, setShowQuestionModal] = useState(false)


    useEffect(()=>{
        setShowQuestionModal(true);
    },[])
    return (
        <>
            {showQuestionModal && (
                <>
                    <Modal 
                        open={showQuestionModal} 
                        closable={false} 
                        footer={false} 
                        centered 
                        width="90%"
                        style={{ maxWidth: 500, minWidth: 320 }}
                    >
                        <QueryModal/>
                    </Modal>
                </>
            )}
        </>
    )
}

export default Homepage