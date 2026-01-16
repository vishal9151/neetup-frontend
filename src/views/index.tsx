import { useEffect, useState } from "react";
import Homepage from "./Main";
import QuestionPage from "./Homepage";


function MainPage() {
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.has("jobId")) {
      setCurrentPage("questionPage");
    } else {
      setCurrentPage("homePage");
    }
  }, []);

  return (
    <div>
      {currentPage === "questionPage" && (
        <>
          <QuestionPage/>  
        </>
      )}
      {currentPage === "homePage" && (
        <>
            <Homepage/>
        </>
      )}
    </div>
  );
}

export default MainPage;
