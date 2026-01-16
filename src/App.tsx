import { useEffect, useState } from 'react'
import './App.css'
import style from "./style.module.css"
import { LoadingOutlined, WarningOutlined } from '@ant-design/icons'
import { Base_Url, Primary_Color } from './constants'
import MainPage from './views'

function App() {
  const [serverStart, setServerStart] = useState({
    status: "pending"
  })

  const fetchServerStart = async () => {
    try {
      setServerStart({ status: "pending" });
      await fetch(`${Base_Url}/api/ping`)
      setServerStart({ status: "success" });
    } catch (error) {
      setServerStart({ status: "error" });
    }
  }

  useEffect(() => {
    fetchServerStart()
  }, [])
  return (
    <>
      {serverStart?.status == "pending" && (
        <>
          <div className={style.spinningContainer}>
            <LoadingOutlined spin style={{ fontSize: 40, color: Primary_Color }} />
            <div className={style.LoadingText} style={{ color: Primary_Color }}>Please Wait, Server Loading...</div>
          </div>
        </>
      )}
      {serverStart?.status == "error" && (
        <>
          <div className={style.spinningContainer}>
            <WarningOutlined style={{ fontSize: 40, color: "red" }} />
            <div className={style.LoadingText}>Server Failed</div>
          </div>
        </>
      )}
      {serverStart?.status == "success" && (
        <>
          <MainPage/>
        </>
      )}
    </>
  )
}

export default App
