import React, { useState } from "react";
import forward from "../assets/forward.svg";
import back from "../assets/back.svg";
import "./Question.css";
//Questions
let questions = [
  { Statement: "I have ambitious aims of making a difference.", num: 1 },
  {
    Statement: "My leadership journey has progressed as I anticipated.",
    num: 2,
  },
  {
    Statement:
      "I have spent fewer than 4 years in full time service or ministry.",
    num: 3,
  },
];

interface RecordsType {
  ques: number;
  sliderValue: string;
}
function Question() {
  //Current question number.
  const [questionNum, setQuestionNum] = useState(1);
  //Progress bars
  const [progressBars, setProgressBars] = useState([
    { name: "IDEALISTIC", score: 20, key: 1 },
    { name: "DISILLUSIONED", score: 0, key: 2 },
    { name: "CYNICAL", score: 0, key: 3 },
    { name: "HOPEFUL", score: 0, key: 4 },
  ]);
  //slider score
  const [slider, setSlider] = useState("0");
  //Records that are to be stored.
  const [records, setRecords] = useState<[] | RecordsType[]>([]);
  //Function which controls the arrow buttons.
  function handleNavigationButtons(direction: "forward" | "back") {
    //If record found or not found
    let matchFound = checkMatch(questionNum + 1);
    //Allow forward if record is present and is not the last question.
    if (direction === "forward" && questionNum !== 3 && matchFound.length > 0) {
      setSlider(matchFound[0].sliderValue);
      handleIdealisticProgressBar("Increase");
      setQuestionNum((prev) => prev + 1);
      //Allow back if it is not the first question.
    } else if (direction === "back" && questionNum !== 1) {
      let matchFound = checkMatch(questionNum - 1);
      setSlider(matchFound[0].sliderValue);
      handleIdealisticProgressBar("Decrease");
      setQuestionNum((prev) => prev - 1);
    }
  }
  //Hanldes change in slider value.
  function handleSliderOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    //If not record found add the record.
    if (records.length === 0) {
      setRecords([{ ques: questionNum, sliderValue: event.target.value }]);
    }
    // Check if there is already a record present with same question name. If available manipulate it or else add the new one.
    else {
      let matchFound = checkMatch(questionNum);
      if (matchFound.length > 0) {
        setRecords((prev) => {
          return prev.map((element) => {
            if (element.ques === questionNum) {
              return { ...element, sliderValue: event.target.value };
            } else {
              return { ...element };
            }
          });
        });
      } else {
        setRecords((prev) => {
          return [
            ...prev,
            { ques: questionNum, sliderValue: event.target.value },
          ];
        });
      }
    }
    //Set the slider value and set it to 0.
    setSlider(event.target.value);
    setTimeout(() => {
      setSlider("0");
    }, 250);
    //Do this if it is not the last question.
    if (questionNum !== 3) {
      handleIdealisticProgressBar("Increase");
      setQuestionNum((prev) => prev + 1);
    }
  }
  //Filter records.
  function checkMatch(num: number) {
    return records.filter((element) => {
      return num === element.ques;
    });
  }
  //Filter question statement.
  let questionStatement = questions.filter((element) => {
    return questionNum === element.num;
  });
  //Decreases or increases progress bar.
  function handleIdealisticProgressBar(state: "Increase" | "Decrease") {
    if (state === "Increase") {
      setProgressBars((prev) => {
        return prev.map((element) => {
          if (element.name === "IDEALISTIC") {
            return { ...element, score: element.score + 20 };
          } else {
            return { ...element };
          }
        });
      });
    } else {
      setProgressBars((prev) => {
        return prev.map((element) => {
          if (element.name === "IDEALISTIC") {
            return { ...element, score: element.score - 20 };
          } else {
            return { ...element };
          }
        });
      });
    }
  }
  return (
    <section className="Question">
      <div className="QuestionContainer">
        <div className="ProgressBars">
          {progressBars.map((element) => {
            return (
              <div key={element.key} className="ProgressBarWrapper">
                <progress
                  id={element.name}
                  max="100"
                  value={element.score}
                ></progress>
                <label htmlFor={element.name}>{element.name}</label>
              </div>
            );
          })}
        </div>
        <div className="QuestionNumber">
          <p>{questionNum} / 3</p>
        </div>
        <p className="QuestionStatement">{questionStatement[0].Statement}</p>
        <div className="SliderWrapper">
          <input
            id="Slider"
            step={25}
            value={slider}
            type="range"
            list="tickmarks"
            onChange={handleSliderOnChange}
          />
          <datalist id="tickmarks">
            <option value="0" label="Strongly Disagree"></option>
            <option value="25" label="Disagree"></option>
            <option value="50" label="Neutral"></option>
            <option value="75" label="Agree"></option>
            <option value="100" label="Strongly Agree"></option>
          </datalist>
        </div>
        <div className="NavigationButtons">
          <div
            onClick={() => {
              handleNavigationButtons("back");
            }}
            className="ButtonWrapper"
          >
            <img src={back} alt="Back arrow" />
            <p>Back</p>
          </div>
          <div
            onClick={() => {
              handleNavigationButtons("forward");
            }}
            className="ButtonWrapper"
          >
            <p>Next</p>
            <img src={forward} alt="Forward arrow" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Question;
