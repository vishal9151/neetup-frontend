import { useEffect, useState } from 'react';
import style from "./style.module.css";
import { Button, Col, Input, message, Row, Slider, Tag } from 'antd';
import { Base_Url, NEETUP_LOGO, openSameUrlWithJobId, uniqueId } from '../../../constants';
import { PlusOutlined } from '@ant-design/icons';

// type for topics array
interface TopicItem {
  key: string;
  value: string;
}

function QueryModal() {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [input, setInput] = useState<string>("");
  const [questionNumber, setQuestionNumbers] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);

  const questionNumbersMarks = {
    5: {
      style: {
        fontSize: window.innerWidth <= 480 ? 8 : 10,
        color: "#7E7A86",
        fontWeight: 400
      },
      label: "5"
    },
    10: {
      style: {
        fontSize: window.innerWidth <= 480 ? 8 : 10,
        color: "#7E7A86",
        fontWeight: 400
      },
      label: "10"
    },
    15: {
      style: {
        fontSize: window.innerWidth <= 480 ? 8 : 10,
        color: "#7E7A86",
        fontWeight: 400
      },
      label: "15"
    },
    20: {
      style: {
        fontSize: window.innerWidth <= 480 ? 8 : 10,
        color: "#7E7A86",
        fontWeight: 400
      },
      label: "20"
    }
  }

  const fetchJobStatus = async (jobId: string)=>{
    try {
      const response = await fetch(`${Base_Url}/api/jobs/${jobId}`)
      const data = await response.json();
      const status = data?.status;

      if(status == "completed"){
        setLoading(false);
        openSameUrlWithJobId(jobId);
      }
      else if(status == "pending" || status == "processing"){
        setTimeout(()=>{
          fetchJobStatus(jobId);
        },10000)
      }
      else{
        throw new Error("Error in getting the data");
      }
    } catch (error) {
      message.error("error in getting the data");
      setLoading(false);
    }
  }

  const handleSubmitData = async () => {
    try {

      setLoading(true);

      const payload = {
        topics: topics?.map((topicData)=>topicData?.value),
        numberOfQuestions: questionNumber
      }

      const response = await fetch(`${Base_Url}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      const fromCache = data?.fromCache;
      const jobId = data?.jobId;

      if(fromCache){
        openSameUrlWithJobId(jobId);
      }
      else{
        fetchJobStatus(jobId);
      }

      console.log("Response:", data);

    } catch (error) {
      message.error("Error in getting the Data");
      setLoading(false);
    }
  }

  const handleAddTopic = (value: string) => {
    if (!value.trim()) return;
    const newId = uniqueId();
    setTopics((prev) => [...prev, { key: newId, value }]);
    setInput("");
  };

  const handleDeleteTopic = (id: string) => {
    setTopics((prev) => prev?.filter((data) => data.key != id));
  }

  useEffect(() => {
    console.log("TOPICS:", topics);
  }, [topics]);

  return (
    <div className={style.modalContainer}>
      <Row justify="center" align="middle" style={{ width: "100%", margin: "14px 0px 20px 0px" }}>
        <Col>
          <img src={NEETUP_LOGO} className={style.neetupLogo} alt="logo" />
        </Col>
      </Row>

      <Row justify={"center"} align={"middle"}>
        <div className={style.welcomeText}>Welcome to Neetup , Please Enter the Details...</div>
      </Row>

      <Row style={{ width: "100%" }} className="mt-2">
        <Input
          value={input}
          placeholder="Please Enter the Topic..."
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={() => handleAddTopic(input)}
          suffix={
            <PlusOutlined onClick={() => handleAddTopic(input)} style={{ cursor: "pointer" }} hidden={input.length == 0} />
          }
        />
      </Row>

      {topics?.length > 0 && (
        <>
          <Row style={{ margin: "20px 0px 0px 0px", width: "100%", overflowX: "auto", paddingBottom: "3px", flexWrap: "nowrap" }} className={`customScroll ${style.tagsContainer}`} gutter={[8, 8]} align={"middle"}>
            {topics?.map((topicData) => {
              return (
                <Col key={topicData?.key} style={{ flexShrink: 0 }}>
                  <Tag closeIcon onClose={() => handleDeleteTopic(topicData?.key)} className={style.topicTag}>
                    {topicData?.value}
                  </Tag>
                </Col>
              )
            })}
          </Row>
        </>
      )}

      <Row gutter={[8, 8]} align={"middle"} style={{ marginTop: "15px", width: "100%" }}>
        <Col xs={24} sm={8} md={6}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#333333", paddingTop: "10px", textAlign: "center" }}>No. of Questions :</div>
        </Col>
        <Col xs={24} sm={16} md={18}>
          <Slider
            value={questionNumber}
            min={5}
            max={20}
            step={1}
            className={"customSlider"}
            marks={questionNumbersMarks}
            style={{ width: "100%", maxWidth: "300px" }}
            onChange={(value) => setQuestionNumbers(value)}
          />
        </Col>
      </Row>

      <Button className={style.cta} disabled={topics?.length == 0} onClick={handleSubmitData} loading={loading}>Submit</Button>
    </div>
  );
}

export default QueryModal;
