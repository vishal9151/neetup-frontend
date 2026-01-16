import { Button, Col, message, Radio, Row, Space, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import style from "./style.module.css";
import { CopyOutlined, LoadingOutlined } from "@ant-design/icons";
import { Base_Url, NEETUP_LOGO, Primary_Color } from "../../constants";

/* ===================== TYPES ===================== */
type Question = {
  question: string;
  options: string[];
  correct_answer: string;
  selected_answer: string | null;
};

/* ===================== COMPONENT ===================== */
function QuestionPage() {
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  /* ===================== API CALL ===================== */
  const getJobData = async (jobId: string) => {
    try {
      setLoadingData(true);

      const response = await fetch(`${Base_Url}/api/jobs/${jobId}`);
      const data = await response.json();

      const updatedQuestions: Question[] =
        data?.result?.questions?.map((q: any) => ({
          question: q.question,
          options: Array.isArray(q.options) ? q.options : [],
          correct_answer: q.correct_answer,
          selected_answer: null,
        })) || [];

      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("API Error:", error);
      setQuestions([]);
    } finally {
      setLoadingData(false);
    }
  };

  /* ===================== EFFECT ===================== */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get("jobId");

    if (!jobId) {
      console.error("Job ID missing in URL");
      return;
    }

    getJobData(jobId);
  }, []);

  /* ===================== HANDLERS ===================== */
  const handleOptionChange = (questionIndex: number, value: string) => {
    if (submitted) return;

    setQuestions((prev) =>
      prev.map((q, index) =>
        index === questionIndex
          ? { ...q, selected_answer: value }
          : q
      )
    );
  };

  const handleSubmit = () => {
    let totalScore = 0;

    questions.forEach((q) => {
      if (q.selected_answer === q.correct_answer) {
        totalScore += 1;
      }
    });

    setScore(totalScore);
    setSubmitted(true);
  };

  const handleQuestionCopy = (text : string)=>{
    window.navigator.clipboard.writeText(text);
    message.success("Question Copied 👍")
  }

  const isSubmitDisabled =
    submitted || questions.some((q) => q.selected_answer === null);

  /* ===================== RENDER ===================== */
  return (
    <>
      {loadingData ? (
        <div className={style.spinningContainer}>
          <LoadingOutlined spin style={{ fontSize: 40, color: Primary_Color }} />
          <div className={style.LoadingText} style={{ color: Primary_Color }}>
            Please Wait, Fetching Data...
          </div>
        </div>
      ) : (
        <>
          {/* ---------- HEADER ---------- */}
          <div className={style.header}>
            <img src={NEETUP_LOGO} alt="Neetup Logo" />
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#ffffff" }}>
              Welcome To Neetup...
            </div>
            <Button
              type="primary"
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
              className={style.cta}
              style={{ width: "fit-content" }}
            >
              Submit
            </Button>
          </div>

          {/* ---------- SCORE ---------- */}
          {submitted && (
            <div style={{ textAlign: "center", margin: "16px 0" }}>
              <Tag color="green" style={{ fontSize: "1rem", padding: "8px" }}>
                Score: {score} / {questions.length}
              </Tag>
            </div>
          )}

          {/* ---------- QUESTIONS ---------- */}
          <div style={{ padding: "16px" }}>
            <div className={`${style.scrollContainer} customScroll`} style={{ maxHeight: submitted ? "calc(100vh - 230px)" : "calc(100vh - 160px)" }}>
              {questions.map((q, index) => (
                <div key={index} className={style.outerCardContainer}>
                  {/* Question */}
                  <Row justify={"space-between"} gutter={12} align={"middle"} style={{flexDirection: "row"}}>
                    <Col style={{width: "calc(100% - 50px)"}}>
                      <div
                        style={{
                          fontWeight: 600,
                          marginBottom: "12px",
                          lineHeight: "150%",
                          width: "100%"
                        }}
                      >
                        {index + 1}. {q.question}
                      </div>
                    </Col>
                    <Col>
                        <Tooltip title={"Copy Question"}>
                          <CopyOutlined style={{color: "grey"}} onClick={()=>handleQuestionCopy(q.question)}/>
                        </Tooltip>
                    </Col>
                  </Row>

                  {/* Options */}
                  <Radio.Group
                    value={q.selected_answer}
                    onChange={(e) =>
                      handleOptionChange(index, e.target.value)
                    }
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      {q.options.map((option, i) => {
                        const isCorrect =
                          submitted && option === q.correct_answer;
                        const isWrong =
                          submitted &&
                          option === q.selected_answer &&
                          option !== q.correct_answer;

                        return (
                          <Radio
                            key={i}
                            value={option}
                            disabled={submitted}
                            style={{
                              padding: "10px 12px",
                              borderRadius: "8px",
                              background: isCorrect
                                ? "#f6ffed"
                                : isWrong
                                  ? "#fff2f0"
                                  : "#fafafa",
                              border: isCorrect
                                ? "1px solid #52c41a"
                                : isWrong
                                  ? "1px solid #ff4d4f"
                                  : "1px solid #d9d9d9",
                            }}
                          >
                            {option}
                          </Radio>
                        );
                      })}
                    </Space>
                  </Radio.Group>

                  {/* Correct Answer Label */}
                  {submitted && (
                    <div style={{ marginTop: "8px" }}>
                      <Tag style={{ padding: "4px 6px" }}>
                        Correct Answer: {q.correct_answer}
                      </Tag>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default QuestionPage;
